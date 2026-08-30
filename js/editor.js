/**
 * 写文章页:Markdown 编辑器 + 实时预览 + 生成 .md 文件与配置片段。
 * 纯前端实现,依赖 marked 与 highlight.js(CDN)。
 */

(function () {
  "use strict";

  let idTouched = false; // 用户是否手动改过文件名

  /* ---- DOM 引用 ---- */
  const $ = (id) => document.getElementById(id);
  const el = {
    title: $("f-title"),
    id: $("f-id"),
    date: $("f-date"),
    tags: $("f-tags"),
    desc: $("f-desc"),
    content: $("f-content"),
    preview: $("preview"),
    snippet: $("snippet"),
    charCount: $("char-count"),
  };

  /* ---- 工具 ---- */
  function today() {
    const d = new Date();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${d.getFullYear()}-${m}-${day}`;
  }

  function slugify(str) {
    return String(str).trim().toLowerCase()
      .replace(/[^\w一-龥-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function parseTags(str) {
    return String(str || "")
      .split(/[,;、,\s]+/)
      .map((t) => t.trim())
      .filter(Boolean);
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
    }[c]));
  }

  /* ---- 实时预览 ---- */
  let previewTimer = null;
  function renderPreview() {
    clearTimeout(previewTimer);
    previewTimer = setTimeout(() => {
      const md = el.content.value;
      el.charCount.textContent = md.replace(/\s/g, "").length + " 字";
      if (!md.trim()) {
        el.preview.innerHTML = "";
        return;
      }
      if (!window.marked) {
        el.preview.innerHTML = `<p>无法加载 Markdown 解析器。预览需要联网从 CDN 获取 marked,请检查网络连接。</p>`;
        return;
      }
      const html = marked.parse(md);
      el.preview.innerHTML = html;
      if (window.hljs) {
        el.preview.querySelectorAll("pre code").forEach((c) => hljs.highlightElement(c));
      }
    }, 200);
  }

  /* ---- 生成配置片段 ---- */
  function currentPost() {
    const title = el.title.value.trim();
    const id = el.id.value.trim() || "untitled";
    const tags = parseTags(el.tags.value);
    const desc = el.desc.value.trim();
    return { title, id, date: el.date.value || today(), tags, desc };
  }

  function renderSnippet() {
    const p = currentPost();
    const snippet = `{
  id: "${p.id.replace(/"/g, '\\"')}",
  title: "${p.title.replace(/"/g, '\\"')}",
  date: "${p.date}",
  tags: [${p.tags.map((t) => `"${t.replace(/"/g, '\\"')}"`).join(", ")}],
  desc: "${p.desc.replace(/"/g, '\\"')}",
},`;
    el.snippet.textContent = snippet;
  }

  /* ---- 提示 ---- */
  let toastTimer = null;
  function toast(msg) {
    const t = $("toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("show"), 2200);
  }

  /* ---- 下载 .md ---- */
  function downloadMarkdown() {
    const p = currentPost();
    if (!p.title && !el.content.value.trim()) {
      toast("请先填写标题和正文");
      return;
    }
    const id = p.id || "untitled";
    const blob = new Blob([el.content.value], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = id + ".md";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    toast("已下载 " + id + ".md,记得把它放进 posts/ 目录");
  }

  /* ---- 复制 ---- */
  function copyText(text, successMsg) {
    const done = () => toast(successMsg);
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done).catch(() => fallbackCopy(text, done));
    } else {
      fallbackCopy(text, done);
    }
  }

  function fallbackCopy(text, done) {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand("copy"); done(); } catch (e) { toast("复制失败,请手动复制"); }
    ta.remove();
  }

  /* ---- 文件名自动生成 ---- */
  function autoSuggestId() {
    if (idTouched) return;
    const slug = slugify(el.title.value);
    // 纯 ASCII 的 slug 直接用;中文标题则退回按日期命名
    if (/^[a-z0-9-]+$/.test(slug)) {
      el.id.value = slug;
    } else {
      el.id.value = "post-" + (el.date.value || today()).replace(/-/g, "");
    }
  }

  /* ---- 事件绑定 ---- */
  function bind() {
    el.content.addEventListener("input", () => { renderPreview(); });
    el.title.addEventListener("input", () => { autoSuggestId(); renderSnippet(); });
    el.id.addEventListener("input", () => { idTouched = true; renderSnippet(); });
    el.date.addEventListener("input", () => { autoSuggestId(); renderSnippet(); });
    el.tags.addEventListener("input", renderSnippet);
    el.desc.addEventListener("input", renderSnippet);

    $("btn-download").addEventListener("click", downloadMarkdown);
    $("btn-copy-config").addEventListener("click", () =>
      copyText(el.snippet.textContent, "配置片段已复制"));
    $("btn-copy-body").addEventListener("click", () =>
      copyText(el.content.value, "正文已复制"));
    $("btn-clear").addEventListener("click", () => {
      ["title", "id", "tags", "desc", "content"].forEach((k) => (el[k].value = ""));
      el.date.value = today();
      idTouched = false;
      renderPreview();
      renderSnippet();
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    el.date.value = today();
    renderSnippet();
    bind();
  });
})();

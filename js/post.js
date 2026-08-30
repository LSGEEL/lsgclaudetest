/**
 * 文章详情页:读取 URL 中的 id,加载对应 markdown 并渲染。
 * 依赖 config.js(SITE)、main.js(Blog)、marked、highlight.js。
 */

(function () {
  "use strict";

  const DEFAULT_TITLE = Blog.SITE.title || "博客";

  function getPostId() {
    return new URLSearchParams(location.search).get("id");
  }

  function setMeta(post) {
    document.title = `${post.title} · ${Blog.SITE.title}`;
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.content = post.desc || post.title;
  }

  function renderHeaderInfo(post) {
    document.getElementById("post-title").textContent = post.title;

    const meta = document.getElementById("post-meta");
    meta.innerHTML = `
      <span>${Blog.esc(Blog.formatDate(post.date))}</span>
      <span class="dot">·</span>
      <span id="post-reading-time">…</span>
      <span class="dot">·</span>
      <span>${Blog.esc(Blog.SITE.author)}</span>`;

    const tags = document.getElementById("post-tags");
    tags.innerHTML = (post.tags || []).map((t) => Blog.tagEl(t).outerHTML).join("");
  }

  function highlightCode(root) {
    if (!window.hljs) return;
    root.querySelectorAll("pre code").forEach((el) => {
      hljs.highlightElement(el);
    });
  }

  async function loadAndRender() {
    const id = getPostId();
    const post = id ? Blog.findPost(id) : null;
    const contentEl = document.getElementById("post-content");

    if (!post) {
      document.title = `文章不存在 · ${DEFAULT_TITLE}`;
      document.getElementById("post-title").textContent = "文章不存在 😢";
      contentEl.innerHTML = `<p>没有找到你要找的文章,可能链接有误或被移除了。</p>`;
      document.getElementById("post-meta").textContent = "";
      document.getElementById("post-tags").textContent = "";
      return;
    }

    setMeta(post);
    renderHeaderInfo(post);

    try {
      const res = await fetch(Blog.postFile(post));
      if (!res.ok) throw new Error("HTTP " + res.status);
      const markdown = await res.text();

      // 配置 marked:启用 GFM(表格/删除线等)
      if (window.marked && window.marked.setOptions) {
        marked.setOptions({ gfm: true, breaks: false });
      }
      const html = window.marked ? marked.parse(markdown) : `<pre>${Blog.esc(markdown)}</pre>`;

      contentEl.innerHTML = html;
      highlightCode(contentEl);

      // 更新阅读时长(基于正文实际字数)
      const rt = document.getElementById("post-reading-time");
      if (rt) rt.textContent = Blog.readingTime(markdown);
    } catch (err) {
      console.error("加载文章失败:", err);
      contentEl.innerHTML = `<p>⚠️ 文章内容加载失败,请确认 markdown 文件是否存在。</p>`;
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    loadAndRender();
    const backTop = document.getElementById("back-top");
    if (backTop) backTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  });
})();

/**
 * 站点公共逻辑:主题切换、页头/页脚渲染、通用工具函数。
 * 依赖:config.js 中定义的 window.SITE。
 */

(function () {
  "use strict";

  const SITE = window.SITE || { title: "博客", nav: [], social: [] };

  /* ----------------------------------------------------------------------
   * 通用工具(挂到 window.Blog 供各页面使用)
   * -------------------------------------------------------------------- */
  const Blog = {
    SITE,

    /** 格式化日期:2026-08-26 -> 2026 年 8 月 26 日 */
    formatDate(iso) {
      if (!iso) return "";
      const [y, m, d] = String(iso).split("-");
      const months = ["1 月", "2 月", "3 月", "4 月", "5 月", "6 月",
        "7 月", "8 月", "9 月", "10 月", "11 月", "12 月"];
      return `${y} 年 ${months[parseInt(m, 10) - 1]} ${parseInt(d, 10)} 日`;
    },

    /** 估算阅读时长(中文约 400 字/分钟) */
    readingTime(text) {
      const chars = (text || "").replace(/\s/g, "").length;
      return Math.max(1, Math.round(chars / 400)) + " 分钟";
    },

    /** 文章按日期倒序 */
    sortedPosts() {
      return [...SITE.posts].sort((a, b) => (a.date < b.date ? 1 : -1));
    },

    /** 汇总所有标签(去重) */
    allTags() {
      const set = new Set();
      SITE.posts.forEach((p) => (p.tags || []).forEach((t) => set.add(t)));
      return [...set];
    },

    /** 生成一个标签元素 */
    tagEl(name) {
      const span = document.createElement("span");
      span.className = "tag";
      span.textContent = name;
      return span;
    },

    /** 根据 id 查找文章 */
    findPost(id) {
      return SITE.posts.find((p) => p.id === id);
    },

    /** 文章对应的 markdown 文件路径 */
    postFile(post) {
      return post.file || `posts/${post.id}.md`;
    },

    /** 安全转义,用于把纯文本插入 DOM */
    esc(str) {
      return String(str).replace(/[&<>"']/g, (c) => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
      }[c]));
    },
  };

  /* ----------------------------------------------------------------------
   * 主题切换
   * -------------------------------------------------------------------- */

  // 图标:深色模式显示「切到浅色」的太阳,浅色模式显示「切到深色」的月亮
  const ICON_SUN =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4.5"/>' +
    '<path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2' +
    'M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';

  const ICON_MOON =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z"/></svg>';

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    const btn = document.getElementById("theme-toggle");
    if (btn) {
      const toLight = theme === "dark";
      btn.innerHTML = toLight ? ICON_SUN : ICON_MOON;
      btn.setAttribute("aria-label", toLight ? "切换到浅色主题" : "切换到深色主题");
      btn.setAttribute("title", toLight ? "切换到浅色主题" : "切换到深色主题");
    }
  }

  function initTheme() {
    let theme = localStorage.getItem("theme");
    if (!theme) {
      theme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark" : "light";
    }
    applyTheme(theme);

    const btn = document.getElementById("theme-toggle");
    if (btn) {
      btn.addEventListener("click", () => {
        const next = document.documentElement.getAttribute("data-theme") === "dark"
          ? "light" : "dark";
        localStorage.setItem("theme", next);
        applyTheme(next);
      });
    }
  }

  /* ----------------------------------------------------------------------
   * 页头 / 页脚渲染
   * -------------------------------------------------------------------- */
  function renderHeader() {
    const header = document.getElementById("site-header");
    if (!header) return;

    const currentPage = location.pathname.split("/").pop() || "index.html";

    const navLinks = (SITE.nav || [])
      .map((n) => {
        const isActive = currentPage === n.href;
        return `<a href="${Blog.esc(n.href)}" class="${isActive ? "active" : ""}">${Blog.esc(n.label)}</a>`;
      })
      .join("");

    header.innerHTML = `
      <a class="skip-link" href="#main">跳到主要内容</a>
      <div class="header-inner">
        <a class="brand" href="index.html"><span class="prompt">${Blog.esc(SITE.logo || "$")}</span><span>${Blog.esc(SITE.title)}</span></a>
        <nav class="nav">${navLinks}</nav>
        <button id="theme-toggle" class="theme-toggle" type="button" aria-label="切换主题"></button>
      </div>`;
  }

  function renderFooter() {
    const footer = document.getElementById("site-footer");
    if (!footer) return;

    const social = (SITE.social || [])
      .map((s) => `<a href="${Blog.esc(s.href)}" target="_blank" rel="noopener">${Blog.esc(s.label)}</a>`)
      .join("");

    footer.innerHTML = `
      <div class="footer-social">${social}</div>
      <div>© ${new Date().getFullYear()} ${Blog.esc(SITE.author)} · ${Blog.esc(SITE.title)}</div>
      <div style="margin-top:6px">$ echo "powered by plain HTML / CSS / JS"</div>`;
  }

  /* ----------------------------------------------------------------------
   * 初始化
   * -------------------------------------------------------------------- */
  document.addEventListener("DOMContentLoaded", () => {
    renderHeader();
    renderFooter();
    initTheme();
  });

  // 提前暴露工具函数,供页面脚本在 DOMContentLoaded 之前引用
  window.Blog = Blog;
})();

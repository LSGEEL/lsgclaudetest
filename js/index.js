/**
 * 首页:渲染文章列表 + 标签筛选。
 * 依赖 config.js(SITE) 和 main.js(Blog 工具)。
 */

(function () {
  "use strict";

  let activeTag = "全部"; // 当前选中的标签

  function renderFilters() {
    const box = document.getElementById("tag-filter");
    if (!box) return;

    const tags = ["全部", ...Blog.allTags()];
    box.innerHTML = tags
      .map((t) => `<button class="filter-btn${t === activeTag ? " active" : ""}" data-tag="${Blog.esc(t)}">${Blog.esc(t)}</button>`)
      .join("");

    box.querySelectorAll(".filter-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        activeTag = btn.dataset.tag;
        box.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        renderList();
      });
    });
  }

  function renderList() {
    const box = document.getElementById("post-list");
    if (!box) return;

    const posts = Blog.sortedPosts().filter(
      (p) => activeTag === "全部" || (p.tags || []).includes(activeTag)
    );

    if (!posts.length) {
      box.innerHTML = `<div class="empty">当前标签下还没有文章。</div>`;
      return;
    }

    box.innerHTML = posts
      .map((p) => {
        const tags = (p.tags || []).map((t) => Blog.tagEl(t).outerHTML).join("");
        const desc = p.desc ? `<div class="post-desc">${Blog.esc(p.desc)}</div>` : "";
        return `
          <a class="post-card" href="post.html?id=${encodeURIComponent(p.id)}">
            <div class="post-title"><span class="prompt">&gt;</span>${Blog.esc(p.title)}<span class="ext">.md</span></div>
            <div class="post-meta">[${Blog.esc(Blog.formatDate(p.date))}] · ${Blog.esc(Blog.SITE.author)}</div>
            ${desc}
            <div class="post-tags">${tags}</div>
          </a>`;
      })
      .join("");
  }

  document.addEventListener("DOMContentLoaded", () => {
    // 让首页标题 / tagline 与 config.js 保持一致(单一数据源)
    const heroTitle = document.getElementById("hero-title");
    if (heroTitle && Blog.SITE.title) heroTitle.textContent = Blog.SITE.title;
    const tagline = document.querySelector(".hero .tagline");
    if (tagline && Blog.SITE.tagline) tagline.textContent = Blog.SITE.tagline;

    renderFilters();
    renderList();
  });
})();

/**
 * 站点配置
 * 修改这里即可管理站点信息和文章列表,无需改动页面代码。
 */

window.SITE = {
  // ---- 站点信息 ----
  // 命名建议:「昵称 + 技术笔记」,例如 "小明的技术笔记"
  title: "技术笔记",
  author: "你的名字",
  description: "记录技术、踩坑与思考。",
  // 首页副标题 / 一句话简介
  tagline: "记录技术、踩坑与思考",

  // ---- 导航(顶部) ----
  nav: [
    { label: "首页", href: "index.html" },
    { label: "写文章", href: "editor.html" },
    { label: "关于", href: "about.html" },
  ],

  // ---- 社交链接(页脚/关于页使用) ----
  social: [
    { label: "GitHub", href: "https://github.com/yourname" },
    { label: "邮箱", href: "mailto:you@example.com" },
  ],

  // ---- 页头提示符图标 ----
  logo: "$",

  /**
   * ---- 文章列表 ----
   * 按 date 倒序展示(最新在前)。
   * 字段说明:
   *   id     唯一标识,同时作为 markdown 文件名(见 file)
   *   title  文章标题
   *   date   发布日期(YYYY-MM-DD)
   *   tags   标签数组,用于分类筛选
   *   desc   列表页显示的摘要(一句话)
   *   file   对应的 markdown 文件路径(可选,默认 posts/{id}.md)
   */
  posts: [
    {
      id: "hello-world",
      title: "你好,世界 —— 我的第一篇博客",
      date: "2026-08-26",
      tags: ["随笔"],
      desc: "搭建这个博客的初衷,以及一些想说的话。",
    },
    {
      id: "markdown-guide",
      title: "Markdown 写作与代码高亮指南",
      date: "2026-08-20",
      tags: ["教程", "技术"],
      desc: "一篇文章学会本站支持的 Markdown 语法和代码高亮。",
    },
    {
      id: "static-blog",
      title: "为什么我选择纯静态博客",
      date: "2026-08-12",
      tags: ["技术", "随笔"],
      desc: "聊聊纯 HTML/CSS/JS + Markdown 构建博客的思路。",
    },
  ],
};

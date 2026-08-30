# 技术笔记 —— 纯静态个人博客(终端代码风)

一个用**纯 HTML + CSS + JavaScript** 构建的个人博客,文章用 **Markdown** 书写,通过 **JavaScript 配置**管理,零构建、零后端,可直接部署到 GitHub Pages / EdgeOne Pages 等静态托管平台。

## 功能

- 📄 文章列表页(终端文件列表风格,`>` 提示符)
- 📝 文章详情页(Markdown 渲染 + 代码高亮)
- 👤 关于页面
- 🏷️ 标签分类筛选
- 🌙 深色 / 浅色主题切换(跟随系统,可手动切换并记住偏好)
- ✨ 代码块语法高亮(highlight.js)
- ✍️ 站内写作页(Markdown 编辑器 + 实时预览,一键下载 .md 与配置片段)

## 目录结构

```
claude-test/
├── index.html          # 首页(文章列表 + 标签筛选)
├── post.html           # 文章详情页(?id=xxx)
├── about.html          # 关于页
├── editor.html         # 写文章页(Markdown 编辑器 + 预览)
├── css/
│   └── style.css       # 全部样式(含主题变量)
├── js/
│   ├── config.js       # ⭐ 站点配置 + 文章列表(主要改这里)
│   ├── main.js         # 公共逻辑:主题切换、页头页脚、工具函数
│   ├── index.js        # 首页渲染逻辑
│   ├── post.js         # 详情页渲染逻辑
│   └── editor.js       # 写文章页逻辑
├── posts/              # 文章 Markdown 文件
│   ├── hello-world.md
│   ├── markdown-guide.md
│   └── static-blog.md
└── README.md
```

## 快速开始

### 本地预览

> ⚠️ 注意:直接双击 `index.html`(`file://` 协议)时,浏览器会因安全策略**阻止** `fetch` 读取 Markdown 文件。请务必用本地服务器预览。

任选一种方式启动本地服务器:

```bash
# Python(Windows / macOS / Linux 通用)
python -m http.server 8080

# 或使用 Node
npx serve .
```

然后访问 <http://localhost:8080>。

### 写一篇新文章

**方式一(推荐):用站内写作页**

1. 访问 `http://localhost:8080/editor.html`(或点击导航栏的「写文章」)。
2. 填写标题、标签、正文等,右侧实时预览。
3. 点「下载 .md 文件」,把下载的 `.md` 放进 `posts/` 目录。
4. 点「复制配置片段」,粘贴到 [js/config.js](js/config.js) 的 `posts` 数组里。
5. 保存后刷新即可看到新文章。

> 说明:纯静态站点没有后端,浏览器无法直接把文章保存到服务器,所以需要「下载文件 + 粘贴配置」这一步。

**方式二:手动创建**

1. 在 `posts/` 目录新建一个 Markdown 文件,例如 `my-first-post.md`,写入正文。
2. 在 [js/config.js](js/config.js) 的 `posts` 数组里加一条记录:

```js
{
  id: "my-first-post",           // 唯一标识,同时决定默认文件名
  title: "我的第一篇新文章",
  date: "2026-08-30",
  tags: ["随笔"],
  desc: "文章摘要,显示在列表卡片上。",
  color: "#3fb950",               // 列表左侧强调色(可选)
  // file: "posts/custom-name.md" // 若文件名与 id 不同,可手动指定
}
```

保存后刷新即可看到新文章,无需任何构建。

### 自定义站点信息

编辑 [js/config.js](js/config.js) 顶部的 `SITE` 对象:

- `title` / `author` / `tagline` / `description` —— 站点名称、作者、简介
- `nav` —— 顶部导航
- `social` —— 页脚与关于页的社交链接
- `logo` —— 页头提示符(默认 `$`)

### 修改配色 / 主题

在 [css/style.css](css/style.css) 顶部的 `:root`(深色/终端,默认)和 `[data-theme="light"]`(浅色/纸面)里调整 CSS 变量即可,例如 `--accent`、`--bg`、`--card` 等。

### 替换占位内容

首次使用前,把以下占位文字替换成你自己的信息(可用编辑器全局搜索替换):

- `技术笔记` —— 站点名(出现在各页面 `<title>` 与 `config.js` 的 `title`;建议改成「你的昵称 + 技术笔记」)
- `你的名字` —— 作者名([js/config.js](js/config.js) 的 `author` 及 [about.html](about.html))
- `you@example.com` / `github.com/yourname` —— 社交链接([js/config.js](js/config.js) 的 `social`)

## 部署

### GitHub Pages

1. 把本项目推送到 GitHub 仓库。
2. 仓库 `Settings` → `Pages` → `Build and deployment` 下:
   - **Source**:`Deploy from a branch`
   - **Branch**:选择 `main`(或你的默认分支),目录选 `/ (root)`,保存。
3. 稍等片刻,访问 `https://<你的用户名>.github.io/<仓库名>/`。

> 项目已包含 `.nojekyll` 空文件,可避免 Jekyll 干扰 Markdown 文件的访问。

### EdgeOne Pages(腾讯云)

1. 登录 [EdgeOne Pages 控制台](https://console.cloud.tencent.com/edgeone/pages),创建项目。
2. 选择「导入 Git 仓库」并授权你的仓库,或直接上传本目录。
3. 构建配置保持默认即可(**无需构建命令**,输出目录填 `.` 或留空/填 `/`)。
4. 部署完成后即可通过分配的域名访问。

## 依赖说明

站点运行时通过 CDN 加载两个库(仅详情页需要):

- [marked](https://marked.js.org/) —— Markdown 解析
- [highlight.js](https://highlightjs.org/) —— 代码高亮

它们由 `jsdelivr` CDN 提供,访问时需要联网。若希望完全离线/自托管,可下载这两个库放入 `js/` 或 `vendor/` 目录,并在 [post.html](post.html) 中把 CDN 链接替换为本地路径即可。

# pordotech.github.io

PordoTech 组织官网：Pordo 产品介绍、下载页与中英文使用文档。
技术栈：Astro + Starlight，静态输出，GitHub Pages 部署。

线上地址：https://pordotech.github.io/

- 中文为根目录（`/`），英文在 `/en/`；文档路径统一以 `/` 结尾（`trailingSlash: 'always'`）。
- 首页与下载页是自定义 Astro 页面；`/docs/`、`/guides/*`、`/developers/` 由 Starlight 内容集合生成。
- 下载页数据只来自 `PordoTech/pordo` 的 GitHub Releases（latest stable），不拼接猜测链接，不使用 token。

## 环境要求

- Node.js 24.x（GitHub Actions 同样使用 24）。
- 本机注意：这台开发机的系统 Node 26.12.1 存在 CJS `ParsePackageJSON` 崩溃
  （SIGABRT），任何 npm/node_modules 解析都会中止。开发时请使用
  `export PATH="/opt/homebrew/opt/node@24/bin:$PATH"` 切到 Node 24。
  该问题属于本机 Node 安装，与站点代码无关。

## 常用命令

```sh
npm ci            # 按 lockfile 安装（CI 与本地一致；提交 lockfile）
npm run dev       # 开发服务器 http://localhost:4321/
npm run build     # 生产构建 → dist/
npm run preview   # 本地预览 dist/ 产物
npm run check     # astro check（类型与内容集合校验）
npm run check:links  # 构建后检查 dist/ 内部链接、锚点与本地资源
npm test          # node --test tests/*.test.ts（下载解析逻辑单元测试）
```

验收顺序建议：`npm ci` → `npm run check` → `npm run build` → `npm test` →
`npm run check:links` → `npm run preview` 人工检查。

## 目录结构

```text
├── .github/workflows/deploy.yml   # Pages 部署 workflow
├── public/images/                 # Logo 等静态图片（favicon、首页、下载页共用）
├── scripts/check-links.mjs        # dist 内部链接/锚点检查
├── src/
│   ├── components/
│   │   ├── Landing.astro          # 首页（中英共用，文案来自 lib/i18n.ts）
│   │   └── DownloadPage.astro     # 下载页（中英共用 + Releases 渐进增强脚本）
│   ├── content/docs/              # 中文文档（根语言）；en/ 为英文对应页
│   ├── lib/
│   │   ├── site.ts                # 站点/仓库固定 URL 单一来源
│   │   ├── releases.ts            # 下载解析核心（纯模块，可被 node --test 直接加载）
│   │   └── i18n.ts                # 首页/下载页中英 UI 文案字典
│   ├── pages/                     # index、download 及 en/ 包装页
│   ├── styles/                    # landing.css（首页/下载页）、starlight.css（文档主题覆盖）
│   └── content.config.ts          # Starlight docs 集合
├── tests/                         # releases.test.ts + fixtures.ts（真实 Release 附件样本）
├── astro.config.mjs               # site/base、语言、侧边栏（含英文翻译标签）
├── CONTENT_SOURCES.md             # 页面内容与来源/核对记录
└── README.md
```

## 翻译约定

- 文档正文分语言维护：中文在 `src/content/docs/`，英文在
  `src/content/docs/en/`，路径与文件名一一对应，导航项一一对应。
  英文缺页时 Starlight 自动回退到中文内容。
- 首页与下载页不复制两份页面逻辑：中英共用 `Landing.astro` /
  `DownloadPage.astro`，文案全部集中在 `src/lib/i18n.ts` 的字典里，
  类型接口保证两种语言字段一一对应。
- 侧边栏标签在 `astro.config.mjs` 中用 `translations: { en: ... }` 提供英文。
- 内容边界（不可放松）：Android 只写已核实能力（音乐、漫画、收藏、进度、
  WebDAV、Komiic 账号）；未核实能力（如 Android 在线音源、AI 歌词、界面语言）
  用“—/未核实”表示；不写“完全离线”“所有数据只在本地”；AI 数据发送与计费、
  WebDAV 同步范围提示必须保留。
- 每篇文档开头注明适用平台与内容核对依据（当前：main `893459a` + v0.5.1，
  2026-10-31）。

## 添加页面

1. 在 `src/content/docs/`（及 `en/`）新建同名 `.mdx` 文件；slug 即路径
   （`guides/foo.mdx` → `/guides/foo/`，英文 → `/en/guides/foo/`）。
2. 在 `astro.config.mjs` 的 `sidebar` 中添加条目（带 `translations.en`）。
3. 若首页/下载页需要入口，更新 `i18n.ts` 字典与相应组件链接。
4. `npm run check && npm run build && npm run check:links` 验证。

注意（Astro 7.4.x 已知问题）：**不要在 `.astro` frontmatter 里写 JSX**
（例如把 `<svg>` 赋给变量）。compiler-rs 遇到 frontmatter JSX 会跳过 TS
剥离，随后 `vite-plugin-import-meta-env` 以 `lang:"js"` 解析残留的
`interface` 等 TS 语法并构建失败（PARSE_ERROR）。需要动态图标时使用字符串 +
`set:html`，见 `Landing.astro` 的 `icons`。

## 下载页解析策略

- 单一来源：`GET https://api.github.com/repos/PordoTech/pordo/releases/latest`
  （实现于 `src/lib/releases.ts`，只请求一次，同一响应驱动四张卡片）。
- 过滤 draft 与 prerelease（如历史 `deps-ffmpeg-*` 预发布不应出现）。
- 按平台/架构/扩展名精确匹配附件，兼容 `pordo-` 与 `replayer-` 两种文件名前缀
  （v0.5.1 及更早为 `replayer-`，发布文档规定后续为 `pordo-`）。
- 直链只用响应中的 `browser_download_url`；校验和链接只指向该版本实际存在的
  `SHA256SUMS-*` 附件。
- 缺附件 → 显示“本版本暂无此平台安装包”，保留 Releases 入口，不回退旧版本附件。
- 超时/限流/离线/异常 → 恢复静态默认链接（“前往 Releases”）；解析成功后按钮
  改为“下载安装包”。无 JS 时页面即为静态默认链接，功能完整可用。
- 单元测试 `tests/releases.test.ts` 使用真实 v0.5.1 / v0.5.0 附件清单做 fixtures，
  覆盖完整附件、缺 Android 包、同平台双架构、便携包/安装包区分、API 错误等。

## Pages 配置与部署

- 仓库名即组织主页域名：`https://pordotech.github.io/`，`base` 为 `/`。
  若迁移到子路径，设置 `SITE_URL` / `BASE_PATH` 环境变量（`astro.config.mjs` 读取）。
- `.github/workflows/deploy.yml`：`actions/checkout@v4` → `withastro/action@v3`
  （Node 24，`npm ci` + build）→ `actions/deploy-pages@v4`。
- 仓库已启用 GitHub Pages，Source 为“GitHub Actions”；推送到 `main`
  后自动构建并部署。首次上线日期：2026-10-31。

## 内容更新流程

- 内容事实以 pordo/remdia 仓库文档为准；本站只做面向用户的教程整理，
  页面 → 来源映射与核对记录见 `CONTENT_SOURCES.md`。
- 每次应用发版：核对下载页文案（安装/更新说明）、平台能力简表、
  `guides/install-update`、`guides/android` 与相关指南；更新各页“核对依据”
  中的版本/提交与日期；重跑 `npm run build && npm run check:links && npm test`。
- 不建立自动镜像仓库 docs 的流水线；不做整目录复制。

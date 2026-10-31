# CONTENT_SOURCES

本站页面内容与来源的映射记录（对应组织方案 §8“首轮整理 CONTENT_SOURCES.md”）。

## 核对基线

| 项目 | 值 |
| --- | --- |
| 核对日期 | 2026-10-31 |
| pordo 仓库 | `PordoTech/pordo`，远端 main = 本地 main = `893459a`（Pordo 更名提交，尚未随任何 Release 发布） |
| pordo 最新正式版 | v0.5.1（2026-10-30，tag `a477e6b`），附件使用 `replayer-0.5.1-*` 前缀 |
| pordo 许可 | 仓库根目录**无 LICENSE 文件**（远端核实）；本站不对 pordo 作许可宣称 |
| remdia 仓库 | `PordoTech/remdia`，远端 main `0e92f2b5b`，MIT（LICENSE 存在，远端核实） |
| Releases API | `https://api.github.com/repos/PordoTech/pordo/releases/latest` → v0.5.1；存在需过滤的预发布 `deps-ffmpeg-9.0.2` |
| 品牌素材 | `replayer/assets/branding/`（本地），远端 main 同路径存在；站点图片为其副本/缩放 |

v0.5.1 附件清单（远端核实）：`replayer-0.5.1-{windows-x86_64-setup.exe,
windows-x86_64.zip, macos-aarch64.dmg/.zip, macos-x86_64.dmg/.zip,
android-arm64-v8a.apk}`、`SHA256SUMS-{windows-x86_64, macos-aarch64,
macos-x86_64, android-arm64-v8a}.txt`、`SHA256SUMS.txt`、`android-release.json`。
v0.5.0 无 Android 附件（fixtures 覆盖该场景）。

## 页面 → 来源映射

来源路径均相对 `player/`（`replayer/` 即 pordo 仓库检出）。

| 站点页面 | 主要来源 |
| --- | --- |
| `/`、`/en/`（首页） | `pordo-organization-plan.md` §5；`replayer/README.md`（功能与平台表）；`replayer/docs/guide.md`；`replayer/docs/android.md`（Android 范围） |
| `/download/`、`/en/download/` | 方案 §7；`replayer/docs/releasing.md`（包命名、更新行为、签名）；`replayer/docs/android.md`（签名与测试包迁移）；`replayer/README.md`（macOS 放行、平台表）；Releases API 实测数据 |
| `/docs/`、`/en/docs/`（文档索引） | `replayer/README.md`；方案 §6；平台简表与首页一致（`src/lib/i18n.ts`） |
| `/guides/getting-started/` | `replayer/README.md`（Download and start）；`replayer/docs/guide.md`（Install、Music and video、快捷键表）；`replayer/docs/android.md`（Android 功能范围） |
| `/guides/install-update/` | `replayer/docs/guide.md`（Install and update、旧仓库迁移）；`replayer/docs/releasing.md`（包命名、更新行为、签名、校验）；`replayer/README.md`（平台表、ad-hoc 签名）；`replayer/docs/android.md`（正式签名与发布、测试包迁移）；`replayer/docs/development.md`（品牌与升级兼容、数据目录） |
| `/guides/music-video/` | `replayer/docs/guide.md`（Music and video、歌词、快捷键）；`replayer/docs/remdia.md`（编解码现状、定位限制）；`replayer/docs/development.md`（PORDO_SOFTWARE 等仅开发者项未搬入） |
| `/guides/online-music/` | `replayer/docs/guide.md`（Online music、QQ Music local files、sidecar）；`replayer/docs/development.md`（`.pordo.*`/`.replayer.*` 命名）；`replayer/docs/android.md`（Android 在线收藏随同步） |
| `/guides/comics/` | `replayer/docs/guide.md`（Comics）；`replayer/docs/android.md`（Komiic 账号与自动登录、Android 入口、已读语义）；`replayer/README.md` |
| `/guides/ai/` | `replayer/docs/guide.md`（AI subtitles、歌词、漫画翻译、数据发送/计费）；`replayer/README.md` |
| `/guides/webdav-sync/` | `replayer/docs/guide.md`（Cloud sync and local data）；`replayer/docs/android.md`（Android 云同步：入口、时机、防跳转、KeyStore、allowBackup）；`replayer/docs/development.md`（数据目录、XDG、replayer 目录复用）；`replayer/docs/third-party.md`（v1 加密格式背景，未展开技术细节） |
| `/guides/magnet/` | `replayer/docs/guide.md`（Magnet links） |
| `/guides/android/` | `replayer/docs/android.md`（正式签名与发布、Komiic、云同步、TLS 修复）；`replayer/docs/releases/v0.5.1.md`（首版功能）；`replayer/README.md`（平台表） |
| `/guides/faq/` | 上述各指南的失败处理汇总；`replayer/docs/guide.md`；`replayer/docs/android.md` |
| `/developers/` | `replayer/README.md`（Development）；`replayer/docs/development.md`；`replayer/docs/remdia.md`；`replayer/docs/third-party.md`；remdia 远端 main 文档清单（API 核实存在） |
| 404 | Starlight 约定 `src/content/docs/404.md`（参考站同模式），双语文案 |
| `.github/profile/README.md`（组织主页，另仓库） | 方案 §4；Logo raw URL 指向 pordo 远端 main `assets/branding/pordo-icon-256.png`（存在性已核实） |

## 有意取舍与差异记录

- **发布 vs 主分支**：v0.5.1 附件仍为 `replayer-` 前缀；`pordo-` 前缀来自
  main 上的发布文档（`releasing.md`），站点下载解析同时接受两种前缀，文案注明
  两种前缀指向同一产品。
- **旧仓库迁移提示**：v0.5.1 及更早 Windows 客户端按旧仓库地址校验更新
  （`guide.md`、`README.md` 一致），下载页与 install-update/faq 均保留该提示。
- **remdia 文档链接范围**：只链接远端 main 实际存在的文件；`docs/linking.md`、
  `docs/android.md` 仅存在于本地 feature 分支，未链接。
- **设计稿**：`replayer/docs/design/replayer-v1/` 是设计稿，站点未用作产品截图；
  首页使用 Logo 与内联 SVG 图标（方案 §5.2）。
- **架构文档时效**：方案 §2 指出 architecture.md 凭据描述与 README/guide 有出入；
  站点凭据表述以 guide/android/README（Credential Manager / Keychain / KeyStore）
  为准，developers 页仅链接 architecture.md，不复制其内容。
- **字幕 CLI**（development.md 的 `pordo --subtitles`）未写入用户指南：无法核实
  其是否随 v0.5.1 发布，仅在 developers 页链接来源文档。
- **pordo 许可**：远端无根 LICENSE；developers 页如实说明并引导至 Issues 询问，
  未复制 Torto 或任何第三方的许可文案。
- **Windows 最低版本**：发布资料无依据，全站不宣称。
- **构建告警**：`i18n` 集合为空与 `/404` 路由优先级两条警告为 Starlight 已知
  行为，404 内容仍按 `docs/404.md` 渲染（已验证 dist/404.html）。

## 未核实 / 不作宣称清单

| 项目 | 处理 |
| --- | --- |
| Android 在线音源搜索/播放能力 | 简表标“—”；online-music 页注明“未核实，不作宣称” |
| Android AI 歌词 | android 页明确“未核实，不作宣称” |
| Android 界面语言范围 | android/getting-started 页注明未核实 |
| Windows 最低版本 | 不宣称 |
| Authenticode / 公证状态 | 如实说明“无发布者签名、ad-hoc、未公证”；哈希仅证明完整性 |
| SmartScreen 等系统弹窗具体表现 | 未实测，不描述具体弹窗文案 |
| pordo 许可 | 无 LICENSE，不作任何许可宣称 |
| 组织远端仓库（pordotech.github.io、.github） | 截至核实时不存在，本轮只交付本地文件 |

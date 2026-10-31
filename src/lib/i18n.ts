/**
 * 首页与下载页的共享 UI 文案（中英双语，单一来源）。
 *
 * 中文与英文页面共用同一组件，只有本文件里的字典区分语言，
 * 避免两份页面逻辑漂移。类型接口保证两种语言字段一一对应。
 *
 * 内容边界（对应组织方案 §6）：
 * - Android 能力只写已核实的：音乐、漫画、收藏、进度、WebDAV。
 * - 视频、AI 字幕、漫画翻译界面明确标注仅桌面。
 * - AI 与 WebDAV 的数据发送/计费/同步范围提示不可省略。
 * - 不写“完全离线”“所有数据只在本地”等与在线功能冲突的绝对承诺。
 */

export type Lang = 'zh' | 'en';

export interface ScenarioItem {
  title: string;
  text: string;
}

export interface Scenario {
  /** 图标标识，组件内映射为内联 SVG。 */
  icon: 'music' | 'video' | 'comics';
  title: string;
  tagline: string;
  /** 适用平台标注，例如“Windows · macOS · Android”。 */
  platforms: string;
  items: ScenarioItem[];
}

export interface MatrixRow {
  feature: string;
  /** 三个平台依次：Windows、macOS、Android。true=支持，false=未提供/未核实。 */
  support: [boolean, boolean, boolean];
}

export interface DownloadCard {
  id: 'windows-x64' | 'macos-aarch64' | 'macos-x86_64' | 'android-arm64';
  name: string;
  hint: string;
  /** 次入口文案；windows/macOS 为便携包，Android 为安装与签名说明。 */
  secondaryKind: 'portable' | 'android-notes';
  secondaryLabel: string;
}

export interface LandingText {
  pageTitle: string;
  pageDesc: string;
  navDownload: string;
  navDocs: string;
  navRemdia: string;
  langLabel: string;
  langSwitchAria: string;
  heroBadge: string;
  heroH1: string;
  heroH1Highlight: string;
  heroLead: string;
  ctaDownload: string;
  ctaStart: string;
  heroLogoAlt: string;
  scenariosKicker: string;
  scenariosTitle: string;
  scenariosSub: string;
  scenarios: Scenario[];
  aiSyncTitle: string;
  aiCardTitle: string;
  aiCardText: string;
  syncCardTitle: string;
  syncCardText: string;
  matrixTitle: string;
  matrixNote: string;
  matrixHead: [string, string, string, string];
  matrixRows: MatrixRow[];
  matrixYes: string;
  matrixNo: string;
  remdiaTitle: string;
  remdiaText: string;
  remdiaDocsBtn: string;
  remdiaGithubBtn: string;
  bannerH2: string;
  bannerP: string;
  footerCopy: string;
  footerDocs: string;
  footerReleases: string;
  footerIssues: string;
  footerLicenses: string;
  skipToContent: string;
}

export interface DownloadText {
  pageTitle: string;
  pageDesc: string;
  navDocs: string;
  langLabel: string;
  langSwitchAria: string;
  h1: string;
  sub: string;
  cards: DownloadCard[];
  /** 无 JS / 未查询时的静态状态行。 */
  statusStatic: string;
  statusChecking: string;
  statusUnavailable: string;
  statusMissing: string;
  /** 取得附件前的默认按钮文案。 */
  btnFallback: string;
  /** 取得对应附件后的按钮文案。 */
  btnDownload: string;
  btnAriaResolved: string;
  versionPrefix: string;
  publishedLabel: string;
  checksumLabel: string;
  notesTitle: string;
  notes: string[];
  namingTitle: string;
  namingText: string;
  guidesTip: string;
  guideLinks: { label: string; hrefKind: 'getting-started' | 'install-update' | 'webdav-sync' | 'android' }[];
  footerCopy: string;
  footerDocs: string;
  footerReleases: string;
  skipToContent: string;
}

const zhLanding: LandingText = {
  pageTitle: 'Pordo — 音乐、视频、漫画，一个应用',
  pageDesc:
    'Pordo 是 Windows 与 macOS 上的音乐、视频和漫画应用，Android 端支持音乐与漫画。按需接入 AI 字幕、AI 歌词与漫画翻译，用自己的 WebDAV 同步收藏与进度。',
  navDownload: '下载',
  navDocs: '文档',
  navRemdia: 'remdia SDK',
  langLabel: 'English',
  langSwitchAria: '切换到英文页面',
  heroBadge: 'Windows · macOS · Android · GitHub Releases 免费发布',
  heroH1: '音乐、视频、漫画，',
  heroH1Highlight: '一个 Pordo。',
  heroLead:
    '桌面端整合播放与阅读，Android 随身听歌看漫画；按需连接 AI 服务与自己的 WebDAV。',
  ctaDownload: '下载 Pordo',
  ctaStart: '开始使用',
  heroLogoAlt: 'Pordo 标志：薄荷绿与蓝绿色的折叠播放键',
  scenariosKicker: '使用场景',
  scenariosTitle: '三类内容，一个入口',
  scenariosSub:
    '本地播放与阅读不需要任何账号；在线音源、AI 与同步功能都连接你自己选择的服务。',
  scenarios: [
    {
      icon: 'music',
      title: '音乐',
      tagline: '本地曲库与在线音源，随挑随听',
      platforms: 'Windows · macOS · Android（在线音源与 AI 歌词为桌面功能）',
      items: [
        {
          title: '本地播放与队列',
          text: '打开或拖入文件即播；音乐与视频队列独立保存，收藏与最近播放随时可回。',
        },
        {
          title: '封面、标签与歌词',
          text: '显示封面、曲目信息与可用歌词；内嵌标签优先，配套 .lrc 文件提供逐行歌词。',
        },
        {
          title: 'AI 歌词（桌面）',
          text: '用你配置的音频模型为歌曲生成歌词，成功后自动保存为 .lrc。音频片段会发送到所选 AI 服务。',
        },
        {
          title: '在线音源（桌面）',
          text: '搜索受支持的音源、选择音质，边下边听或保存到本地；音质不可用时如实提示，不会悄悄替换。',
        },
      ],
    },
    {
      icon: 'video',
      title: '视频',
      tagline: '本地视频、AI 字幕与磁力播放',
      platforms: 'Windows · macOS',
      items: [
        {
          title: '本地播放',
          text: '全屏观看，工具栏随指针靠近边缘出现，控件不遮挡画面；空格暂停、方向键定位。',
        },
        {
          title: 'AI 字幕',
          text: '观看时生成中文或英文字幕，可选双语显示并导出 SRT；只发送明确请求的音频片段。',
        },
        {
          title: '磁力链接播放',
          text: '从磁力链接选择文件，边下载边观看或收听；任务可暂停、恢复与停止。',
        },
        {
          title: '系统编解码',
          text: '播放基于 remdia 组件图与系统编解码能力，当前以 H.264 的 MP4/MKV 为主要验证路径；不支持的编码会明确报错。',
        },
      ],
    },
    {
      icon: 'comics',
      title: '漫画',
      tagline: '书源搜索、书架追更与舒适阅读',
      platforms: 'Windows · macOS · Android（漫画翻译为桌面功能）',
      items: [
        {
          title: '书源与书架',
          text: '搜索 MangaYun 与 Komiic，加入书架、检查更新、从历史继续阅读；不同源的同名作品保持独立。',
        },
        {
          title: '阅读方式',
          text: '竖向滚动或左右翻页两种方向，缩放、页位与阅读进度自动保存。',
        },
        {
          title: 'Komiic 账号',
          text: '桌面在设置 → 漫画、Android 在漫画页“源设置”登录，支持自动登录、会话刷新与退出并清除本机密码。',
        },
        {
          title: 'AI 翻译（桌面）',
          text: '用兼容的图片编辑模型翻译一页或一章，可在原文、译文与对照视图间切换；生成结果可能改动画面或误译。',
        },
      ],
    },
  ],
  aiSyncTitle: '可选连接：AI 服务与你自己的 WebDAV',
  aiCardTitle: '按需接入 AI',
  aiCardText:
    'AI 字幕、AI 歌词与漫画翻译都使用你自己配置的服务与模型。生成时，相应音频片段或漫画图片会发送到所选服务，可能按其价格计费；取消本地等待不保证服务端不计费。不配置 AI 服务不影响本地播放与阅读。',
  syncCardTitle: '自己的 WebDAV 同步',
  syncCardText:
    '用你自己的 HTTPS WebDAV 存储，在设备间同步受支持的设置、收藏与进度；不上传本地媒体文件、队列或缓存。API Key 默认不同步，可选独立口令加密后再同步。凭据保存在 Windows Credential Manager、macOS Keychain 或 Android KeyStore。',
  matrixTitle: '平台能力简表',
  matrixNote:
    'Android 首版提供音乐、漫画与 WebDAV 同步；视频、AI 字幕与漫画翻译界面目前仅桌面提供。“—”表示当前版本未提供或未核实，以各版本发布说明为准。',
  matrixHead: ['功能', 'Windows x64', 'macOS 15+', 'Android 9+ arm64'],
  matrixRows: [
    { feature: '音乐播放与收藏', support: [true, true, true] },
    { feature: '视频播放', support: [true, true, false] },
    { feature: '漫画阅读与书架', support: [true, true, true] },
    { feature: '在线音源', support: [true, true, false] },
    { feature: '磁力链接播放', support: [true, true, false] },
    { feature: 'AI 字幕', support: [true, true, false] },
    { feature: 'AI 歌词', support: [true, true, false] },
    { feature: '漫画翻译', support: [true, true, false] },
    { feature: 'WebDAV 同步', support: [true, true, true] },
  ],
  matrixYes: '支持',
  matrixNo: '—',
  remdiaTitle: 'remdia：不依赖 FFmpeg 的模块化媒体 SDK',
  remdiaText:
    'Pordo 桌面端通过 remdia 组件图完成播放、字幕音频与漫画图片处理：demux、解码、滤镜、编码、mux 逐节点组合，优先使用系统媒体能力，可执行文件与媒体插件都不链接 FFmpeg。remdia 以 MIT 许可独立开源，可单独集成。',
  remdiaDocsBtn: '开发者文档',
  remdiaGithubBtn: 'remdia on GitHub',
  bannerH2: '一个应用，听歌、看片、追漫',
  bannerP:
    '免费下载，发布于 GitHub Releases：Windows x64、macOS 15+（Apple 芯片与 Intel）、Android 9+ arm64。',
  footerCopy: '© {year} PordoTech',
  footerDocs: '使用文档',
  footerReleases: '版本发布',
  footerIssues: '问题反馈',
  footerLicenses: '第三方许可',
  skipToContent: '跳到主要内容',
};

const enLanding: LandingText = {
  pageTitle: 'Pordo — music, video and comics in one app',
  pageDesc:
    'Pordo is a music, video and comics app for Windows and macOS, with an Android companion for music and comics. Add AI subtitles, AI lyrics and comic translation on your terms, and sync favorites and progress with your own WebDAV.',
  navDownload: 'Download',
  navDocs: 'Docs',
  navRemdia: 'remdia SDK',
  langLabel: '简体中文',
  langSwitchAria: 'Switch to the Chinese page',
  heroBadge: 'Windows · macOS · Android · Free on GitHub Releases',
  heroH1: 'Music, video and comics.',
  heroH1Highlight: 'Together in Pordo.',
  heroLead:
    'One desktop app for playback and reading, an Android companion for music and comics on the go — connect AI services and your own WebDAV only when you want.',
  ctaDownload: 'Download Pordo',
  ctaStart: 'Get Started',
  heroLogoAlt: 'Pordo logo: a folded play mark in mint and blue-teal',
  scenariosKicker: 'Scenarios',
  scenariosTitle: 'Three kinds of content, one entry point',
  scenariosSub:
    'Local playback and reading need no account. Online sources, AI and sync all connect to services you choose.',
  scenarios: [
    {
      icon: 'music',
      title: 'Music',
      tagline: 'Your local library and online sources',
      platforms: 'Windows · macOS · Android (online sources and AI lyrics are desktop features)',
      items: [
        {
          title: 'Local playback and queues',
          text: 'Open or drop files to play. Music and video queues are saved independently, with favorites and recent media one tap away.',
        },
        {
          title: 'Cover art, tags and lyrics',
          text: 'See cover art, track details and available lyrics. Embedded tags take priority; a matching .lrc file supplies timed lyrics.',
        },
        {
          title: 'AI lyrics (desktop)',
          text: 'Generate lyrics with your configured audio model; results are saved as .lrc next to the song. Audio chunks are sent to the selected AI service.',
        },
        {
          title: 'Online sources (desktop)',
          text: 'Search supported music sources, pick a quality, and stream while downloading or save tracks. Unavailable quality is reported, never silently replaced.',
        },
      ],
    },
    {
      icon: 'video',
      title: 'Video',
      tagline: 'Local video, AI subtitles and magnet playback',
      platforms: 'Windows · macOS',
      items: [
        {
          title: 'Local playback',
          text: 'Full-screen viewing with toolbars that appear near the edges and stay out of the way. Space pauses, arrow keys seek.',
        },
        {
          title: 'AI subtitles',
          text: 'Generate Chinese or English subtitles while watching, optionally bilingual, and export SRT. Only explicitly requested audio segments are sent.',
        },
        {
          title: 'Magnet playback',
          text: 'Pick a file from a magnet link and watch or listen while it downloads. Tasks can be paused, resumed and stopped.',
        },
        {
          title: 'System codecs',
          text: 'Playback runs on remdia component graphs and system codecs; H.264 in MP4/MKV is the primary verified path. Unsupported codecs fail with a clear error.',
        },
      ],
    },
    {
      icon: 'comics',
      title: 'Comics',
      tagline: 'Source search, bookshelf tracking and comfortable reading',
      platforms: 'Windows · macOS · Android (comic translation is a desktop feature)',
      items: [
        {
          title: 'Sources and bookshelf',
          text: 'Search MangaYun and Komiic, build a bookshelf, check for updates and resume from history. Matching titles stay separate per source.',
        },
        {
          title: 'Reading modes',
          text: 'Vertical scrolling or page-by-page in either direction; zoom, page position and progress are saved.',
        },
        {
          title: 'Komiic account',
          text: 'Sign in under Settings → Comics on desktop or Source settings on Android, with auto-login, session refresh and sign-out that clears the local password.',
        },
        {
          title: 'AI translation (desktop)',
          text: 'Translate a page or chapter with a compatible image-editing model and switch between original, translated and side-by-side views. Results can alter artwork or mistranslate.',
        },
      ],
    },
  ],
  aiSyncTitle: 'Optional connections: AI services and your own WebDAV',
  aiCardTitle: 'AI on your terms',
  aiCardText:
    'AI subtitles, AI lyrics and comic translation all use services and models you configure yourself. Generating sends the relevant audio chunks or comic images to the selected service, which may charge for requests; cancelling local waiting does not guarantee the server side is not billed. Local playback and reading work without any AI setup.',
  syncCardTitle: 'Sync with your own WebDAV',
  syncCardText:
    'Use your own HTTPS WebDAV storage to sync supported settings, favorites and progress between devices. Local media files, queues and caches are never uploaded. API keys are excluded by default and can be synced encrypted with a separate passphrase. Credentials live in Windows Credential Manager, macOS Keychain or Android KeyStore.',
  matrixTitle: 'Platform overview',
  matrixNote:
    'The first Android release provides music, comics and WebDAV sync; video, AI subtitles and comic translation UIs are desktop-only for now. “—” means not provided or not verified in the current release — see the release notes for each version.',
  matrixHead: ['Feature', 'Windows x64', 'macOS 15+', 'Android 9+ arm64'],
  matrixRows: [
    { feature: 'Music playback and favorites', support: [true, true, true] },
    { feature: 'Video playback', support: [true, true, false] },
    { feature: 'Comic reading and bookshelf', support: [true, true, true] },
    { feature: 'Online music sources', support: [true, true, false] },
    { feature: 'Magnet playback', support: [true, true, false] },
    { feature: 'AI subtitles', support: [true, true, false] },
    { feature: 'AI lyrics', support: [true, true, false] },
    { feature: 'Comic translation', support: [true, true, false] },
    { feature: 'WebDAV sync', support: [true, true, true] },
  ],
  matrixYes: 'Yes',
  matrixNo: '—',
  remdiaTitle: 'remdia: a modular media SDK without FFmpeg',
  remdiaText:
    'Pordo desktop runs playback, subtitle audio and comic image processing on remdia component graphs: demux, decode, filter, encode and mux nodes compose freely and prefer system media capabilities. Neither the executable nor its media plugins link FFmpeg. remdia is open source under the MIT license and can be integrated on its own.',
  remdiaDocsBtn: 'Developer docs',
  remdiaGithubBtn: 'remdia on GitHub',
  bannerH2: 'One app for music, video and comics',
  bannerP:
    'Free download on GitHub Releases: Windows x64, macOS 15+ (Apple Silicon and Intel), Android 9+ arm64.',
  footerCopy: '© {year} PordoTech',
  footerDocs: 'Documentation',
  footerReleases: 'Releases',
  footerIssues: 'Report an issue',
  footerLicenses: 'Third-party notices',
  skipToContent: 'Skip to main content',
};

const zhDownload: DownloadText = {
  pageTitle: '下载 Pordo — Windows、macOS 与 Android',
  pageDesc:
    '下载 Pordo 最新正式版本：Windows x64 安装程序与便携 ZIP、macOS 15+（Apple 芯片与 Intel）DMG/ZIP、Android 9+ arm64 APK，全部发布于 GitHub Releases 并附 SHA-256 校验和。',
  navDocs: '文档',
  langLabel: 'English',
  langSwitchAria: '切换到英文页面',
  h1: '下载 Pordo',
  sub: '四个平台的安装包都发布在 PordoTech/pordo 的 GitHub Releases。页面默认提供 Releases 入口；启用 JavaScript 后自动读取最新正式版本并直连对应附件。',
  cards: [
    {
      id: 'windows-x64',
      name: 'Windows x64',
      hint: '安装程序（另有便携 ZIP）',
      secondaryKind: 'portable',
      secondaryLabel: '便携 ZIP',
    },
    {
      id: 'macos-aarch64',
      name: 'macOS · Apple 芯片',
      hint: 'macOS 15+ · DMG（另有 ZIP）',
      secondaryKind: 'portable',
      secondaryLabel: 'ZIP',
    },
    {
      id: 'macos-x86_64',
      name: 'macOS · Intel',
      hint: 'macOS 15+ · DMG（另有 ZIP）',
      secondaryKind: 'portable',
      secondaryLabel: 'ZIP',
    },
    {
      id: 'android-arm64',
      name: 'Android',
      hint: 'Android 9+ · arm64-v8a · APK',
      secondaryKind: 'android-notes',
      secondaryLabel: '安装与签名说明',
    },
  ],
  statusStatic: '全部版本发布于 GitHub Releases',
  statusChecking: '正在获取最新正式版本…',
  statusUnavailable: '暂无法获取版本信息',
  statusMissing: '本版本暂无此平台安装包',
  btnFallback: '前往 Releases',
  btnDownload: '下载安装包',
  btnAriaResolved: '下载 {platform} 安装包（{version}）',
  versionPrefix: '最新版本',
  publishedLabel: '发布于',
  checksumLabel: 'SHA-256 校验和',
  notesTitle: '安装与更新说明',
  notes: [
    'Windows：安装包按用户安装，默认位于 %LOCALAPPDATA%/Programs/pordo，不覆盖用户设置或已下载的媒体。可在应用的“设置 → 关于”检查并安装更新。截至 v0.5.1 的 Windows 客户端仍按旧仓库路径校验更新：第一个更新的版本发布后，请从本仓库 Releases 手动下载安装一次，之后的更新自动使用新地址。安装包当前未做 Authenticode 签名，系统可能提示未知发布者；SHA-256 校验和用于完整性核对，不代表发布者签名。',
    'macOS：需要 macOS 15+。打开 DMG 把 Pordo.app 拖入“应用程序”，或使用 ZIP 解压后自行放置。当前构建为 ad-hoc 签名、未做公证，首次打开如被拦截，请在“系统设置 → 隐私与安全性”中允许。macOS 没有应用内更新，请从 Releases 下载新版本。从旧 replayer.app 升级时，先退出旧应用并在安装 Pordo 后删除旧的应用捆绑包，已有设置会保留。',
    'Android：需要 Android 9+ 的 arm64-v8a 设备。正式 APK 使用固定的发布签名密钥，后续版本可直接覆盖更新。此前使用测试签名的开发/测量包不能直接升级为正式签名：请先同步或备份数据，再卸载测试包并安装正式包。安装时允许“未知来源应用”即可。',
    '校验：Release 附带汇总 SHA256SUMS.txt；存在平台专属校验文件（SHA256SUMS-<平台>.txt）时，本页只链接该版本实际存在的文件。',
  ],
  namingTitle: '关于附件文件名',
  namingText:
    '已发布的 v0.5.1 附件仍使用历史前缀 replayer-0.5.1-*（目录名与产品旧名）；应用更名 Pordo 后，从下一个版本起附件为 pordo-VERSION-*。本页的下载解析同时接受两种前缀，版本号、平台与架构始终精确匹配，不拼接猜测链接。',
  guidesTip: '安装完成后推荐阅读：',
  guideLinks: [
    { label: '开始使用', hrefKind: 'getting-started' },
    { label: '安装与更新', hrefKind: 'install-update' },
    { label: 'WebDAV 云同步', hrefKind: 'webdav-sync' },
    { label: 'Android 客户端', hrefKind: 'android' },
  ],
  footerCopy: '© {year} PordoTech',
  footerDocs: '使用文档',
  footerReleases: '版本发布',
  skipToContent: '跳到主要内容',
};

const enDownload: DownloadText = {
  pageTitle: 'Download Pordo — Windows, macOS and Android',
  pageDesc:
    'Download the latest stable Pordo release: Windows x64 installer and portable ZIP, macOS 15+ (Apple Silicon and Intel) DMG/ZIP, Android 9+ arm64 APK — all published on GitHub Releases with SHA-256 checksums.',
  navDocs: 'Docs',
  langLabel: '简体中文',
  langSwitchAria: 'Switch to the Chinese page',
  h1: 'Download Pordo',
  sub: 'Packages for all four platforms are published in the PordoTech/pordo GitHub Releases. This page links to Releases by default; with JavaScript enabled it resolves the latest stable release and links each asset directly.',
  cards: [
    {
      id: 'windows-x64',
      name: 'Windows x64',
      hint: 'Installer (portable ZIP also available)',
      secondaryKind: 'portable',
      secondaryLabel: 'Portable ZIP',
    },
    {
      id: 'macos-aarch64',
      name: 'macOS · Apple Silicon',
      hint: 'macOS 15+ · DMG (ZIP also available)',
      secondaryKind: 'portable',
      secondaryLabel: 'ZIP',
    },
    {
      id: 'macos-x86_64',
      name: 'macOS · Intel',
      hint: 'macOS 15+ · DMG (ZIP also available)',
      secondaryKind: 'portable',
      secondaryLabel: 'ZIP',
    },
    {
      id: 'android-arm64',
      name: 'Android',
      hint: 'Android 9+ · arm64-v8a · APK',
      secondaryKind: 'android-notes',
      secondaryLabel: 'Install & signing notes',
    },
  ],
  statusStatic: 'All versions are published on GitHub Releases',
  statusChecking: 'Checking the latest stable release…',
  statusUnavailable: 'Release info unavailable',
  statusMissing: 'No package for this platform in this release',
  btnFallback: 'View Releases',
  btnDownload: 'Download installer',
  btnAriaResolved: 'Download the {platform} package ({version})',
  versionPrefix: 'Latest',
  publishedLabel: 'published',
  checksumLabel: 'SHA-256 checksums',
  notesTitle: 'Installation and update notes',
  notes: [
    'Windows: the installer is per-user and defaults to %LOCALAPPDATA%/Programs/pordo; it does not replace your settings or downloaded media. Check and install updates from Settings → About in the app. Windows clients through v0.5.1 still validate update URLs against the former repository path: when the first newer version is published, install that update manually once from this repository’s Releases — later updates use the new address automatically. Packages are not Authenticode-signed, so Windows may warn about an unknown publisher; the SHA-256 checksums verify integrity, not publisher identity.',
    'macOS: requires macOS 15+. Open the DMG and drag Pordo.app into Applications, or unzip the ZIP and place it yourself. Builds are currently ad-hoc signed without notarization; if the first launch is blocked, allow the app under System Settings → Privacy & Security. There is no in-app updater on macOS — download new versions from Releases. When upgrading from replayer.app, quit the old app first and remove its bundle after installing Pordo; existing settings are kept.',
    'Android: requires an Android 9+ arm64-v8a device. Official APKs use a persistent release signing key, so later versions install directly over the previous one. Development builds signed with test keys cannot be upgraded in place: sync or back up your data first, then uninstall the test build and install the official APK. Allow “unknown sources” when prompted.',
    'Verification: every release ships an aggregate SHA256SUMS.txt. Where a platform-specific checksum file (SHA256SUMS-<platform>.txt) exists for that release, this page links only to files actually present.',
  ],
  namingTitle: 'About asset filenames',
  namingText:
    'Published v0.5.1 assets still use the historical replayer-0.5.1-* prefix (the former project name); after the rename to Pordo, assets from the next release on are named pordo-VERSION-*. This page’s download resolver accepts both prefixes while always matching version, platform and architecture exactly — links are never guessed.',
  guidesTip: 'After installing, we recommend:',
  guideLinks: [
    { label: 'Getting Started', hrefKind: 'getting-started' },
    { label: 'Install & Update', hrefKind: 'install-update' },
    { label: 'WebDAV Sync', hrefKind: 'webdav-sync' },
    { label: 'Android App', hrefKind: 'android' },
  ],
  footerCopy: '© {year} PordoTech',
  footerDocs: 'Documentation',
  footerReleases: 'Releases',
  skipToContent: 'Skip to main content',
};

export function landingText(lang: Lang): LandingText {
  return lang === 'zh' ? zhLanding : enLanding;
}

export function downloadText(lang: Lang): DownloadText {
  return lang === 'zh' ? zhDownload : enDownload;
}

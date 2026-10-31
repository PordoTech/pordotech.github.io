// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// GitHub Pages 部署说明：
// - 本仓库是组织主页仓库（pordotech.github.io），站点部署在根路径
// - 若迁移到其他仓库/域名，修改 SITE_URL 与 BASE_PATH（或同名环境变量）
const site = process.env.SITE_URL ?? 'https://pordotech.github.io';
const base = process.env.BASE_PATH ?? '/';

export default defineConfig({
  site,
  base,
  trailingSlash: 'always',
  integrations: [
    starlight({
      title: 'Pordo',
      description:
        'A music, video and comics app for Windows and macOS, with an Android companion for music and comics.',
      logo: {
        src: './public/images/pordo-icon-256.png',
        alt: 'Pordo',
      },
      favicon: '/images/pordo-icon-256.png',
      defaultLocale: 'root',
      locales: {
        root: { label: '简体中文', lang: 'zh-CN' },
        en: { label: 'English', lang: 'en' },
      },
      social: [
        {
          icon: 'github',
          label: 'Pordo on GitHub',
          href: 'https://github.com/PordoTech/pordo',
        },
      ],
      sidebar: [
        {
          label: '指南',
          translations: { en: 'Guides' },
          items: [
            {
              label: '开始使用',
              translations: { en: 'Getting Started' },
              slug: 'guides/getting-started',
            },
            {
              label: '安装与更新',
              translations: { en: 'Install & Update' },
              slug: 'guides/install-update',
            },
            {
              label: '音乐与视频',
              translations: { en: 'Music & Video' },
              slug: 'guides/music-video',
            },
            {
              label: '在线音源',
              translations: { en: 'Online Music' },
              slug: 'guides/online-music',
            },
            {
              label: '漫画阅读',
              translations: { en: 'Reading Comics' },
              slug: 'guides/comics',
            },
            {
              label: 'AI 字幕、歌词与翻译',
              translations: { en: 'AI Subtitles, Lyrics & Translation' },
              slug: 'guides/ai',
            },
            {
              label: 'WebDAV 云同步',
              translations: { en: 'WebDAV Sync' },
              slug: 'guides/webdav-sync',
            },
            {
              label: '磁力链接播放',
              translations: { en: 'Magnet Playback' },
              slug: 'guides/magnet',
            },
            {
              label: 'Android 客户端',
              translations: { en: 'Android App' },
              slug: 'guides/android',
            },
            {
              label: '常见问题',
              translations: { en: 'FAQ' },
              slug: 'guides/faq',
            },
          ],
        },
        {
          label: '开发者',
          translations: { en: 'Developers' },
          items: [
            {
              label: '开发者索引',
              translations: { en: 'Developer Index' },
              slug: 'developers',
            },
          ],
        },
      ],
      customCss: ['./src/styles/starlight.css'],
    }),
  ],
});

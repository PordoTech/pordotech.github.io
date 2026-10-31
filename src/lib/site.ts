/**
 * 站点与仓库的固定地址。
 *
 * 单一来源：所有页面、组件与下载逻辑都从这里取 URL，避免多处漂移。
 * 站点自身地址由 astro.config.mjs 的 site/base 决定；这里只放外部固定链接。
 */

export const SITE_URL = 'https://pordotech.github.io';

export const GITHUB_ORG_URL = 'https://github.com/PordoTech';
export const PORDO_REPO_URL = 'https://github.com/PordoTech/pordo';
export const REMDIA_REPO_URL = 'https://github.com/PordoTech/remdia';

/** 所有平台的安装包都发布在同一个仓库的 Releases。 */
export const PORDO_RELEASES_URL = `${PORDO_REPO_URL}/releases`;
export const PORDO_ISSUES_URL = `${PORDO_REPO_URL}/issues`;

/** latest-release API 地址定义在 releases.ts（该模块需被 node --test 直接加载）。 */
export { PORDO_LATEST_RELEASE_API_URL } from './releases';

/** pordo 仓库内长期有效的文档链接（发布文档继续维护在应用仓库）。 */
export const PORDO_DOCS = {
  guide: `${PORDO_REPO_URL}/blob/main/docs/guide.md`,
  android: `${PORDO_REPO_URL}/blob/main/docs/android.md`,
  development: `${PORDO_REPO_URL}/blob/main/docs/development.md`,
  architecture: `${PORDO_REPO_URL}/blob/main/docs/architecture.md`,
  releasing: `${PORDO_REPO_URL}/blob/main/docs/releasing.md`,
  remdia: `${PORDO_REPO_URL}/blob/main/docs/remdia.md`,
  thirdParty: `${PORDO_REPO_URL}/blob/main/docs/third-party.md`,
} as const;

/** remdia SDK 文档链接。只列远端 main 分支上实际存在的文件。 */
export const REMDIA_DOCS = {
  readme: `${REMDIA_REPO_URL}#readme`,
  architecture: `${REMDIA_REPO_URL}/blob/main/docs/architecture.md`,
  pluginAbi: `${REMDIA_REPO_URL}/blob/main/docs/plugin-abi.md`,
  pordoScope: `${REMDIA_REPO_URL}/blob/main/docs/pordo-scope.md`,
  systemMediaDesign: `${REMDIA_REPO_URL}/blob/main/docs/system-media-and-image-design.md`,
  thirdParty: `${REMDIA_REPO_URL}/blob/main/THIRD_PARTY.md`,
  license: `${REMDIA_REPO_URL}/blob/main/LICENSE`,
} as const;

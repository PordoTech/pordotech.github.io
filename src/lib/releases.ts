/**
 * GitHub Release 附件解析（下载页共享逻辑）。
 *
 * 约束（对应组织方案 §7）：
 * - 静态页面默认提供有效的 Releases 链接；本模块只做渐进增强。
 * - 只请求一次 latest-release API，同一响应驱动全部平台卡片。
 * - 过滤草稿/预发布；按平台、架构、扩展名精确匹配附件。
 * - 直链一律使用响应中的 browser_download_url，不拼接猜测链接。
 * - 某平台缺包时如实报告缺失，不回退旧版本附件。
 * - 超时、限流、离线或响应异常时报告不可用，由 UI 恢复默认入口。
 * - 不携带、不要求、不暴露任何 token。
 *
 * 命名说明：已发布的 v0.5.1 附件仍是历史前缀 `replayer-`（例如
 * `replayer-0.5.1-windows-x86_64-setup.exe`）；应用仓库 docs/releasing.md
 * 规定此后打包输出为 `pordo-VERSION-*`。匹配器同时接受两种前缀，
 * 但版本号、平台、架构与扩展名必须完整精确匹配。
 *
 * 本文件只使用可擦除的 TypeScript 语法且不做相对导入，
 * 便于 `node --test` 直接运行测试（Node 的 ESM 解析不补扩展名）。
 */

export interface ReleaseAsset {
  name: string;
  browser_download_url: string;
  size?: number;
}

export interface ReleaseInfo {
  tag_name?: string;
  name?: string | null;
  published_at?: string | null;
  draft?: boolean;
  prerelease?: boolean;
  html_url?: string;
  assets?: ReleaseAsset[];
}

export type PlatformId =
  | 'windows-x64'
  | 'macos-aarch64'
  | 'macos-x86_64'
  | 'android-arm64';

export const PLATFORM_IDS: PlatformId[] = [
  'windows-x64',
  'macos-aarch64',
  'macos-x86_64',
  'android-arm64',
];

/**
 * GitHub latest-release API：只返回最新的非草稿、非预发布 Release。
 * 匿名请求，不携带也不需要 token。
 */
export const PORDO_LATEST_RELEASE_API_URL =
  'https://api.github.com/repos/PordoTech/pordo/releases/latest';

/** 历史（replayer-）与现行（pordo-）附件前缀都可接受。 */
const PREFIX = '(?:pordo|replayer)';
/** 语义化版本，允许预发布/构建元数据后缀，但整段必须精确结束。 */
const VERSION = '\\d+\\.\\d+\\.\\d+(?:[-+][0-9A-Za-z.-]+)?';

function assetName(filename: string): RegExp {
  return new RegExp(`^${PREFIX}-${VERSION}-${filename}$`);
}

export interface PlatformSpec {
  /** 主下载附件（安装包）。 */
  installer: RegExp;
  /** 次入口附件（便携包），Android 无。 */
  portable: RegExp | null;
  /** 该平台专属的校验和文件名。 */
  checksum: RegExp;
}

export const PLATFORM_SPECS: Record<PlatformId, PlatformSpec> = {
  'windows-x64': {
    installer: assetName('windows-x86_64-setup\\.exe'),
    portable: assetName('windows-x86_64\\.zip'),
    checksum: /^SHA256SUMS-windows-x86_64\.txt$/,
  },
  'macos-aarch64': {
    installer: assetName('macos-aarch64\\.dmg'),
    portable: assetName('macos-aarch64\\.zip'),
    checksum: /^SHA256SUMS-macos-aarch64\.txt$/,
  },
  'macos-x86_64': {
    installer: assetName('macos-x86_64\\.dmg'),
    portable: assetName('macos-x86_64\\.zip'),
    checksum: /^SHA256SUMS-macos-x86_64\.txt$/,
  },
  'android-arm64': {
    installer: assetName('android-arm64-v8a\\.apk'),
    portable: null,
    checksum: /^SHA256SUMS-android-arm64-v8a\.txt$/,
  },
};

/** 汇总校验和文件；平台专属文件缺失时使用（仅当该版本确实包含它）。 */
export const GLOBAL_CHECKSUM = /^SHA256SUMS\.txt$/;

export interface ResolvedPlatform {
  platform: PlatformId;
  installer: ReleaseAsset | null;
  portable: ReleaseAsset | null;
  /** 平台专属校验和，缺失时回退到汇总文件；都没有则为 null。 */
  checksum: ReleaseAsset | null;
}

export type ResolvedAssets = Record<PlatformId, ResolvedPlatform>;

/** latest-release 端点本身不返回草稿/预发布，这里再做一次防御性过滤。 */
export function isUsableRelease(release: unknown): release is ReleaseInfo {
  if (typeof release !== 'object' || release === null) return false;
  const candidate = release as ReleaseInfo;
  if (candidate.draft === true || candidate.prerelease === true) return false;
  if (typeof candidate.tag_name !== 'string' || candidate.tag_name === '') {
    return false;
  }
  return Array.isArray(candidate.assets);
}

function findAsset(
  assets: ReleaseAsset[],
  pattern: RegExp | null,
): ReleaseAsset | null {
  if (!pattern) return null;
  for (const asset of assets) {
    if (
      typeof asset?.name === 'string' &&
      typeof asset?.browser_download_url === 'string' &&
      pattern.test(asset.name)
    ) {
      return asset;
    }
  }
  return null;
}

/** 对同一份 Release 响应解析全部平台；纯函数，便于测试。 */
export function resolveAssets(release: ReleaseInfo): ResolvedAssets {
  const assets = (release.assets ?? []).filter(
    (asset) =>
      typeof asset?.name === 'string' &&
      typeof asset?.browser_download_url === 'string',
  );
  const globalChecksum = findAsset(assets, GLOBAL_CHECKSUM);
  const resolved = {} as ResolvedAssets;
  for (const platform of PLATFORM_IDS) {
    const spec = PLATFORM_SPECS[platform];
    resolved[platform] = {
      platform,
      installer: findAsset(assets, spec.installer),
      portable: findAsset(assets, spec.portable),
      checksum: findAsset(assets, spec.checksum) ?? globalChecksum,
    };
  }
  return resolved;
}

export type ReleaseLookup =
  | { status: 'ok'; release: ReleaseInfo; resolved: ResolvedAssets }
  | {
      status: 'unavailable';
      reason: 'timeout' | 'network' | 'http' | 'invalid';
      /** HTTP 状态码（仅 reason 为 http 时存在），用于诊断限流等情况。 */
      httpStatus?: number;
    };

export interface FetchOptions {
  /** 注入点：测试可替换 fetch 实现。 */
  fetchImpl?: typeof fetch;
  /** 超时毫秒数；到点即中止请求并报告 timeout。 */
  timeoutMs?: number;
  url?: string;
}

/**
 * 请求一次 latest stable Release 并解析全部平台附件。
 * 任何失败都不抛出，统一以 unavailable 返回，由调用方恢复默认入口。
 */
export async function fetchLatestRelease(
  options: FetchOptions = {},
): Promise<ReleaseLookup> {
  const fetchImpl = options.fetchImpl ?? fetch;
  const timeoutMs = options.timeoutMs ?? 10_000;
  const url = options.url ?? PORDO_LATEST_RELEASE_API_URL;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  let response: Response;
  try {
    response = await fetchImpl(url, {
      signal: controller.signal,
      headers: { Accept: 'application/vnd.github+json' },
    });
  } catch (error) {
    clearTimeout(timer);
    if (error instanceof Error && error.name === 'AbortError') {
      return { status: 'unavailable', reason: 'timeout' };
    }
    return { status: 'unavailable', reason: 'network' };
  }
  clearTimeout(timer);
  if (!response.ok) {
    // 403/429 限流与其他 HTTP 错误同样处理：恢复默认 Releases 入口。
    return { status: 'unavailable', reason: 'http', httpStatus: response.status };
  }
  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    return { status: 'unavailable', reason: 'invalid' };
  }
  if (!isUsableRelease(payload)) {
    return { status: 'unavailable', reason: 'invalid' };
  }
  return { status: 'ok', release: payload, resolved: resolveAssets(payload) };
}

/** 把 ISO 时间转为短日期；解析失败返回 null，由 UI 决定是否显示。 */
export function formatReleaseDate(iso: string | null | undefined): string | null {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString().slice(0, 10);
}

/**
 * 测试固件：基于 2026-10-31 对 GitHub API 的只读核实结果构造。
 *
 * - v0.5.1（最新正式版）：附件仍为历史前缀 replayer-，包含四平台安装包、
 *   便携包、平台专属与汇总 SHA256SUMS，以及非附件类型的 android-release.json。
 * - v0.5.0：没有 Android 附件，也没有平台专属校验文件（仅汇总 SHA256SUMS.txt）。
 * - deps-ffmpeg-9.0.2：历史依赖预发布，latest-release 端点不会返回它，
 *   这里用于验证防御性过滤。
 */

import type { ReleaseInfo } from '../src/lib/releases.ts';

/** 与 v0.5.1 实际附件一一对应（文件名、顺序按 API 响应）。 */
export const v051Release: ReleaseInfo = {
  tag_name: 'v0.5.1',
  name: 'v0.5.1',
  published_at: '2026-10-30T13:38:58Z',
  draft: false,
  prerelease: false,
  html_url: 'https://github.com/PordoTech/pordo/releases/tag/v0.5.1',
  assets: [
    'android-release.json',
    'replayer-0.5.1-android-arm64-v8a.apk',
    'replayer-0.5.1-macos-aarch64.dmg',
    'replayer-0.5.1-macos-aarch64.zip',
    'replayer-0.5.1-macos-x86_64.dmg',
    'replayer-0.5.1-macos-x86_64.zip',
    'replayer-0.5.1-windows-x86_64-setup.exe',
    'replayer-0.5.1-windows-x86_64.zip',
    'SHA256SUMS-android-arm64-v8a.txt',
    'SHA256SUMS-macos-aarch64.txt',
    'SHA256SUMS-macos-x86_64.txt',
    'SHA256SUMS-windows-x86_64.txt',
    'SHA256SUMS.txt',
  ].map((name) => ({
    name,
    browser_download_url: `https://github.com/PordoTech/pordo/releases/download/v0.5.1/${name}`,
    size: 1000,
  })),
};

/** v0.5.0：仅桌面附件与汇总校验文件。 */
export const v050Release: ReleaseInfo = {
  tag_name: 'v0.5.0',
  name: 'v0.5.0',
  published_at: '2026-10-29T07:29:02Z',
  draft: false,
  prerelease: false,
  html_url: 'https://github.com/PordoTech/pordo/releases/tag/v0.5.0',
  assets: [
    'replayer-0.5.0-macos-aarch64.dmg',
    'replayer-0.5.0-macos-aarch64.zip',
    'replayer-0.5.0-macos-x86_64.dmg',
    'replayer-0.5.0-macos-x86_64.zip',
    'replayer-0.5.0-windows-x86_64-setup.exe',
    'replayer-0.5.0-windows-x86_64.zip',
    'SHA256SUMS-macos-aarch64.txt',
    'SHA256SUMS-macos-x86_64.txt',
    'SHA256SUMS-windows-x86_64.txt',
    'SHA256SUMS.txt',
  ].map((name) => ({
    name,
    browser_download_url: `https://github.com/PordoTech/pordo/releases/download/v0.5.0/${name}`,
    size: 1000,
  })),
};

/** 更名后的未来命名（docs/releasing.md 规定 pordo-VERSION-*）。 */
export const futurePordoRelease: ReleaseInfo = {
  tag_name: 'v0.6.0',
  name: 'v0.6.0',
  published_at: '2026-11-15T10:00:00Z',
  draft: false,
  prerelease: false,
  html_url: 'https://github.com/PordoTech/pordo/releases/tag/v0.6.0',
  assets: [
    'pordo-0.6.0-android-arm64-v8a.apk',
    'pordo-0.6.0-macos-aarch64.dmg',
    'pordo-0.6.0-macos-aarch64.zip',
    'pordo-0.6.0-macos-x86_64.dmg',
    'pordo-0.6.0-macos-x86_64.zip',
    'pordo-0.6.0-windows-x86_64-setup.exe',
    'pordo-0.6.0-windows-x86_64.zip',
    'SHA256SUMS-android-arm64-v8a.txt',
    'SHA256SUMS-macos-aarch64.txt',
    'SHA256SUMS-macos-x86_64.txt',
    'SHA256SUMS-windows-x86_64.txt',
    'SHA256SUMS.txt',
  ].map((name) => ({
    name,
    browser_download_url: `https://github.com/PordoTech/pordo/releases/download/v0.6.0/${name}`,
    size: 1000,
  })),
};

/** 历史 FFmpeg 依赖预发布（真实存在于 Releases 列表，必须被过滤）。 */
export const ffmpegPrerelease: ReleaseInfo = {
  tag_name: 'deps-ffmpeg-9.0.2',
  name: 'FFmpeg 9.0.2 build dependency',
  published_at: '2026-10-21T12:40:53Z',
  draft: false,
  prerelease: true,
  html_url: 'https://github.com/PordoTech/pordo/releases/tag/deps-ffmpeg-9.0.2',
  assets: [
    {
      name: 'ffmpeg-ci.zip',
      browser_download_url:
        'https://github.com/PordoTech/pordo/releases/download/deps-ffmpeg-9.0.2/ffmpeg-ci.zip',
      size: 76375959,
    },
  ],
};

/** 构造只读的假 Response。 */
export function jsonResponse(payload: unknown, init: { status?: number } = {}) {
  const status = init.status ?? 200;
  const body = typeof payload === 'string' ? payload : JSON.stringify(payload);
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => {
      if (typeof payload === 'string') {
        throw new SyntaxError('Unexpected token < in JSON');
      }
      return payload;
    },
    bodyText: body,
  } as unknown as Response;
}

/** 模拟离线：fetch 直接拒绝。 */
export function offlineFetch(): typeof fetch {
  return (async () => {
    throw new TypeError('fetch failed');
  }) as unknown as typeof fetch;
}

/** 模拟超时：尊重 AbortSignal，被中止时以 AbortError 拒绝。 */
export function hangingFetch(): typeof fetch {
  return ((_url: string, init?: RequestInit) =>
    new Promise((_resolve, reject) => {
      const signal = init?.signal;
      if (!signal) return;
      if (signal.aborted) {
        reject(abortError());
        return;
      }
      signal.addEventListener('abort', () => reject(abortError()));
    })) as unknown as typeof fetch;
}

function abortError(): Error {
  const error = new Error('This operation was aborted');
  error.name = 'AbortError';
  return error;
}

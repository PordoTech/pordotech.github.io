/**
 * 下载解析测试：针对真实失败条件（缺包、限流、离线、超时、异常响应、
 * 草稿/预发布）与真实附件命名（replayer-/pordo- 前缀、平台/架构/扩展名
 * 精确匹配、安装包与便携包区分、校验和回退）。
 *
 * 运行：npm test（node --test tests/）
 */

import test from 'node:test';
import assert from 'node:assert/strict';

import {
  fetchLatestRelease,
  formatReleaseDate,
  isUsableRelease,
  resolveAssets,
  PLATFORM_IDS,
} from '../src/lib/releases.ts';
import {
  v051Release,
  v050Release,
  futurePordoRelease,
  ffmpegPrerelease,
  jsonResponse,
  offlineFetch,
  hangingFetch,
} from './fixtures.ts';

test('v0.5.1 完整附件：四平台安装包、便携包与专属校验和全部解析', () => {
  const resolved = resolveAssets(v051Release);
  for (const platform of PLATFORM_IDS) {
    const entry = resolved[platform];
    assert.ok(entry.installer, `${platform} 应解析出安装包`);
    assert.ok(entry.checksum, `${platform} 应解析出校验文件`);
  }
  assert.equal(
    resolved['windows-x64'].installer?.name,
    'replayer-0.5.1-windows-x86_64-setup.exe',
  );
  assert.equal(
    resolved['windows-x64'].portable?.name,
    'replayer-0.5.1-windows-x86_64.zip',
  );
  assert.equal(
    resolved['macos-aarch64'].installer?.name,
    'replayer-0.5.1-macos-aarch64.dmg',
  );
  assert.equal(
    resolved['macos-x86_64'].installer?.name,
    'replayer-0.5.1-macos-x86_64.dmg',
  );
  assert.equal(
    resolved['android-arm64'].installer?.name,
    'replayer-0.5.1-android-arm64-v8a.apk',
  );
  // Android 没有便携包概念。
  assert.equal(resolved['android-arm64'].portable, null);
  // 平台专属校验文件优先于汇总文件。
  assert.equal(
    resolved['windows-x64'].checksum?.name,
    'SHA256SUMS-windows-x86_64.txt',
  );
  assert.equal(
    resolved['android-arm64'].checksum?.name,
    'SHA256SUMS-android-arm64-v8a.txt',
  );
});

test('直链使用响应中的 browser_download_url，不重新拼接', () => {
  const resolved = resolveAssets(v051Release);
  const apiAsset = v051Release.assets?.find(
    (asset) => asset.name === 'replayer-0.5.1-macos-aarch64.dmg',
  );
  assert.ok(apiAsset);
  assert.equal(
    resolved['macos-aarch64'].installer?.browser_download_url,
    apiAsset.browser_download_url,
  );
});

test('更名后的 pordo- 前缀附件同样解析', () => {
  const resolved = resolveAssets(futurePordoRelease);
  assert.equal(
    resolved['windows-x64'].installer?.name,
    'pordo-0.6.0-windows-x86_64-setup.exe',
  );
  assert.equal(
    resolved['android-arm64'].installer?.name,
    'pordo-0.6.0-android-arm64-v8a.apk',
  );
  assert.equal(
    resolved['macos-x86_64'].portable?.name,
    'pordo-0.6.0-macos-x86_64.zip',
  );
});

test('缺少 Android 包（v0.5.0 形态）：如实报告缺失，其他平台不受影响', () => {
  const resolved = resolveAssets(v050Release);
  assert.equal(resolved['android-arm64'].installer, null);
  assert.equal(resolved['android-arm64'].portable, null);
  assert.ok(resolved['windows-x64'].installer);
  assert.ok(resolved['macos-aarch64'].installer);
  assert.ok(resolved['macos-x86_64'].installer);
});

test('校验和回退：平台专属文件缺失时使用该版本实际存在的汇总文件', () => {
  const resolved = resolveAssets(v050Release);
  // v0.5.0 实际上带有平台专属文件，先验证优先规则仍然生效：
  assert.equal(
    resolved['windows-x64'].checksum?.name,
    'SHA256SUMS-windows-x86_64.txt',
  );
  // 构造只有汇总文件的版本：
  const aggregateOnly = {
    ...v050Release,
    assets: (v050Release.assets ?? []).filter(
      (asset) => !asset.name.startsWith('SHA256SUMS-'),
    ),
  };
  const resolvedFallback = resolveAssets(aggregateOnly);
  assert.equal(
    resolvedFallback['android-arm64'].checksum?.name,
    'SHA256SUMS.txt',
  );
  assert.equal(
    resolvedFallback['windows-x64'].checksum?.name,
    'SHA256SUMS.txt',
  );
  // 汇总文件也不存在时不得虚构链接：
  const noChecksums = {
    ...v050Release,
    assets: (v050Release.assets ?? []).filter(
      (asset) => !asset.name.startsWith('SHA256SUMS'),
    ),
  };
  assert.equal(resolveAssets(noChecksums)['android-arm64'].checksum, null);
});

test('同平台不同架构不互相匹配', () => {
  const resolved = resolveAssets(v051Release);
  const aarch64 = resolved['macos-aarch64'].installer?.name ?? '';
  const x86 = resolved['macos-x86_64'].installer?.name ?? '';
  assert.match(aarch64, /macos-aarch64\.dmg$/);
  assert.match(x86, /macos-x86_64\.dmg$/);
  assert.notEqual(aarch64, x86);
  // Windows x86_64 附件不会进入 macOS Intel 卡片（扩展名与平台段都不同）。
  assert.ok(!x86.includes('windows'));
  assert.ok(!resolved['macos-x86_64'].installer?.name.endsWith('.exe'));
});

test('便携包与安装包区分：zip 不当作安装包，exe/dmg/apk 不当作便携包', () => {
  const resolved = resolveAssets(v051Release);
  assert.ok(resolved['windows-x64'].installer?.name.endsWith('-setup.exe'));
  assert.ok(resolved['windows-x64'].portable?.name.endsWith('.zip'));
  assert.ok(resolved['macos-aarch64'].installer?.name.endsWith('.dmg'));
  assert.ok(resolved['macos-aarch64'].portable?.name.endsWith('.zip'));
  // 不精确的相似名（如 setup.zip、arm64 dmg 出现在 x86 卡）不得命中：
  const tricky = {
    tag_name: 'v9.9.9',
    assets: [
      {
        name: 'pordo-9.9.9-windows-x86_64.zip',
        browser_download_url: 'https://example.invalid/win.zip',
      },
      {
        name: 'pordo-9.9.9-macos-aarch64.dmg',
        browser_download_url: 'https://example.invalid/arm.dmg',
      },
    ],
  };
  const trickyResolved = resolveAssets(tricky);
  assert.equal(trickyResolved['windows-x64'].installer, null);
  assert.equal(trickyResolved['windows-x64'].portable?.name, 'pordo-9.9.9-windows-x86_64.zip');
  assert.equal(trickyResolved['macos-x86_64'].installer, null);
  assert.equal(trickyResolved['macos-aarch64'].installer?.name, 'pordo-9.9.9-macos-aarch64.dmg');
});

test('相似但错误的命名不匹配：其他 ABI、旧版本号混排、前缀外名称', () => {
  const odd = {
    tag_name: 'v0.5.1',
    assets: [
      { name: 'pordo-0.5.1-android-armeabi-v7a.apk', browser_download_url: 'https://example.invalid/1' },
      { name: 'pordo-0.5.1-android-x86_64.apk', browser_download_url: 'https://example.invalid/2' },
      { name: 'replayer-0.5.1-macos-arm64.dmg', browser_download_url: 'https://example.invalid/3' },
      { name: 'pordo-windows-x86_64-setup.exe', browser_download_url: 'https://example.invalid/4' },
      { name: 'not-pordo-0.5.1-windows-x86_64-setup.exe', browser_download_url: 'https://example.invalid/5' },
      { name: 'SHA256SUMS-linux-x86_64.txt', browser_download_url: 'https://example.invalid/6' },
    ],
  };
  const resolved = resolveAssets(odd);
  assert.equal(resolved['android-arm64'].installer, null);
  assert.equal(resolved['macos-aarch64'].installer, null);
  assert.equal(resolved['windows-x64'].installer, null);
  assert.equal(resolved['windows-x64'].checksum, null);
});

test('残缺附件条目（缺 name 或 URL）被过滤，不产生坏链接', () => {
  const broken = {
    tag_name: 'v0.5.1',
    assets: [
      { name: 'replayer-0.5.1-windows-x86_64-setup.exe' },
      { browser_download_url: 'https://example.invalid/x' },
      null,
      {
        name: 'replayer-0.5.1-macos-aarch64.dmg',
        browser_download_url: 'https://example.invalid/ok.dmg',
      },
    ],
  } as unknown as Parameters<typeof resolveAssets>[0];
  const resolved = resolveAssets(broken);
  assert.equal(resolved['windows-x64'].installer, null);
  assert.equal(
    resolved['macos-aarch64'].installer?.browser_download_url,
    'https://example.invalid/ok.dmg',
  );
});

test('isUsableRelease 过滤草稿、预发布与结构异常', () => {
  assert.equal(isUsableRelease(v051Release), true);
  assert.equal(isUsableRelease({ ...v051Release, draft: true }), false);
  assert.equal(isUsableRelease(ffmpegPrerelease), false);
  assert.equal(isUsableRelease({ tag_name: 'v1.0.0' }), false); // 无 assets 数组
  assert.equal(isUsableRelease({ assets: [] }), false); // 无 tag
  assert.equal(isUsableRelease(null), false);
  assert.equal(isUsableRelease('v0.5.1'), false);
});

test('API 成功：ok 状态携带 release 与全部平台解析结果', async () => {
  const fetchImpl = (async () => jsonResponse(v051Release)) as unknown as typeof fetch;
  const result = await fetchLatestRelease({ fetchImpl });
  assert.equal(result.status, 'ok');
  if (result.status !== 'ok') return;
  assert.equal(result.release.tag_name, 'v0.5.1');
  assert.equal(
    result.resolved['windows-x64'].installer?.name,
    'replayer-0.5.1-windows-x86_64-setup.exe',
  );
});

test('API 限流（403）与其他 HTTP 错误：报告 http，不抛出', async () => {
  const rateLimited = (async () =>
    jsonResponse({ message: 'API rate limit exceeded' }, { status: 403 })) as unknown as typeof fetch;
  const result = await fetchLatestRelease({ fetchImpl: rateLimited });
  assert.deepEqual(result, {
    status: 'unavailable',
    reason: 'http',
    httpStatus: 403,
  });

  const notFound = (async () => jsonResponse({}, { status: 404 })) as unknown as typeof fetch;
  const missing = await fetchLatestRelease({ fetchImpl: notFound });
  assert.equal(missing.status, 'unavailable');
  if (missing.status === 'unavailable') {
    assert.equal(missing.reason, 'http');
    assert.equal(missing.httpStatus, 404);
  }
});

test('离线：fetch 拒绝时报告 network', async () => {
  const result = await fetchLatestRelease({ fetchImpl: offlineFetch() });
  assert.deepEqual(result, { status: 'unavailable', reason: 'network' });
});

test('超时：请求悬挂时按 timeoutMs 中止并报告 timeout', async () => {
  const started = Date.now();
  const result = await fetchLatestRelease({
    fetchImpl: hangingFetch(),
    timeoutMs: 30,
  });
  assert.deepEqual(result, { status: 'unavailable', reason: 'timeout' });
  assert.ok(Date.now() - started < 5000, '应在超时后立即返回');
});

test('响应不是 JSON / 不是 Release 结构：报告 invalid', async () => {
  const html = (async () => jsonResponse('<html>proxy interstitial</html>')) as unknown as typeof fetch;
  const notJson = await fetchLatestRelease({ fetchImpl: html });
  assert.deepEqual(notJson, { status: 'unavailable', reason: 'invalid' });

  const wrongShape = (async () => jsonResponse({ tag_name: 'v0.5.1' })) as unknown as typeof fetch;
  const noAssets = await fetchLatestRelease({ fetchImpl: wrongShape });
  assert.deepEqual(noAssets, { status: 'unavailable', reason: 'invalid' });

  const prerelease = (async () => jsonResponse(ffmpegPrerelease)) as unknown as typeof fetch;
  const filtered = await fetchLatestRelease({ fetchImpl: prerelease });
  assert.deepEqual(filtered, { status: 'unavailable', reason: 'invalid' });
});

test('请求不带 token，且只请求一次', async () => {
  const calls: { url: unknown; init?: RequestInit }[] = [];
  const fetchImpl = (async (url: unknown, init?: RequestInit) => {
    calls.push({ url, init });
    return jsonResponse(v051Release);
  }) as unknown as typeof fetch;
  await fetchLatestRelease({ fetchImpl });
  assert.equal(calls.length, 1);
  const headers = calls[0].init?.headers as Record<string, string> | undefined;
  assert.ok(headers);
  assert.equal(headers.Authorization, undefined);
  assert.ok(!JSON.stringify(headers).toLowerCase().includes('token'));
});

test('formatReleaseDate：有效 ISO 转短日期，异常输入返回 null', () => {
  assert.equal(formatReleaseDate('2026-10-30T13:38:58Z'), '2026-10-30');
  assert.equal(formatReleaseDate(null), null);
  assert.equal(formatReleaseDate(undefined), null);
  assert.equal(formatReleaseDate('not-a-date'), null);
});

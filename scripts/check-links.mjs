#!/usr/bin/env node
/**
 * 检查 dist/ 生成页面的内部链接、锚点与本地图片引用。
 *
 * 用法：先 `npm run build`，再 `node scripts/check-links.mjs`。
 * - 站内链接（以 / 开头）必须能映射到 dist 下的文件或目录 index.html
 * - 带 # 锚点的链接必须在目标页面中找到同名的 id
 * - <img src> 的本地引用必须存在
 * - 外部链接（http/https）只汇总数量，由人工抽查
 *
 * 退出码：0 = 全部通过；1 = 存在断链/断锚/缺图。
 */
import { readdir, readFile, stat } from 'node:fs/promises';
import { join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const distDir = resolve(fileURLToPath(new URL('..', import.meta.url)), 'dist');

/** 递归收集 dist 下的 HTML 文件。 */
async function collectHtml(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'pagefind') continue; // 搜索索引产物
      out.push(...(await collectHtml(full)));
    } else if (entry.name.endsWith('.html')) {
      out.push(full);
    }
  }
  return out;
}

async function exists(path) {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

/** 站内路径 → dist 文件。目录形式要求 index.html。 */
async function resolveLocal(pathname) {
  const trimmed = pathname.replace(/^\/+/, '');
  const direct = join(distDir, trimmed);
  if (await exists(direct)) {
    const s = await stat(direct);
    if (s.isFile()) return direct;
    const idx = join(direct, 'index.html');
    if (await exists(idx)) return idx;
  }
  if (trimmed.endsWith('/') && (await exists(join(distDir, trimmed, 'index.html')))) {
    return join(distDir, trimmed, 'index.html');
  }
  return null;
}

function decode(s) {
  try {
    return decodeURI(s);
  } catch {
    return s;
  }
}

/** 提取属性值（href/src），忽略 data:/javascript:/mailto:。 */
function extractAttrs(html, attr) {
  const re = new RegExp(`${attr}="([^"]*)"`, 'g');
  const out = [];
  let m;
  while ((m = re.exec(html)) !== null) {
    const v = m[1];
    if (!v || v.startsWith('data:') || v.startsWith('javascript:') || v.startsWith('mailto:')) continue;
    out.push(v);
  }
  return out;
}

const htmlFiles = await collectHtml(distDir);
const idCache = new Map();
async function idsOf(file) {
  if (!idCache.has(file)) {
    const html = await readFile(file, 'utf8');
    const ids = new Set();
    const re = /\sid="([^"]+)"/g;
    let m;
    while ((m = re.exec(html)) !== null) ids.add(decode(m[1]));
    idCache.set(file, ids);
  }
  return idCache.get(file);
}

let external = 0;
const problems = [];

for (const file of htmlFiles) {
  const html = await readFile(file, 'utf8');
  const page = relative(distDir, file) || 'index.html';

  for (const raw of extractAttrs(html, 'href')) {
    const href = decode(raw);
    if (/^https?:\/\//i.test(href)) {
      external++;
      continue;
    }
    if (!href.startsWith('/') && !href.startsWith('#')) {
      problems.push(`${page}: 相对链接（应使用根路径）: ${href}`);
      continue;
    }
    const [pathPart, frag] = href.split('#');
    let target;
    if (pathPart === '' || pathPart === undefined) {
      target = file; // 纯锚点，指向当前页
    } else {
      target = await resolveLocal(pathPart);
      if (!target) {
        problems.push(`${page}: 断链 ${href}`);
        continue;
      }
    }
    if (frag) {
      const ids = await idsOf(target);
      if (!ids.has(decode(frag))) {
        problems.push(`${page}: 断锚 ${href}`);
      }
    }
  }

  for (const raw of extractAttrs(html, 'src')) {
    const src = decode(raw);
    if (/^https?:\/\//i.test(src)) {
      external++;
      continue;
    }
    if (src.startsWith('/') && !(await resolveLocal(src))) {
      problems.push(`${page}: 缺失资源 ${src}`);
    }
  }
}

console.log(`检查 ${htmlFiles.length} 个页面，外部引用 ${external} 处（需人工抽查）`);
if (problems.length > 0) {
  console.error(`发现 ${problems.length} 个问题：`);
  for (const p of problems) console.error(' - ' + p);
  process.exit(1);
}
console.log('内部链接、锚点与本地资源全部通过');

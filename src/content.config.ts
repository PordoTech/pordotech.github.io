import { defineCollection } from 'astro:content';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

// 说明：构建时会出现 “The collection "i18n" does not exist or is empty” 警告。
// 这是 Starlight 对可选 UI 翻译集合的提示；本站未自定义 Starlight UI 文案，
// 该警告无害，不影响构建产物。
export const collections = {
  docs: defineCollection({ loader: docsLoader(), schema: docsSchema() }),
};

// @ts-check

import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

// Astro's sitemap integration emits bare <loc> entries. Google treats <lastmod>
// as a crawl-scheduling hint, and this site's pages had no freshness signal at
// all -- the homepage went 2+ days without a re-crawl while six article URLs sat
// at "unknown to Google" (2026-08-25). Feeding real publish/update dates in is
// cheap and is one of the few crawl levers that does not need a human.
//
// Read straight off the .mdx frontmatter: the sitemap serializer runs outside
// the content-collection runtime, so it cannot query the collection.
const BLOG_DIR = './src/content/blog';

/** @type {Map<string, string>} slug -> ISO date */
const postDates = new Map();
for (const file of readdirSync(BLOG_DIR)) {
	if (!file.endsWith('.mdx') && !file.endsWith('.md')) continue;
	const fm = readFileSync(join(BLOG_DIR, file), 'utf8').split(/^---$/m)[1] ?? '';
	const read = (key) => fm.match(new RegExp(`^${key}:\\s*['"]?(.*?)['"]?\\s*$`, 'm'))?.[1];
	const date = new Date(read('updatedDate') ?? read('pubDate') ?? '');
	if (!Number.isNaN(date.valueOf())) {
		postDates.set(file.replace(/\.(mdx|md)$/, ''), date.toISOString());
	}
}

// Listing pages are only as fresh as the newest post they list.
const newestPost = [...postDates.values()].sort().at(-1);

export default defineConfig({
	site: 'https://monoselect-lab.github.io',
	integrations: [
		mdx(),
		sitemap({
			serialize(item) {
				const slug = item.url.match(/\/blog\/([^/]+)\/$/)?.[1];
				if (slug) {
					item.lastmod = postDates.get(slug);
					item.changefreq = 'monthly';
					item.priority = 0.8;
				} else if (/^https:\/\/monoselect-lab\.github\.io\/(blog\/)?$/.test(item.url)) {
					// home and /blog/ -- these change every time a post ships
					item.lastmod = newestPost;
					item.changefreq = 'daily';
					item.priority = 1.0;
				} else {
					item.changefreq = 'yearly';
					item.priority = 0.3;
				}
				return item;
			},
		}),
	],
});

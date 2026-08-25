// Regenerates the article list in README.md from src/content/blog/*.mdx.
//
// Why this exists: github.com is crawled far more aggressively than a brand-new
// github.io subdomain, so the repo README is one of the few external paths by
// which Google can discover article URLs at all. It went stale at 4/7 articles
// because it was written by hand, which is exactly the kind of thing that rots
// silently. The health-check runs this and commits any diff.
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const BLOG_DIR = 'src/content/blog';
const README = 'README.md';
const START = '<!-- ARTICLES:START -->';
const END = '<!-- ARTICLES:END -->';

const posts = readdirSync(BLOG_DIR)
  .filter((f) => f.endsWith('.mdx'))
  .map((f) => {
    const raw = readFileSync(join(BLOG_DIR, f), 'utf8');
    const fm = raw.split(/^---$/m)[1] ?? '';
    const pick = (key) => {
      const m = fm.match(new RegExp(`^${key}:\\s*['"]?(.*?)['"]?\\s*$`, 'm'));
      return m ? m[1] : '';
    };
    return { slug: f.replace(/\.mdx$/, ''), title: pick('title'), date: new Date(pick('pubDate')) };
  })
  .sort((a, b) => b.date - a.date);

const list = posts
  .map((p) => `- [${p.title}](https://monoselect-lab.github.io/blog/${p.slug}/)`)
  .join('\n');

const readme = readFileSync(README, 'utf8');
const i = readme.indexOf(START);
const j = readme.indexOf(END);
if (i === -1 || j === -1) {
  console.error(`README.md is missing the ${START} / ${END} markers`);
  process.exit(1);
}
const next = readme.slice(0, i + START.length) + '\n' + list + '\n' + readme.slice(j);
if (next === readme) {
  console.log(`README article list already up to date (${posts.length} articles)`);
} else {
  writeFileSync(README, next);
  console.log(`README article list updated (${posts.length} articles)`);
}

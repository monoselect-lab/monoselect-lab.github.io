// Internal links can rot without anything failing loudly.
//
// Two silent modes exist:
//   1. A typo'd slug in an article's `related:` frontmatter. RelatedPosts.astro
//      resolves slugs against the collection and drops anything it cannot find
//      (`.filter(p => p !== undefined)`), then quietly backfills from the
//      same-category fallback. The page still renders three cards, so the
//      curated link the author intended is gone with no error anywhere.
//   2. A hand-written in-body link to a slug that was later renamed. Astro does
//      not validate href targets, so `npm run build` stays green and the reader
//      gets a 404 -- on the one path that carries them toward a purchase.
//
// Both are cheap to catch by checking every internal href against what actually
// exists in dist/.
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const BLOG_DIR = 'src/content/blog';
const DIST = 'dist';

let problems = 0;
const fail = (msg) => { console.error(`  ${msg}`); problems++; };

// --- 1. related: slugs in frontmatter ------------------------------------
const files = readdirSync(BLOG_DIR).filter((f) => /\.mdx?$/.test(f));
const ids = new Set(files.map((f) => f.replace(/\.mdx?$/, '')));

for (const file of files) {
	const fm = readFileSync(join(BLOG_DIR, file), 'utf8').split(/^---$/m)[1] ?? '';
	const block = fm.match(/^related:\s*\n((?:[ \t]*-[ \t]*.+\n)+)/m);
	const inline = fm.match(/^related:[ \t]*\[(.*)\]/m);
	const slugs = block
		? [...block[1].matchAll(/-[ \t]*['"]?([^'"\n]+?)['"]?[ \t]*$/gm)].map((m) => m[1])
		: inline
			? inline[1].split(',').map((s) => s.trim().replace(/['"]/g, '')).filter(Boolean)
			: [];
	for (const slug of slugs) {
		if (!ids.has(slug)) fail(`${file}: related: slug "${slug}" matches no article (silently dropped at build)`);
	}
}

// --- 2. internal hrefs in the built HTML ---------------------------------
if (!existsSync(DIST)) {
	console.error('dist/ not found -- run `npm run build` first');
	process.exit(1);
}

const pages = [];
const walk = (dir) => {
	for (const entry of readdirSync(dir, { withFileTypes: true })) {
		const p = join(dir, entry.name);
		if (entry.isDirectory()) walk(p);
		else if (entry.name.endsWith('.html')) pages.push(p);
	}
};
walk(DIST);

const resolves = (href) => {
	const path = href.split(/[?#]/)[0];
	if (/\.[a-z0-9]+$/i.test(path)) return existsSync(join(DIST, path));
	return existsSync(join(DIST, path, 'index.html'));
};

for (const page of pages) {
	const html = readFileSync(page, 'utf8');
	for (const m of html.matchAll(/href="(\/[^"]*)"/g)) {
		if (!resolves(m[1])) fail(`${page}: dead internal link -> ${m[1]}`);
	}
}

if (problems > 0) {
	console.error(`\ninternal-link check FAILED (${problems} problem${problems === 1 ? '' : 's'})`);
	process.exit(1);
}
console.log(`internal-link check OK (${files.length} articles, ${pages.length} pages)`);

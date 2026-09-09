// Every article stamps its prices with a "※価格は<日付>時点" line. That line is a
// promise to the reader, and it is the one number on the page that nothing else
// verifies.
//
// hc_asin/hc_price answer "is the printed figure still roughly right?" with a
// deliberately loose ±30% screen, which cannot tell a genuinely fresh article
// from one whose prices were last looked at five weeks ago and happen not to
// have moved 30%. On 2026-09-09 an article stamped 8月時点 was carrying ¥5,980
// for a circulator that had drifted to ¥8,608 (+44%) -- caught only because it
// blew through the loose screen. Anything drifting 10-29% is invisible.
//
// So check the claim itself: how old is the date the article tells the reader?
// A stale stamp is both a trust problem and a to-do list for re-verification.
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const BLOG_DIR = 'src/content/blog';
const MAX_AGE_DAYS = 45;
// "2026年9月時点" (no day) is read as the LAST day of that month -- the most
// generous reading, so we never fail an article on an ambiguity of our own making.
// The wording of this line is not standardised across articles -- it appears as
// "※価格は2026年9月時点で…", "※価格は2026年9月7日にAmazonの商品ページで…" and
// "※価格・在庫は2026年9月8日に…確認した時点のものです". Anchoring on the exact
// phrasing missed 11 of 36 articles on the first run, so match any line that
// talks about 価格 AND dates itself, and take the newest date on it.
const LINE_RE = /^.*価格.*$/gm;
const DATE_RE = /(\d{4})年(\d{1,2})月(?:(\d{1,2})日)?/g;

const today = new Date();
const rows = [];

for (const f of readdirSync(BLOG_DIR).filter((n) => n.endsWith('.mdx'))) {
  const src = readFileSync(join(BLOG_DIR, f), 'utf8');
  const slug = f.replace(/\.mdx$/, '');
  const stamps = [];
  for (const line of src.match(LINE_RE) ?? []) {
    if (!/時点|確認/.test(line)) continue;
    for (const m of line.matchAll(DATE_RE)) stamps.push(m);
  }
  if (stamps.length === 0) {
    rows.push({ slug, age: null, label: '(no price-as-of line)' });
    continue;
  }
  // One line can carry several dates; only the newest is the freshness claim.
  let newest = null;
  for (const m of stamps) {
    const [, y, mo, d] = m;
    // Month-only stamps are read as the last day of that month -- the most
    // generous reading, so we never fail an article on an ambiguity of our own
    // making -- but never later than today, or a current-month stamp goes negative.
    let date = d
      ? new Date(Number(y), Number(mo) - 1, Number(d))
      : new Date(Number(y), Number(mo), 0); // day 0 of next month = last of this
    if (date > today) date = today;
    if (!newest || date > newest.date) newest = { date, label: m[0] };
  }
  rows.push({
    slug,
    age: Math.floor((today - newest.date) / 86400000),
    label: newest.label,
  });
}

rows.sort((a, b) => (b.age ?? 1e9) - (a.age ?? 1e9));
const stale = rows.filter((r) => r.age === null || r.age > MAX_AGE_DAYS);

for (const r of rows) {
  const flag = r.age === null || r.age > MAX_AGE_DAYS ? 'STALE' : 'ok   ';
  const age = r.age === null ? '  ?' : String(r.age).padStart(3);
  console.log(`${flag} ${age}d  ${r.slug.padEnd(42)} ${r.label}`);
}

console.log(
  `\n--- ${rows.length - stale.length}/${rows.length} price-as-of stamps within ${MAX_AGE_DAYS} days ---`
);
if (stale.length) {
  console.log(
    'Re-verify these prices against the current Amazon page, then bump the date.\n' +
      'Do NOT bump the date without re-checking -- that turns a stale claim into a false one.'
  );
  process.exit(1);
}

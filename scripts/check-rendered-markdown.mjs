// Catches markdown that silently failed to render, in the BUILT html.
//
// Why this exists: CommonMark's emphasis "flanking" rules were written for
// languages with spaces. In Japanese, `**強調**` does NOT render when the
// closing `**` sits between punctuation and a letter (…音）**です) or the
// opening one sits between a letter and punctuation (つまり**「…). The
// asterisks then appear literally in the article body. Found live on
// 2026-08-26 in 4 of 9 articles; invisible to the build, which exits 0.
//
// Deliberately checks dist/ rather than the .mdx source: it asserts on what a
// reader actually sees, so it cannot be fooled by a flanking rule I got wrong.
// Fix by writing <strong>…</strong> instead of ** ** in the affected span.
import { readFileSync } from 'node:fs';
import { globSync } from 'node:fs';

const files = globSync('dist/**/index.html');
// Only look inside article prose; nav/scripts never contain markdown.
const PATTERNS = [
  { name: 'literal ** (unrendered bold)', re: /\*\*/g },
  { name: 'literal __ (unrendered bold)', re: /(?<![a-zA-Z0-9_/])__(?![a-zA-Z0-9_])/g },
  { name: 'unrendered [text](url) link', re: /\[[^\]\n]{1,80}\]\((?:https?:|\/)[^)\s]+\)/g },
];

let bad = 0;
for (const f of files) {
  const html = readFileSync(f, 'utf8');
  for (const { name, re } of PATTERNS) {
    for (const m of html.matchAll(re)) {
      const ctx = html.slice(Math.max(0, m.index - 60), m.index + 60).replace(/\s+/g, ' ');
      console.error(`FAIL ${f}\n  ${name}\n  …${ctx}…\n`);
      bad++;
    }
  }
}
if (bad) {
  console.error(`${bad} unrendered markdown artefact(s) reached the built HTML.`);
  process.exit(1);
}
console.log(`rendered-markdown check OK (${files.length} pages)`);

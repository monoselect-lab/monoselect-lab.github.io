// Amazon Associates and Google both expect affiliate links to be marked
// rel="sponsored nofollow noopener". AmazonButton.astro sets it, so every CTA
// has always had it -- but an Amazon link written as an ordinary markdown link
// in running prose got nothing, and nothing reported that. The daily check only
// compares two counts (rel attributes vs amazon hrefs), so the gap was invisible
// until the counts first disagreed (2026-09-12, 226 vs 228).
//
// Fixing it in the article would fix one article. Fixing it here means every
// future in-prose Amazon link is compliant without anyone remembering to be.
import { visit } from 'unist-util-visit';

export function rehypeAffiliateRel() {
	return (tree) => {
		visit(tree, 'element', (node) => {
			if (node.tagName !== 'a') return;
			const href = node.properties?.href;
			if (typeof href !== 'string' || !/(^|\/\/|\.)amazon\.co\.jp\//.test(href)) return;
			node.properties.rel = 'sponsored nofollow noopener';
			node.properties.target = '_blank';
		});
	};
}

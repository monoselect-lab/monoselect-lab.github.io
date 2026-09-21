// Comparison tables have to scroll horizontally on a phone, and the only way to
// do that without a wrapper element is `display: block` on the table itself.
// That works, but it quietly costs the table its table-ness: the row groups get
// re-wrapped in an ANONYMOUS table box, and anonymous table boxes are always
// shrink-to-fit. A table whose cells are short then draws narrower than the
// screen with an empty strip beside it.
//
// The layout used to dodge that with a column-count proxy -- "fewer than 4
// columns never needs to scroll, give those their width back". The proxy has
// now been wrong twice: on 2026-09-11 for 2-3 column tables (the rule it was
// added for), and on 2026-09-21 for a 4-column spec table of 390mm/300mm/146mm
// cells that drew 333px inside a 358px box. Column count was never the thing
// that decides; content width is, and CSS cannot measure content width.
//
// A real wrapper removes the question. The table stays `display: table` with
// `width: 100%`, so it fills the box when its content is narrow and overflows
// the wrapper when its content is wide -- and the wrapper, being an ordinary
// block, scrolls. The browser measures the content, so nothing here has to.
import { visit } from 'unist-util-visit';

export function rehypeTableScroll() {
	return (tree) => {
		visit(tree, 'element', (node, index, parent) => {
			if (node.tagName !== 'table' || !parent || index === null) return;
			if (parent.type === 'element' && parent.properties?.className?.includes?.('table-scroll')) return;
			parent.children[index] = {
				type: 'element',
				tagName: 'div',
				properties: { className: ['table-scroll'] },
				children: [node],
			};
			return ['skip'];
		});
	};
}

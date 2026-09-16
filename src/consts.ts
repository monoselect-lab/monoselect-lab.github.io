// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

export const SITE_TITLE = 'モノセレクトラボ';
export const SITE_DESCRIPTION = '悩み・シーン別に商品を比較して選び方を紹介するブログです。';

// Category hub pages. Keys are the `category` value used in article frontmatter;
// the slug is what appears in the URL (romaji, so the path stays readable when
// it is pasted or shared). Adding a category here is what creates its hub page.
export const CATEGORIES = [
	{
		slug: 'kaden',
		name: '生活家電',
		description:
			'ワンルームと在宅ワークの前提で、除湿機・空気清浄機・炊飯器などの生活家電を「部屋の条件」から絞り込んで比較しています。',
	},
	{
		slug: 'chintai',
		name: '賃貸・住まい',
		description:
			'原状回復・壁の薄さ・6畳の寸法など、賃貸だからできないことを前提にした住まいの困りごとと対策をまとめています。',
	},
	{
		slug: 'telework',
		name: 'テレワーク環境',
		description:
			'机の奥行き・Web会議の音と光・電源まわりなど、狭い部屋で在宅ワークを成立させるための環境づくりを扱います。',
	},
] as const;

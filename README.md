# モノセレクトラボ (monoselect-lab)

**在宅ワーク × 賃貸・ワンルーム** の困りごとを起点にした、商品比較・選び方ガイドサイトです。

🔗 **サイト本体: https://monoselect-lab.github.io/**

「除湿機おすすめ10選」のような一般的なランキングではなく、
「寝る場所と干す場所が同じ人向けの除湿機」のように、
読者の住環境や状況で絞り込んだ比較記事を書いています。

## 公開中の記事

<!-- ARTICLES:START -->
- [ワンルームで「寝る場所」と「働く場所」を分ける方法は、実質4通りしかない](https://monoselect-lab.github.io/blog/wanroom-shigoto-neru-basho-shikiri/)
- [安い机にモニターアームは付けられる？賃貸ワンルームの薄い天板・中空天板で選ぶ現実解](https://monoselect-lab.github.io/blog/chintai-desk-tenban-monitor-arm/)
- [壁の薄い賃貸、深夜の打鍵音対策｜静音キーボードだけでは半分しか解決しない](https://monoselect-lab.github.io/blog/chintai-shinya-dakenon-taisaku/)
- [賃貸の床を椅子のキャスターで傷つけない対策｜チェアマットとキャスター交換を比較](https://monoselect-lab.github.io/blog/chintai-yuka-kizu-chair-caster-taisaku/)
- [分離型キーボードおすすめ比較｜手首・肩の痛み対策に選ぶなら](https://monoselect-lab.github.io/blog/split-ergonomic-keyboard-hikaku/)
- [ワンルームの部屋干し除湿機比較｜寝る場所と干す場所が同じ人の選び方](https://monoselect-lab.github.io/blog/wanroom-heyaboshi-joshitsuki-hikaku/)
- [在宅ワークの生活音・子どもの声対策｜Web会議で気まずくならないグッズ比較](https://monoselect-lab.github.io/blog/web-kaigi-seikatsuon-taisaku-hikaku/)
<!-- ARTICLES:END -->

記事一覧: https://monoselect-lab.github.io/blog/

## 編集方針

- 記事は**メーカー公表スペック・価格情報・レビュー傾向などの公開情報にもとづく調査記事**です。
  全商品を実際に使い込んだ体験レポートではないことを、各記事の冒頭で明示しています。
- 星評価は**当サイト独自の編集部評価**であり、Amazon 上の評価そのものではありません。
- 当サイトは Amazon.co.jp アソシエイト・プログラムの参加者です。
- 価格・在庫は変動するため、購入前に必ず商品ページで最新情報を確認してください。

## 技術構成

[Astro](https://astro.build/) 製の静的サイトを GitHub Pages で配信しています。
`main` への push で `.github/workflows/` のデプロイワークフローが走ります。

```sh
npm install
npm run dev     # ローカル開発サーバ
npm run build   # dist/ に静的ビルド
```

記事は `src/content/blog/*.mdx`。フロントマターの `related` に slug を並べると、
記事下部の「関連記事」がその指定順で出ます（未指定なら同カテゴリ→新着でフォールバック）。

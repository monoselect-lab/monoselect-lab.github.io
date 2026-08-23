# 運用ログ

health-check の実行記録。日付ごとに追記。数字は Search Console（約2〜3日遅延あり）。

## 2026-08-23（初回 health-check）

- **稼働状況**: 記事4本。deploy workflow 直近10runすべて success。`npm run build` ローカル成功。
  `gh auth status` 正常（monoselect-lab, scopes: repo/workflow/gist/read:org）。異常なし。
- **Search Console**: 期間 2026-07-23〜08-20、クリック 0 / 表示 0。クエリデータなし。
  サイト公開が当日なので当然。判断材料にはならない。
- **インデックス状況**（URL Inspection API、新規導入）:
  - `/` → **Submitted and indexed**（08:59 UTC にクロール済み）← **初回インデックス確認**
  - 他6URL（記事4本・`/blog/`・`/about/`）→ すべて `URL is unknown to Google`、未クロール
- **`site:` WebSearch**: 無関係な結果のみ（MonoTorrent, Wikipedia等）。ヒットなし。
  この検査は精度が低く判断に使えないため、URL Inspection API に置き換えた。
- **ビジュアル確認**: モバイル390x844で実機スクショ確認（トップ + 最新2記事、分割キャプチャ）。
  比較表は横スクロール＋フェードで正常、表の縦潰れなし。見出し・カード・余白すべて正常。修正不要。
- **実施した改善**:
  1. 関連記事セクションを実装（`RelatedPosts.astro`、frontmatter `related`、schema拡張）。
     全4記事に手動で関連リンクを設定。内部リンクゼロ → 各記事2〜3本へ。
  2. sitemap を Search Console に再送信（朝の登録時は記事が1本だけだった）。
  3. `check_indexing.mjs` を新規作成し、health-check 手順に組み込み。
- **所感**: 最大のボトルネックは記事ページの未クロール。順位や文言の問題ではない。
  数日〜2週間はクロール待ちが正常なので、この期間に記事本数を積むのが最善手。
- **通知**: メール送信済み（初回インデックス確認 + 初期ステータス）。
  これを週次レポートの起点とし、次回の定例週次は **2026-08-30 頃**。

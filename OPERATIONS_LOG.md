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

## 2026-08-24

- **稼働状況**: 記事5本（本日 +1: `chintai-desk-tenban-monitor-arm`、09:23ジョブ）。
  deploy workflow 直近8run すべて success。`npm run build` ローカル成功（8ページ）。
  `gh auth status` 正常（monoselect-lab）。
- **失敗ログ**: `FAILURES.log` に1件。**2026-08-23 23:07 の health-check がセッション上限で死亡**
  （"You've hit your session limit · resets 12:40am"）。記事の公開ジョブではないので記事の欠落はなし。
  ただし1日3セッション（09:23公開 / 21:42公開 / 22:46 health-check）はプラン上限に当たり得る。
  報告済みとして `FAILURES.reported.log` へ移動。
- **Search Console**: 期間 2026-07-24〜08-21、クリック 0 / 表示 0。クエリデータなし。前日から変化なし。
- **インデックス状況**（URL Inspection API、8URL中）:
  - `/` → Submitted and indexed（クロール 2026-08-23 08:59 UTC。**24時間再クロールなし**）
  - 残り7URL（記事5本・`/blog/`・`/about/`）→ すべて `URL is unknown to Google`、クロール履歴なし
  - **1/8。前日 1/7 から実質変化なし**（分母が記事1本分増えただけ）
- **Bing**: `site:` 検索でヒット0件。IndexNow は 08-23 に初回送信済み、本日8URLを再送信（200 OK）。
- **sitemap**: 記事増加にともない Search Console へ再送信（isPending: true）。
- **ビジュアル確認**: モバイル390x844で実機スクショ（トップ2枚 + 新着記事8枚 + 除湿機記事）。
  比較表の横スクロール＋フェード、クイックピック、関連記事、フッターすべて正常。**修正不要**。
- **収益リンク健全性チェック（本日新設）**: 全21リンク / ユニーク20 ASIN。
  - `tag=monoselectlab-22` 欠落: **0件**
  - `rel="sponsored nofollow noopener"`: 全リンクに付与
  - ASIN実在確認: **20/20 OK**、商品タイトルも記事の記述と一致
- **所感**: 状況は前日とほぼ同一で、律速は依然「記事ページが1本もクロールされていない」こと。
  数字が動かないこと自体は新規サイトとして正常。過剰反応せず本数を積む。
  ただし打てる手として **GSCの「インデックス登録をリクエスト」は API から叩けない**ため、
  ここだけは運用者本人の操作が必要。日次メールで依頼した。

# nomikai リンクページ 設計ドキュメント

参考: https://lit.link/link_in_ebisu

## 1. これは何か

飲み会コミュニティの「窓口」となるリンクまとめページ（link-in-bio）を1枚作る。

- **読む人**: SNS や口コミでこの会を知った、まだ参加したことがない人
- **してほしい行動**: どんな会かを把握したうえで、参加申込に進む
- **主 CTA**: 開催日ごとの申込ボタン。押すとその回の Google フォームが開く

### やらないこと（明示的に対象外）

- 誰でも登録して自分のページを作れるサービス化（ログイン・DB・`/username`）
- ブラウザ上の管理画面。リンクの編集はコード（`src/data/site.ts`）を直接書き換える
- 画像パネル（写真の2カラムグリッド）、内部タブ切り替え
- クリック計測（GA4 等）、URL コピーボタン
- 申込フォームそのもの。フォームは Google フォームで別途作り、ここからは URL で繋ぐだけ

## 2. 技術スタック

| 項目 | 決定 |
| --- | --- |
| フレームワーク | Next.js（App Router / TypeScript） |
| スタイル | Tailwind CSS |
| パッケージマネージャ | npm（Node 22 同梱、CI の行数を最小化するため） |
| ホスティング | GitHub Pages |
| デプロイ | GitHub Actions（`actions/deploy-pages`） |

### GitHub Pages に載せるための制約

`taka01150810/nomikai` はプロジェクトページなので、公開 URL は
`https://taka01150810.github.io/nomikai/` になる。したがって `next.config.ts` に以下が必須:

- `output: 'export'` — サーバーを持たない静的書き出し
- `basePath: '/nomikai'` / `assetPrefix` — これがないと CSS・画像が 404 になる
- `images: { unoptimized: true }` — static export では Next の画像最適化が使えない
- `.nojekyll` を出力に含める — `_next/` ディレクトリが Jekyll に無視されるのを防ぐ

将来カスタムドメインを当てる場合は `basePath` を外す必要がある。

## 3. ページ構成

参考サイト（lit.link/link_in_ebisu）の見た目に寄せる。上から縦1列。

1. 白い丸のロゴ
2. 会の名前（明朝体）
3. 一言（開催場所のお知らせなど）
4. SNS アイコンの横一列 — Instagram / Threads
5. 「⬇️お申し込みはこちらから⬇️」の見出し
6. **開催日ごとの申込ボタン**を縦に並べる

### 申込ボタン

- 表示: `{when}{date}【{title}】お申し込みはこちら`（例: 本日9/6(日)【20代飲み会🍻】お申し込みはこちら）
- 左に「手を振る」アイコン、外側に白い枠、内側は半透明のバー
- リンク先はその回の Google フォーム（別タブで開く）
- 終わった回は `src/data/site.ts` の `events` 配列から消し、新しい回を下に足す運用

## 4. デザイン

- トーン: **夜のバーのようなダーク背景 × 暖色の灯り**、文字は明朝体
- 背景写真は未用意のため、CSS の円形グラデーションでボケた灯りを作って代用している
  （`globals.css` の `.bg-placeholder`）
- 写真を用意する場合は縦用・横用の2枚を `public/` に置き、`site.background` に指定する。
  `<picture>` の `media="(min-aspect-ratio: 1/1)"` で、横長の画面では横用、
  縦長の画面では縦用だけを読み込む（表示しない方は通信しない）
  - 推奨: portrait 1200x2000 / landscape 2400x1400、各 400KB 以下
  - 静的書き出しのため `images.unoptimized: true` にしており、置いた画像は
    縮小されずそのまま配信される。容量は事前に詰めておく必要がある
  - 暗めで、中央の縦帯（幅の中央60%）には被写体を置かない（文字と枠が乗るため）
  - 画面比率に合わせて中央基準で切り出すので、四隅は切れる前提で構図を作る
- 配色は CSS 変数に集約し、1箇所で変更できるようにする
- モバイルファースト（実際の閲覧はほぼスマートフォン）

## 5. データの持ち方

コンテンツは全て**プレースホルダ**で作り、実データは後から差し替える。

- 単一ファイル `src/data/site.ts` に、会名・一言・SNS・開催予定・OGP 情報をまとめる
- コンポーネントはこの配列を map して描画するだけにする
- 差し替え手順: `src/data/site.ts` を編集 → `git push` → Actions が自動でデプロイ

## 6. 付帯要素

- OGP タグ（`title` / `description` / `og:image`）と favicon を入れる。
  SNS に URL を貼って共有されることが前提のページなので実質必須。
- OGP 画像は `src/app/opengraph-image.png` に置いた実ファイル。
  ビルド時に動的生成する方式は、出力が拡張子なしファイル（`out/opengraph-image`）になり
  GitHub Pages が画像として配信しないため採らなかった。
  会名を変えたときは、この PNG も手で差し替える必要がある。
- アナリティクスと共有ボタンは入れない。

## 7. 画像パスの注意

`next/image` は `images.unoptimized: true`（静的書き出しのため必須）の場合、
`src` に basePath（`/nomikai`）を付けない。そのまま使うとローカルでは正しく見えるのに
公開先だけ 404 になる。そのため画像は生の `<img>` を使い、`page.tsx` の
`withBasePath()` で basePath を自分で足している。

画像を足すときは、ビルド後に出力を確認するのが確実。

```bash
NEXT_PUBLIC_BASE_PATH=/nomikai npm run build
grep -o 'src="[^"]*\.\(jpg\|png\|svg\)"' out/index.html   # すべて /nomikai/ 始まりであること
```

## 8. 公開手順

1. `nomikai` リポジトリを **private → public** に変更（無料プランの GitHub Pages は public のみ）
2. リポジトリ設定で Pages のソースを「GitHub Actions」にする
3. `main` への push で `.github/workflows/deploy.yml` が動き、`out/` が Pages に公開される
4. 公開 URL: `https://taka01150810.github.io/nomikai/`

**注意**: public 化するとリポジトリの内容とコミット履歴が全世界から見えるようになる。
公開前にプレースホルダの中身に実在の個人情報が混ざっていないか確認すること。

## 9. 残タスク（実データが揃ってから）

`src/data/site.ts` を編集して push すれば、Actions が自動でデプロイする。

- [ ] 会の正式名称・一言
- [ ] Instagram / Threads の実 URL
- [ ] 各回の Google フォームを作り、`events[].href` に URL を入れる
- [ ] ロゴ画像（`site.logo.src`）と背景写真（`site.background.src`）
- [ ] OGP 画像（`src/app/opengraph-image.png`）の差し替え
- [ ] 公開後、実機（スマートフォン）で表示確認

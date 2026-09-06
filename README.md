# nomikai

飲み会コミュニティのリンクまとめページ（link-in-bio）。

- 公開 URL: https://taka01150810.github.io/nomikai/
- 設計の経緯と決定事項: [docs/design.md](docs/design.md)

## 中身を書き換える

掲載内容は **`src/data/site.ts` の 1 ファイルだけ**にまとまっている。
開催日を足す・終わった回を消す・Google フォームの URL を入れる、はすべてここで行う。

```ts
events: [
  {
    when: "本日",        // 時期の言葉
    date: "9/6(日)",     // 開催日
    title: "20代飲み会🍻", // 【】の中に入る名前
    href: "https://docs.google.com/forms/...", // 申込フォーム
  },
],
```

編集して `main` に push すると、GitHub Actions が自動でビルドして公開する。

## ローカルで動かす

```bash
npm install
npm run dev      # http://localhost:3000
```

公開時と同じ形（静的書き出し）を確認したいときは、GitHub Pages のパスを付けてビルドする。

```bash
NEXT_PUBLIC_BASE_PATH=/nomikai npm run build   # out/ に出力される
```

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

## コマンド

`make` だけで一覧が出る。

```
make install   依存パッケージを入れる（最初の1回）
make dev       ローカルで開く（http://localhost:3000）
make build     公開時と同じ形（静的書き出し）でビルドする
make check     ビルドと lint、画像パスの検査までまとめて行う
make deploy    変更を公開する（push して、完了まで待って、公開先を確認する）
make status    最新のデプロイの進み具合を見る
make verify    公開されているページが正しいか確かめる
make open      公開ページをブラウザで開く
make og        OGP画像（SNSで出るカード画像）を今の会名で作り直す
make clean     ビルド結果を消す
```

### 公開するまで

```bash
git add -A && git commit -m "9月の日程を更新"
make deploy
```

`make deploy` は、コミットしていない変更が残っていれば止まる。
先に `make check` が走るので、ビルドが通らない・画像のパスが壊れている状態では公開されない。

### 会名や説明文を変えたとき

SNS に URL を貼ったときのカード画像は実ファイル（`src/app/opengraph-image.png`）で、
文言を変えても自動では追従しない。作り直してからコミットする。

```bash
make og
git add -A && git commit -m "OGP画像を更新"
make deploy
```

なお LINE などは一度読んだプレビューをしばらく保存するため、直しても
すぐには新しい表示にならない。急ぐときは `?v=2` のようにクエリを付けた URL を送る。

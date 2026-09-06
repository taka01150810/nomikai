# 飲み会リンクページの操作をまとめたもの。
# `make` だけで使えるコマンドの一覧が出る。

REPO      := nomikai
OWNER     := taka01150810
BASE_PATH := /$(REPO)
SITE_URL  := https://$(OWNER).github.io$(BASE_PATH)/

.DEFAULT_GOAL := help
.PHONY: help install dev build check verify deploy status open og clean

help: ## 使えるコマンドを表示する
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) \
		| awk 'BEGIN{FS=":.*?## "}{printf "  make %-9s %s\n", $$1, $$2}'

install: ## 依存パッケージを入れる（最初の1回）
	npm ci

dev: ## ローカルで開く（http://localhost:3000）
	npm run dev

build: ## 公開時と同じ形（静的書き出し）でビルドする
	NEXT_PUBLIC_BASE_PATH=$(BASE_PATH) npm run build

check: build ## ビルドと lint、画像パスの検査までまとめて行う
	npm run lint
	@echo "--- 画像パスの検査（すべて $(BASE_PATH)/ 始まりであること）"
	@# next/image は unoptimized のとき basePath を付けないので、
	@# 公開先でだけ 404 になる事故が起きやすい。ここで弾く。
	@bad=$$(grep -oE '(src|srcSet)="/[^"]*\.(jpg|jpeg|png|svg|webp)"' out/index.html \
		| grep -v '"$(BASE_PATH)/' || true); \
	if [ -n "$$bad" ]; then \
		echo "$$bad"; \
		echo "!! basePath が付いていない画像がある。page.tsx の withBasePath() を通すこと"; \
		exit 1; \
	fi
	@grep -oE '(src|srcSet)="[^"]*\.(jpg|jpeg|png|svg|webp)"' out/index.html | sort -u
	@echo "OK"

deploy: check ## 変更を公開する（push して、完了まで待って、公開先を確認する）
	@if ! git diff --quiet || ! git diff --cached --quiet; then \
		echo "!! コミットしていない変更がある。先に git commit すること"; \
		git status --short; \
		exit 1; \
	fi
	git push origin main
	@sleep 5
	@$(MAKE) --no-print-directory status
	@$(MAKE) --no-print-directory verify

status: ## 最新のデプロイの進み具合を見る（終わるまで待つ）
	@id=$$(gh run list --limit 1 --json databaseId --jq '.[0].databaseId'); \
	gh run watch $$id --exit-status > /dev/null 2>&1; \
	gh run list --limit 1 --json status,conclusion,displayTitle \
		--jq '.[0] | "\(.status) / \(.conclusion) : \(.displayTitle)"'

verify: ## 公開されているページが正しいか確かめる
	@echo "--- $(SITE_URL)"
	@curl -s -o /dev/null -w "ページ: %{http_code}\n" $(SITE_URL)
	@curl -s $(SITE_URL) | grep -o '<meta property="og:title"[^>]*>'
	@for f in $$(curl -s $(SITE_URL) | grep -oE '(src|srcSet)="[^"]*\.(jpg|jpeg|png|svg|webp)"' \
		| sed -E 's/.*="([^"]*)"/\1/' | sort -u); do \
		curl -s -o /dev/null -w "$$f -> %{http_code}\n" "https://$(OWNER).github.io$$f"; \
	done

open: ## 公開ページをブラウザで開く
	open $(SITE_URL)

og: ## OGP画像（SNSで出るカード画像）を今の会名で作り直す
	@echo "--- OGP 画像を作り直す（会名や説明文を変えたときに実行する）"
	@rm -f src/app/opengraph-image.png
	@cp scripts/opengraph-image.tsx src/app/opengraph-image.tsx
	@NEXT_PUBLIC_BASE_PATH=$(BASE_PATH) npm run build \
		|| { rm -f src/app/opengraph-image.tsx; git checkout -- src/app/opengraph-image.png; exit 1; }
	@cp out/opengraph-image src/app/opengraph-image.png
	@rm -f src/app/opengraph-image.tsx
	@echo "src/app/opengraph-image.png を更新した。git diff で中身を確かめてからコミットすること"

clean: ## ビルド結果を消す
	rm -rf out .next

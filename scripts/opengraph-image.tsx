/**
 * OGP 画像（SNS に URL を貼ったときに出るカード画像）を作るための一時ファイル。
 *
 * `make og` が、このファイルを src/app/ にコピーしてビルドし、
 * 出来上がった PNG を src/app/opengraph-image.png として保存したあと、
 * コピーしたファイルを消す。手で src/app/ に置く必要はない。
 *
 * ビルド時に毎回生成する方式にしていない理由は docs/design.md を参照。
 * （出力が拡張子なしファイルになり、GitHub Pages が画像として配信しないため）
 */
import { ImageResponse } from "next/og";
import { site } from "@/data/site";

export const dynamic = "force-static";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = site.meta.title;

/**
 * next/og の既定フォントは日本語を持たないため、表示する文字だけに絞った
 * Noto Serif JP を取得して埋め込む。
 * （Google Fonts は新しい UA には woff2 を返すが、描画側は ttf しか読めないので
 *  古い UA を名乗って truetype を受け取る。）
 */
async function loadJapaneseFont(text: string): Promise<ArrayBuffer> {
  const url =
    "https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@700&text=" +
    encodeURIComponent(text);
  const css = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 (Windows NT 6.1; WOW64)" },
  }).then((res) => res.text());
  const fontUrl = css.match(/src:\s*url\((.+?)\)/)?.[1];
  if (!fontUrl) throw new Error(`フォント URL を取得できなかった: ${css}`);
  return fetch(fontUrl).then((res) => res.arrayBuffer());
}

export default async function OpengraphImage() {
  const text = `${site.meta.title}${site.meta.description}`;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0f1522",
          backgroundImage:
            "radial-gradient(60% 50% at 50% 0%, rgba(232,164,76,0.22), rgba(15,21,34,0) 70%)",
          color: "#f6efe6",
          padding: 80,
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: 96,
            height: 96,
            marginBottom: 44,
            borderRadius: 999,
            border: "9px solid #e8a44c",
          }}
        />
        <div style={{ fontSize: 76, fontWeight: 700 }}>{site.meta.title}</div>
        <div style={{ fontSize: 32, marginTop: 26, color: "#cbbdae" }}>
          {site.meta.description}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Noto Serif JP",
          data: await loadJapaneseFont(text),
          weight: 700,
          style: "normal",
        },
      ],
    },
  );
}

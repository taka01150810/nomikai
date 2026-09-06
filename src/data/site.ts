/**
 * このファイルだけを書き換えれば、ページの内容は全て差し替わる。
 * 現在の値は全てプレースホルダ（仮）なので、実データが決まったら置き換える。
 */

export type SocialId = "instagram" | "threads";

export type Social = {
  id: SocialId;
  label: string;
  href: string;
};

/** 1回の開催 = 1つの申込ボタン。 */
export type Event = {
  /** ボタン先頭に出す時期の言葉。例: "本日" "明日" "来週" */
  when: string;
  /** 開催日。例: "9/6(日)" */
  date: string;
  /** 【】の中に入る会の名前。絵文字を入れてよい。 */
  title: string;
  /** クリック先の Google フォーム URL */
  href: string;
};

export const site = {
  /** 会の名前 */
  name: "Link in 恵比寿",
  /** 名前の下に出る一言。開催場所のお知らせなどに使う。 */
  tagline: "本日は渋谷開催🍻",
  /** 丸いロゴ。画像を用意したら src を "/logo.png" のように差し替える。 */
  logo: {
    src: null as string | null,
    /** logo.src が null の間、白い丸の中に出す文字（改行で3行にする） */
    fallback: "LINK\nIN\nEBISU",
    alt: "Link in 恵比寿のロゴ",
  },
  /** 背景写真。public/ に画像を置いて "/bg.jpg" を指定すると差し替わる。 */
  background: {
    src: null as string | null,
  },
  socials: [
    { id: "instagram", label: "Instagram", href: "https://www.instagram.com/" },
    { id: "threads", label: "Threads", href: "https://www.threads.net/" },
  ] satisfies Social[],
  /** 申込ボタンの並びの上に出す見出し */
  eventsHeading: "⬇️お申し込みはこちらから⬇️",
  /**
   * 開催予定。上から順にボタンになる。
   * 終わった回は配列から消し、新しい回を下に足していく運用。
   */
  events: [
    {
      when: "本日",
      date: "9/6(日)",
      title: "20代BBQ会🍖",
      href: "https://docs.google.com/forms/",
    },
    {
      when: "本日",
      date: "9/6(日)",
      title: "20代飲み会🍻",
      href: "https://docs.google.com/forms/",
    },
    {
      when: "来週",
      date: "9/11(金)",
      title: "20代飲み会🍻",
      href: "https://docs.google.com/forms/",
    },
    {
      when: "来週",
      date: "9/12(土)",
      title: "20代飲み会🍻",
      href: "https://docs.google.com/forms/",
    },
    {
      when: "来週",
      date: "9/13(日)",
      title: "20代飲み会🍻",
      href: "https://docs.google.com/forms/",
    },
  ] satisfies Event[],
  /** SNS に URL を貼ったときに出るカードの内容 */
  meta: {
    title: "Link in 恵比寿",
    description:
      "恵比寿・渋谷で開催している20代の飲み会。開催日ごとの申し込みはこちらから。",
    /**
     * サイトのオリジン（ドメインまで）。OGP 画像の絶対 URL の組み立てに使う。
     * basePath（/nomikai）は Next が自動で足すので、ここには含めない。
     */
    origin: "https://taka01150810.github.io",
    /** 公開 URL。og:url にそのまま出す。 */
    url: "https://taka01150810.github.io/nomikai/",
  },
} as const;

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
  /** ボタン先頭に出す時期の言葉。例: "本日" "明日" "来週"。不要なら省略する。 */
  when?: string;
  /** 開催日。例: "9/6(日)" */
  date: string;
  /** 開催地。日付の隣に出す。不要なら省略する。 */
  venue?: string;
  /** 【】の中に入る会の名前。絵文字を入れてよい。 */
  title: string;
  /** クリック先の Google フォーム URL */
  href: string;
};

export const site = {
  /** 会の名前 */
  name: "飲み会お申し込み",
  /** 名前の下に出る一言。開催場所のお知らせなどに使う。 */
  tagline: "みんなで楽しみましょう！🍻",
  /** 丸いロゴ。画像を用意したら src を "/logo.png" のように差し替える。 */
  logo: {
    src: "/logo.jpg" as string | null,
    /** logo.src が null の間、白い丸の中に出す文字（改行で3行にする） */
    fallback: "LINK\nIN\nEBISU",
    alt: "Link in 恵比寿のロゴ",
  },
  /**
   * 背景写真。public/ に置いた画像のパスを指定する（例: "/bg-portrait.jpg"）。
   * 縦長の画面では portrait、横長の画面では landscape を使う。
   * 片方だけ指定した場合はその1枚を両方で使い、どちらも null なら
   * globals.css の .bg-placeholder（CSS で作った夜の灯り）を表示する。
   *
   * 推奨サイズ: portrait 1200x2000 / landscape 2400x1400、
   * どちらも暗めで、中央の縦帯には被写体を置かない（文字が乗るため）。
   * 静的書き出しのため画像は縮小されずそのまま配信される。1枚 400KB 以下を目安にする。
   */
  background: {
    portrait: "/bg-portrait.jpg" as string | null,
    landscape: "/bg-landscape.jpg" as string | null,
  },
  socials: [
    { id: "instagram", label: "Instagram", href: "https://www.instagram.com/syanyade/" },
    { id: "threads", label: "Threads", href: "https://www.threads.com/@syanyade?xmt=AQG0ODDAqN0wK12lhPkY1saGu0mYhnk5Rd0PZaUp8R-IACU" },
  ] satisfies Social[],
  /** 申込ボタンの並びの上に出す見出し */
  eventsHeading: "⬇️お申し込みはこちらから⬇️",
  /**
   * 開催予定。上から順にボタンになる。
   * 終わった回は配列から消し、新しい回を下に足していく運用。
   */
  events: [
    // {
    //   date: "9/2(水)",
    //   venue: "新宿",
    //   title: "飲み会🍻",
    //   href: "https://forms.gle/nH22MZixmYjiMapNA",
    // },
    // {
    //   date: "9/5(土)",
    //   venue: "新宿バー",
    //   title: "飲み会🍻",
    //   href: "https://forms.gle/nH22MZixmYjiMapNA",
    // },
    {
      date: "9/9(水)",
      venue: "豊洲",
      title: "飲み会🍻",
      href: "https://forms.gle/nH22MZixmYjiMapNA",
    },
    {
      date: "9/12(土)",
      venue: "池袋",
      title: "飲み会🍻",
      href: "https://forms.gle/nH22MZixmYjiMapNA",
    },
    {
      date: "9/13(日)",
      venue: "豊洲",
      title: "飲み会🍻",
      href: "https://forms.gle/nH22MZixmYjiMapNA",
    },
    {
      date: "9/16(火)",
      venue: "新宿バー",
      title: "飲み会🍻",
      href: "https://forms.gle/nH22MZixmYjiMapNA",
    },
    {
      date: "9/19(土)",
      venue: "池袋",
      title: "飲み会🍻",
      href: "https://forms.gle/nH22MZixmYjiMapNA",
    },
    {
      date: "9/20(日)",
      venue: "新宿バー",
      title: "飲み会🍻",
      href: "https://forms.gle/nH22MZixmYjiMapNA",
    },
    {
      date: "9/23(水)",
      venue: "新宿バー",
      title: "飲み会🍻",
      href: "https://forms.gle/nH22MZixmYjiMapNA",
    },
    {
      date: "9/26(土)",
      venue: "豊洲",
      title: "飲み会🍻",
      href: "https://forms.gle/nH22MZixmYjiMapNA",
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

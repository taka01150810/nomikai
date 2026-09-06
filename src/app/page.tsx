import Image from "next/image";
import { SocialIcon } from "@/components/SocialIcon";
import { WaveIcon } from "@/components/WaveIcon";
import { site, type Event } from "@/data/site";

export default function Home() {
  // site.ts は as const なので、省略した項目（when など）も読めるよう Event 型で受ける。
  const events: readonly Event[] = site.events;

  // 生の img タグには basePath（/nomikai）が自動で付かないので、自分で足す。
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const withBasePath = (src: string | null) => (src ? `${basePath}${src}` : null);
  const portrait = withBasePath(site.background.portrait);
  const landscape = withBasePath(site.background.landscape);

  return (
    <div className="relative flex flex-1 flex-col">
      {/* 背景。写真が未用意の間は CSS で作った夜の灯りの模様を敷く。 */}
      <div className="fixed inset-0 -z-10">
        {portrait || landscape ? (
          // 画面が横長なら横用、縦長なら縦用を読み込む。
          // 表示されない方はブラウザが読み込まないので、通信量は 1 枚分で済む。
          <picture>
            <source
              media="(min-aspect-ratio: 1/1)"
              srcSet={landscape ?? portrait ?? undefined}
            />
            <img
              src={portrait ?? landscape ?? undefined}
              alt=""
              className="h-full w-full object-cover"
            />
          </picture>
        ) : (
          <div className="bg-placeholder h-full w-full" />
        )}
        {/*
          文字を読みやすくするための暗幕。
          写真の上部は空やビルの明かりで明るいことが多く、そこに会名が乗るので、
          上ほど濃くする。
        */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/45 to-black/55" />
      </div>

      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col items-center px-5 pb-16 pt-10">
        {/* 丸いロゴ */}
        <div className="flex h-36 w-36 items-center justify-center overflow-hidden rounded-full bg-white">
          {site.logo.src ? (
            <Image
              src={site.logo.src}
              alt={site.logo.alt}
              width={144}
              height={144}
              className="h-full w-full object-cover"
              priority
            />
          ) : (
            <span className="whitespace-pre-line text-center text-2xl font-bold leading-tight tracking-wide text-black">
              {site.logo.fallback}
            </span>
          )}
        </div>

        <h1 className="mt-5 text-center font-serif text-3xl font-bold drop-shadow">
          {site.name}
        </h1>
        <p className="mt-2 text-center font-serif text-base font-semibold text-foreground/85 drop-shadow">
          {site.tagline}
        </p>

        <nav aria-label="SNS" className="mt-5 flex items-center gap-5">
          {site.socials.map((social) => (
            <a
              key={social.id}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.label}
              className="text-foreground transition-opacity hover:opacity-70"
            >
              <SocialIcon id={social.id} />
            </a>
          ))}
        </nav>

        <p className="mt-7 text-center font-serif text-sm font-semibold drop-shadow">
          {site.eventsHeading}
        </p>

        {/* 開催日ごとの申込ボタン。押すと Google フォームが開く。 */}
        <nav aria-label="開催予定" className="mt-4 flex w-full flex-col gap-4">
          {events.map((event, index) => (
            <a
              key={`${event.date}-${event.title}-${index}`}
              href={event.href}
              target="_blank"
              rel="noopener noreferrer"
              // 外側の白枠と、内側の半透明のバーの二重構造にする。
              className="border-2 border-white/85 p-1 transition-transform hover:scale-[1.01]"
            >
              <span className="flex items-center gap-3 bg-white/15 px-3 py-3 backdrop-blur-sm">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-white/10 text-white">
                  <WaveIcon />
                </span>
                <span className="flex-1 text-center font-serif text-[15px] font-bold leading-snug drop-shadow">
                  {event.when}
                  {event.date}
                  {event.venue && ` ${event.venue}`}【{event.title}】お申し込みはこちら
                </span>
              </span>
            </a>
          ))}
        </nav>
      </main>
    </div>
  );
}

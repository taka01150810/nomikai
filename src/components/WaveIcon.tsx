/** 申込ボタンの左に置く「手を振る」アイコン。 */
export function WaveIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-7 w-7"
    >
      {/* 手そのもの。少し傾けて、振っている途中に見えるようにする。 */}
      <g transform="rotate(-18 12 13)">
        <path d="M9.5 12.2V5.4a1.15 1.15 0 0 1 2.3 0v5.9" />
        <path d="M11.8 11.3V4.3a1.15 1.15 0 0 1 2.3 0v6.6" />
        <path d="M14.1 10.9V6a1.15 1.15 0 0 1 2.3 0v7.4" />
        <path d="M9.5 12.2V9.1a1.15 1.15 0 0 0-2.3 0v5.6l-1.3-1.6a1.2 1.2 0 0 0-1.85 1.52l2.6 3.6A5 5 0 0 0 10.7 20.5h1.3a4.4 4.4 0 0 0 4.4-4.4v-2.7" />
      </g>
      {/* 振っていることを示す弧 */}
      <path d="M19.4 5.2a4 4 0 0 1 0 4.4" opacity="0.85" />
      <path d="M21.6 3.4a6.6 6.6 0 0 1 0 7.9" opacity="0.55" />
    </svg>
  );
}

import type { MonstroId } from "../game/conteudo.ts";

const EMOJIS: Record<Exclude<MonstroId, "mumia">, string> = {
  dracula: "🧛",
  lobisomem: "🐺",
  zumbi: "🧟",
};

/** Não existe emoji de múmia, então ela é desenhada em SVG. */
function Mumia() {
  return (
    <svg viewBox="0 0 100 100" className="retrato-svg" role="img" aria-label="Múmia">
      <rect x="22" y="10" width="56" height="80" rx="24" fill="#e8dfc8" />
      <g stroke="#b3a688" strokeWidth="4" strokeLinecap="round">
        <path d="M24 28 L76 20" />
        <path d="M23 58 L77 50" />
        <path d="M24 68 L76 76" />
        <path d="M30 82 L72 86" />
      </g>
      <rect x="28" y="33" width="44" height="16" rx="8" fill="#23182e" />
      <circle cx="41" cy="41" r="5" fill="#f4e04d" />
      <circle cx="59" cy="41" r="5" fill="#f4e04d" />
    </svg>
  );
}

export function RetratoMonstro({ monstro }: { monstro: MonstroId }) {
  if (monstro === "mumia") return <Mumia />;
  return (
    <span className="retrato-emoji" aria-hidden="true">
      {EMOJIS[monstro]}
    </span>
  );
}

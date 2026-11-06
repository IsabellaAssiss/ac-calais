import type { MonstroId } from "../game/conteudo.ts";

export type Humor = "normal" | "feliz" | "bravo";

/** Só a Vampira tem as três poses; os outros usam a única que existe e o CSS simula o resto. */
const POSES: Record<MonstroId, { normal: string } & Partial<Record<Humor, string>>> = {
  dracula: { normal: "vampira-normal", feliz: "vampira-feliz", bravo: "vampira-bravo" },
  lobisomem: { normal: "lobisomem" },
  mumia: { normal: "mumia-feliz" },
  zumbi: { normal: "zumbi" },
  fantasma: { normal: "fantasma" },
};

export const CAMINHOS_DOS_MONSTROS = Object.values(POSES).flatMap((poses) =>
  Object.values(poses).map((pose) => `/assets/monstros/${pose}.png`),
);

export function RetratoMonstro({
  monstro,
  humor = "normal",
}: {
  monstro: MonstroId;
  humor?: Humor;
}) {
  const pose = POSES[monstro][humor] ?? POSES[monstro].normal;
  return <img className="retrato-img" src={`/assets/monstros/${pose}.png`} alt="" draggable={false} />;
}

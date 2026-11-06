import type { Ingrediente } from "../game/conteudo.ts";

const ARQUIVOS: Record<Ingrediente, string> = {
  pao: "pao",
  carne: "carne",
  queijo: "queijo",
  picles: "picles",
  molho: "molho-vermelho",
  alho: "alho",
  salDePrata: "sal-de-prata",
  cerebro: "cerebro",
  sorveteDeNeblina: "sorvete-de-neblina",
};

export const CAMINHOS_DOS_INGREDIENTES = Object.values(ARQUIVOS).map(
  (arquivo) => `/assets/ingredientes/${arquivo}.png`,
);

export function ImagemIngrediente({ ingrediente }: { ingrediente: Ingrediente }) {
  return (
    <img
      className="ingrediente-img"
      src={`/assets/ingredientes/${ARQUIVOS[ingrediente]}.png`}
      alt=""
      draggable={false}
    />
  );
}

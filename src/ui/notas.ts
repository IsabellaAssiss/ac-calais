import { MONSTROS, type Ingrediente } from "../game/conteudo.ts";
import type { Cliente } from "../game/jogo.ts";

export type Notas = { pedido: boolean; regras: boolean; mania: boolean };

/**
 * Nota de cada critério, só para mostrar na tela: o jogo guarda apenas o pior resultado.
 * Sem o pedido completo não dá para saber quais eram as escolhas da casa, então a mania zera.
 */
export function notasDoLanche(cliente: Cliente, lanche: Ingrediente[]): Notas {
  const monstro = MONSTROS[cliente.monstro];
  const escolhas = [...lanche];
  const pedido = cliente.comanda.itensFixos.every((item) => {
    const posicao = escolhas.indexOf(item);
    if (posicao === -1) return false;
    escolhas.splice(posicao, 1);
    return true;
  });
  return {
    pedido,
    regras: !monstro.quebraRegraObvia(lanche),
    mania: pedido && monstro.atendeMania(escolhas),
  };
}

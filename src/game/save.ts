import { IDS_MONSTROS, type MonstroId } from "./conteudo.ts";
import type { GanhosDaNoite, Livro, Progresso } from "./jogo.ts";

type PaginaNoSave = { regra?: unknown; mania?: unknown } | undefined;

/** Monstros que chegaram depois dos primeiros saves: esses saves não têm a página deles. */
const MONSTROS_POSTERIORES: MonstroId[] = ["fantasma"];

function lerLivro(dado: object): Livro | null {
  const paginas = dado as Record<string, PaginaNoSave>;
  const livro = {} as Livro;
  for (const id of IDS_MONSTROS) {
    const pagina = paginas[id];
    if (pagina === undefined && MONSTROS_POSTERIORES.includes(id)) {
      livro[id] = { regra: false, mania: false };
      continue;
    }
    if (typeof pagina?.regra !== "boolean" || typeof pagina?.mania !== "boolean") return null;
    livro[id] = { regra: pagina.regra, mania: pagina.mania };
  }
  return livro;
}

const inteiroNaoNegativo = (valor: unknown): valor is number =>
  Number.isInteger(valor) && (valor as number) >= 0;

function lerGanhos(dado: unknown): GanhosDaNoite | null {
  if (typeof dado !== "object" || dado === null) return null;
  const { pagamentos, gorjetas } = dado as Record<string, unknown>;
  if (!inteiroNaoNegativo(pagamentos) || !inteiroNaoNegativo(gorjetas)) return null;
  return { pagamentos, gorjetas };
}

/** Devolve o progresso se o dado tiver o formato esperado, ou null se não tiver. */
export function lerProgresso(dado: unknown): Progresso | null {
  if (typeof dado !== "object" || dado === null) return null;
  const { dinheiro, noite, temPoteDeGorjetas, livro, fimDeDiaPendente } = dado as Record<string, unknown>;
  if (!inteiroNaoNegativo(dinheiro) || !inteiroNaoNegativo(noite) || noite < 1) return null;
  if (typeof temPoteDeGorjetas !== "boolean") return null;
  if (typeof livro !== "object" || livro === null) return null;
  const livroLido = lerLivro(livro);
  if (livroLido === null) return null;
  const progresso: Progresso = { dinheiro, noite, temPoteDeGorjetas, livro: livroLido };
  if (fimDeDiaPendente === undefined) return progresso;
  const ganhos = lerGanhos(fimDeDiaPendente);
  if (ganhos === null) return null;
  return { ...progresso, fimDeDiaPendente: ganhos };
}

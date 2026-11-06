import { IDS_MONSTROS } from "./conteudo.ts";
import type { Livro, Progresso } from "./jogo.ts";

type Pagina = { regra?: unknown; mania?: unknown };

/** Página ausente vem de um save anterior à chegada do monstro, então fica em branco. */
function lerLivro(dado: object): Livro | null {
  const paginas = dado as Record<string, Pagina | undefined>;
  const livro = {} as Livro;
  for (const id of IDS_MONSTROS) {
    const { regra = false, mania = false } = paginas[id] ?? {};
    if (typeof regra !== "boolean" || typeof mania !== "boolean") return null;
    livro[id] = { regra, mania };
  }
  return livro;
}

/** Devolve o progresso se o dado tiver o formato esperado, ou null se não tiver. */
export function lerProgresso(dado: unknown): Progresso | null {
  if (typeof dado !== "object" || dado === null) return null;
  const { dinheiro, noite, temPoteDeGorjetas, livro } = dado as Record<string, unknown>;
  const numerosValidos =
    Number.isInteger(dinheiro) &&
    (dinheiro as number) >= 0 &&
    Number.isInteger(noite) &&
    (noite as number) >= 1;
  if (!numerosValidos || typeof temPoteDeGorjetas !== "boolean") return null;
  if (typeof livro !== "object" || livro === null) return null;
  const livroLido = lerLivro(livro);
  if (livroLido === null) return null;
  return { dinheiro: dinheiro as number, noite: noite as number, temPoteDeGorjetas, livro: livroLido };
}

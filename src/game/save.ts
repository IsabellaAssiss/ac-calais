import { IDS_MONSTROS } from "./conteudo.ts";
import type { Progresso } from "./jogo.ts";

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
  const paginasValidas = IDS_MONSTROS.every((id) => {
    const pagina = (livro as Record<string, { regra?: unknown; mania?: unknown }>)[id];
    return typeof pagina?.regra === "boolean" && typeof pagina?.mania === "boolean";
  });
  return paginasValidas ? (dado as Progresso) : null;
}

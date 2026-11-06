import { describe, expect, it } from "vitest";
import type { MonstroId } from "./conteudo.ts";
import { progressoInicial, type Livro } from "./jogo.ts";
import { lerProgresso } from "./save.ts";

function semPagina(monstro: MonstroId) {
  const livro: Partial<Livro> = { ...progressoInicial().livro };
  delete livro[monstro];
  return livro;
}

describe("lerProgresso", () => {
  it.each([
    ["null", null],
    ["texto", "oi"],
    ["dinheiro negativo", { ...progressoInicial(), dinheiro: -1 }],
    ["noite zero", { ...progressoInicial(), noite: 0 }],
    ["sem pote", { ...progressoInicial(), temPoteDeGorjetas: undefined }],
    ["sem livro", { ...progressoInicial(), livro: undefined }],
    ["página malformada", { ...progressoInicial(), livro: { dracula: { regra: "sim", mania: false } } }],
    ["livro vazio", { ...progressoInicial(), livro: {} }],
    ["livro em lista", { ...progressoInicial(), livro: [] }],
    ["sem a página de um monstro antigo", { ...progressoInicial(), livro: semPagina("zumbi") }],
    ["página que não é objeto", { ...progressoInicial(), livro: { ...progressoInicial().livro, dracula: "lixo" } }],
    ["página nula", { ...progressoInicial(), livro: { ...progressoInicial().livro, dracula: null } }],
    ["página pela metade", { ...progressoInicial(), livro: { ...progressoInicial().livro, dracula: { regra: true } } }],
    ["página do Fantasma malformada", { ...progressoInicial(), livro: { ...progressoInicial().livro, fantasma: "lixo" } }],
  ])("recusa %s", (_, dado) => {
    expect(lerProgresso(dado)).toBeNull();
  });

  it("mantém o progresso de um save anterior ao Fantasma", () => {
    const pagina = { regra: true, mania: false };
    const lido = lerProgresso({
      dinheiro: 45,
      noite: 3,
      temPoteDeGorjetas: true,
      livro: { dracula: pagina, lobisomem: pagina, mumia: pagina, zumbi: pagina },
    });
    expect(lido).toMatchObject({ dinheiro: 45, noite: 3, temPoteDeGorjetas: true });
    expect(lido?.livro.dracula).toEqual(pagina);
    expect(lido?.livro.fantasma).toEqual({ regra: false, mania: false });
  });

  it("aceita um progresso válido", () => {
    expect(lerProgresso(progressoInicial())).toEqual(progressoInicial());
  });
});

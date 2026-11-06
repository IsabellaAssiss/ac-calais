import { describe, expect, it } from "vitest";
import { progressoInicial } from "./jogo.ts";
import { carregarDoNavegador, lerProgresso, salvarNoNavegador } from "./save.ts";

function armazenamentoFalso(inicial: string | null = null) {
  let valor = inicial;
  return {
    getItem: () => valor,
    setItem: (_: string, novo: string) => {
      valor = novo;
    },
  };
}

describe("save no navegador", () => {
  it("devolve null sem save", () => {
    expect(carregarDoNavegador(armazenamentoFalso())).toBeNull();
  });

  it("recupera o que foi salvo", () => {
    const armazenamento = armazenamentoFalso();
    const progresso = { ...progressoInicial(), dinheiro: 75, noite: 3, temPoteDeGorjetas: true };
    salvarNoNavegador(armazenamento, progresso);
    expect(carregarDoNavegador(armazenamento)).toEqual(progresso);
  });

  it("ignora JSON corrompido", () => {
    expect(carregarDoNavegador(armazenamentoFalso("{quebrado"))).toBeNull();
  });
});

describe("lerProgresso", () => {
  it.each([
    ["null", null],
    ["texto", "oi"],
    ["dinheiro negativo", { ...progressoInicial(), dinheiro: -1 }],
    ["noite zero", { ...progressoInicial(), noite: 0 }],
    ["sem pote", { ...progressoInicial(), temPoteDeGorjetas: undefined }],
    ["sem livro", { ...progressoInicial(), livro: undefined }],
    ["livro incompleto", { ...progressoInicial(), livro: { dracula: { regra: true, mania: false } } }],
  ])("recusa %s", (_, dado) => {
    expect(lerProgresso(dado)).toBeNull();
  });

  it("aceita um progresso válido", () => {
    expect(lerProgresso(progressoInicial())).toEqual(progressoInicial());
  });
});

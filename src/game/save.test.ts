import { describe, expect, it } from "vitest";
import { progressoInicial } from "./jogo.ts";
import { lerProgresso } from "./save.ts";

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

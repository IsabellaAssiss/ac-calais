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
    ["página malformada", { ...progressoInicial(), livro: { dracula: { regra: "sim", mania: false } } }],
  ])("recusa %s", (_, dado) => {
    expect(lerProgresso(dado)).toBeNull();
  });

  it("aceita save sem a página de um monstro e a devolve em branco", () => {
    const { zumbi: _ausente, ...semZumbi } = progressoInicial().livro;
    const lido = lerProgresso({ ...progressoInicial(), livro: semZumbi });
    expect(lido?.livro.zumbi).toEqual({ regra: false, mania: false });
  });

  it("aceita um progresso válido", () => {
    expect(lerProgresso(progressoInicial())).toEqual(progressoInicial());
  });
});

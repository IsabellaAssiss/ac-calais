import { describe, expect, it } from "vitest";
import type { Ingrediente } from "../game/conteudo.ts";
import { avaliarLanche, type Cliente } from "../game/jogo.ts";
import { notasDoLanche } from "./notas.ts";

const lobisomem: Cliente = { monstro: "lobisomem", comanda: { itensFixos: ["pao", "carne"] } };

describe("notasDoLanche", () => {
  it("dá nota cheia ao lanche perfeito", () => {
    expect(notasDoLanche(lobisomem, ["pao", "carne", "carne", "queijo"])).toEqual({
      pedido: true,
      regras: true,
      mania: true,
    });
  });

  it("zera só a mania quando ela não é atendida", () => {
    expect(notasDoLanche(lobisomem, ["pao", "carne", "queijo", "queijo"])).toEqual({
      pedido: true,
      regras: true,
      mania: false,
    });
  });

  it("não conta o item fixo como escolha da casa", () => {
    expect(notasDoLanche(lobisomem, ["pao", "carne", "picles", "queijo"]).mania).toBe(false);
  });

  it("zera a mania quando falta item da comanda, mesmo com o ingrediente dela", () => {
    expect(notasDoLanche(lobisomem, ["carne", "carne", "queijo", "queijo"])).toEqual({
      pedido: false,
      regras: true,
      mania: false,
    });
  });

  it("avalia os critérios separadamente no desastre", () => {
    expect(notasDoLanche(lobisomem, ["pao", "carne", "carne", "salDePrata"])).toEqual({
      pedido: true,
      regras: false,
      mania: true,
    });
  });

  it("concorda com o resultado do jogo", () => {
    const lanches: Ingrediente[][] = [
      ["pao", "carne", "carne", "queijo"],
      ["pao", "carne", "queijo", "queijo"],
      ["queijo", "queijo", "queijo", "queijo"],
      ["pao", "carne", "salDePrata", "alho"],
    ];
    for (const lanche of lanches) {
      const notas = notasDoLanche(lobisomem, lanche);
      const resultado = avaliarLanche(lobisomem, lanche);
      expect(resultado === "desastre").toBe(!notas.regras);
      expect(resultado === "perfeito").toBe(notas.pedido && notas.regras && notas.mania);
    }
  });
});

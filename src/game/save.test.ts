import { describe, expect, it } from "vitest";
import type { MonstroId } from "./conteudo.ts";
import { encerrarNoite, iniciarNoite, progressoInicial, servir, type Cliente, type Livro } from "./jogo.ts";
import { lerProgresso } from "./save.ts";

const cliente: Cliente = { monstro: "dracula", comanda: { itensFixos: ["pao", "carne"] } };

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
    ["fim de dia pendente nulo", { ...progressoInicial(), fimDeDiaPendente: null }],
    ["fim de dia pendente que não é objeto", { ...progressoInicial(), fimDeDiaPendente: "lixo" }],
    ["fim de dia pendente sem gorjetas", { ...progressoInicial(), fimDeDiaPendente: { pagamentos: 10 } }],
    ["pagamentos negativos", { ...progressoInicial(), fimDeDiaPendente: { pagamentos: -1, gorjetas: 0 } }],
    ["gorjetas fracionadas", { ...progressoInicial(), fimDeDiaPendente: { pagamentos: 0, gorjetas: 1.5 } }],
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

  it("mantém o fim de dia pendente depois de um recarregamento (#1)", () => {
    const progresso = { ...progressoInicial(), dinheiro: 75 };
    const noite = { ...iniciarNoite(progresso), clientes: [cliente] };
    const servida = servir(noite, ["pao", "carne", "molho", "queijo"]);

    const salvo: unknown = JSON.parse(JSON.stringify(encerrarNoite(progresso, servida)));

    expect(lerProgresso(salvo)).toMatchObject({
      dinheiro: 90,
      noite: 2,
      fimDeDiaPendente: { pagamentos: 10, gorjetas: 5 },
    });
  });

  it("não acrescenta fim de dia pendente a um save que não tem", () => {
    expect(lerProgresso(progressoInicial())).not.toHaveProperty("fimDeDiaPendente");
  });

  it("aceita um progresso válido", () => {
    expect(lerProgresso(progressoInicial())).toEqual(progressoInicial());
  });
});

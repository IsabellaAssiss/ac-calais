import { describe, expect, it } from "vitest";
import { INGREDIENTES, type Ingrediente, type MonstroId } from "./conteudo.ts";
import {
  avaliarLanche,
  comprarPote,
  encerrarNoite,
  ganhosDaNoite,
  iniciarNoite,
  noiteTerminou,
  progressoInicial,
  servir,
  sortearClientes,
  type Cliente,
  type Noite,
} from "./jogo.ts";

const cliente = (monstro: MonstroId, segundoFixo: Ingrediente = "carne"): Cliente => ({
  monstro,
  comanda: { itensFixos: ["pao", segundoFixo] },
});

/** Noite controlada, sem sorteio, com os clientes informados. */
function noiteCom(clientes: Cliente[], temPoteDeGorjetas = false): Noite {
  return {
    numero: 1,
    clientes,
    atendimentos: [],
    livro: progressoInicial().livro,
    temPoteDeGorjetas,
  };
}

function rngSequencial(semente: number) {
  let estado = semente;
  return () => {
    estado = (estado * 9301 + 49297) % 233280;
    return estado / 233280;
  };
}

describe("avaliarLanche", () => {
  const casos: [MonstroId, Ingrediente[], string][] = [
    ["dracula", ["pao", "carne", "alho", "molho"], "desastre"],
    ["dracula", ["pao", "carne", "molho", "queijo"], "perfeito"],
    ["dracula", ["pao", "carne", "queijo", "picles"], "maniaNaoAtendida"],
    ["lobisomem", ["pao", "carne", "salDePrata", "carne"], "desastre"],
    ["lobisomem", ["pao", "carne", "carne", "queijo"], "perfeito"],
    ["lobisomem", ["pao", "carne", "queijo", "picles"], "maniaNaoAtendida"],
    ["mumia", ["pao", "carne", "molho", "picles"], "desastre"],
    ["mumia", ["pao", "carne", "picles", "queijo"], "perfeito"],
    ["mumia", ["pao", "carne", "queijo", "alho"], "maniaNaoAtendida"],
    ["zumbi", ["pao", "carne", "queijo", "picles"], "desastre"],
    ["zumbi", ["pao", "carne", "cerebro", "cerebro"], "perfeito"],
    ["zumbi", ["pao", "carne", "cerebro", "queijo"], "maniaNaoAtendida"],
  ];

  it.each(casos)("%s com %j resulta em %s", (monstro, lanche, esperado) => {
    expect(avaliarLanche(cliente(monstro), lanche)).toBe(esperado);
  });

  it("não considera o item fixo como escolha da casa para a mania", () => {
    expect(avaliarLanche(cliente("lobisomem"), ["pao", "carne", "queijo", "picles"])).toBe(
      "maniaNaoAtendida",
    );
    expect(
      avaliarLanche(cliente("lobisomem", "queijo"), ["pao", "queijo", "carne", "picles"]),
    ).toBe("perfeito");
  });

  it("trata a falta de item fixo como pedido errado", () => {
    expect(avaliarLanche(cliente("dracula"), ["carne", "queijo", "molho", "picles"])).toBe(
      "pedidoErrado",
    );
  });

  it("não depende da ordem dos ingredientes", () => {
    expect(avaliarLanche(cliente("dracula"), ["molho", "queijo", "carne", "pao"])).toBe("perfeito");
  });

  it("prioriza regra óbvia sobre pedido errado", () => {
    expect(avaliarLanche(cliente("dracula"), ["alho", "queijo", "picles", "molho"])).toBe(
      "desastre",
    );
  });

  it("prioriza pedido errado sobre mania não atendida", () => {
    expect(avaliarLanche(cliente("dracula"), ["queijo", "queijo", "picles", "picles"])).toBe(
      "pedidoErrado",
    );
  });
});

describe("servir", () => {
  it("paga e dá gorjeta quando está tudo certo", () => {
    const noite = servir(noiteCom([cliente("dracula")]), ["pao", "carne", "molho", "queijo"]);
    expect(noite.atendimentos[0]).toMatchObject({ pagamento: 10, gorjeta: 5, novaAnotacao: false });
  });

  it("no desastre não paga e anota a regra", () => {
    const noite = servir(noiteCom([cliente("dracula")]), ["pao", "carne", "alho", "molho"]);
    expect(noite.atendimentos[0]).toMatchObject({ pagamento: 0, gorjeta: 0, novaAnotacao: true });
    expect(noite.livro.dracula).toEqual({ regra: true, mania: false });
  });

  it("na mania não atendida paga, sem gorjeta, e anota a mania", () => {
    const noite = servir(noiteCom([cliente("mumia")]), ["pao", "carne", "queijo", "alho"]);
    expect(noite.atendimentos[0]).toMatchObject({ pagamento: 10, gorjeta: 0, novaAnotacao: true });
    expect(noite.livro.mumia).toEqual({ regra: false, mania: true });
  });

  it("no pedido errado paga, sem gorjeta, e não anota nada", () => {
    const noite = servir(noiteCom([cliente("dracula")]), ["queijo", "queijo", "picles", "picles"]);
    expect(noite.atendimentos[0]).toMatchObject({ pagamento: 10, gorjeta: 0, novaAnotacao: false });
    expect(noite.livro.dracula).toEqual({ regra: false, mania: false });
  });

  it("anota só o erro que causou a reação mostrada", () => {
    const noite = servir(noiteCom([cliente("dracula")]), ["pao", "carne", "alho", "queijo"]);
    expect(noite.livro.dracula).toEqual({ regra: true, mania: false });
  });

  it("não anota de novo um erro repetido", () => {
    const lanche: Ingrediente[] = ["pao", "carne", "alho", "queijo"];
    const noite = servir(servir(noiteCom([cliente("dracula"), cliente("dracula")]), lanche), lanche);
    expect(noite.atendimentos.map((a) => a.novaAnotacao)).toEqual([true, false]);
  });

  it("dobra a gorjeta com o Pote de Gorjetas", () => {
    const noite = servir(noiteCom([cliente("dracula")], true), ["pao", "carne", "molho", "queijo"]);
    expect(noite.atendimentos[0].gorjeta).toBe(10);
  });

  it("recusa lanche com quantidade errada de ingredientes", () => {
    expect(() => servir(noiteCom([cliente("dracula")]), ["pao"])).toThrow();
  });
});

describe("sortearClientes", () => {
  it.each(Array.from({ length: 200 }, (_, i) => i))("semente %i respeita a noite", (semente) => {
    const clientes = sortearClientes(rngSequencial(semente));
    const monstros = clientes.map((c) => c.monstro);
    expect(monstros).toHaveLength(5);
    expect(new Set(monstros).size).toBe(4);
    monstros.slice(1).forEach((monstro, i) => expect(monstro).not.toBe(monstros[i]));
    for (const { comanda } of clientes) {
      expect(comanda.itensFixos[0]).toBe("pao");
      expect(["carne", "queijo"]).toContain(comanda.itensFixos[1]);
    }
  });
});

describe("Fantasma", () => {
  it("começa com a página em branco no Livro de Manias", () => {
    expect(progressoInicial().livro.fantasma).toEqual({ regra: false, mania: false });
  });

  it("entra no sorteio dos clientes, e todos os monstros aparecem", () => {
    const sorteados = new Set(
      Array.from({ length: 200 }, (_, semente) => sortearClientes(rngSequencial(semente)))
        .flat()
        .map((c) => c.monstro),
    );
    expect(sorteados).toEqual(new Set(["dracula", "lobisomem", "mumia", "zumbi", "fantasma"]));
  });

  it("Sal de prata causa desastre: ele atravessa a parede sem pagar", () => {
    const noite = servir(noiteCom([cliente("fantasma")]), ["pao", "carne", "salDePrata", "queijo"]);
    expect(noite.atendimentos[0]).toMatchObject({ resultado: "desastre", pagamento: 0, gorjeta: 0 });
    expect(noite.livro.fantasma).toEqual({ regra: true, mania: false });
  });

  it("Sorvete de neblina nas escolhas da casa vale a gorjeta", () => {
    const noite = servir(noiteCom([cliente("fantasma")]), [
      "pao",
      "carne",
      "sorveteDeNeblina",
      "queijo",
    ]);
    expect(noite.atendimentos[0]).toMatchObject({ resultado: "perfeito", pagamento: 10, gorjeta: 5 });
  });

  it("sem Sorvete de neblina paga, sem gorjeta, e anota a mania", () => {
    const noite = servir(noiteCom([cliente("fantasma")]), ["pao", "carne", "queijo", "picles"]);
    expect(noite.atendimentos[0]).toMatchObject({
      resultado: "maniaNaoAtendida",
      pagamento: 10,
      gorjeta: 0,
    });
    expect(noite.livro.fantasma).toEqual({ regra: false, mania: true });
  });
});

describe("invariante dos itens fixos", () => {
  const monstros: MonstroId[] = ["dracula", "lobisomem", "mumia", "zumbi", "fantasma"];
  const ingredientes = Object.keys(INGREDIENTES) as Ingrediente[];
  const casos = monstros.flatMap((monstro) =>
    (["carne", "queijo"] as Ingrediente[]).map((fixo) => [monstro, fixo] as const),
  );

  it.each(casos)("%s com Pão + %s pode ser totalmente atendido", (monstro, fixo) => {
    const perfeitos = ingredientes.flatMap((a) =>
      ingredientes.filter(
        (b) => avaliarLanche(cliente(monstro, fixo), ["pao", fixo, a, b]) === "perfeito",
      ),
    );
    expect(perfeitos.length).toBeGreaterThan(0);
  });
});

describe("progresso entre noites", () => {
  const escolhasPerfeitas: Record<MonstroId, Ingrediente[]> = {
    dracula: ["molho", "queijo"],
    lobisomem: ["carne", "queijo"],
    mumia: ["picles", "queijo"],
    zumbi: ["cerebro", "cerebro"],
    fantasma: ["sorveteDeNeblina", "queijo"],
  };

  function jogarNoitePerfeita(noite: Noite): Noite {
    let atual = noite;
    while (!noiteTerminou(atual)) {
      const { monstro, comanda } = atual.clientes[atual.atendimentos.length];
      atual = servir(atual, [...comanda.itensFixos, ...escolhasPerfeitas[monstro]]);
    }
    return atual;
  }

  it("uma noite perfeita rende $75 e avança o número da noite", () => {
    const inicial = progressoInicial();
    const noite = jogarNoitePerfeita(iniciarNoite(inicial, rngSequencial(1)));
    expect(ganhosDaNoite(noite)).toEqual({ pagamentos: 50, gorjetas: 25 });
    expect(encerrarNoite(inicial, noite)).toMatchObject({ dinheiro: 75, noite: 2 });
  });

  it("acumula dinheiro e mantém o Livro ao encerrar a noite", () => {
    const inicial = { ...progressoInicial(), dinheiro: 20 };
    const noite = servir(noiteCom([cliente("dracula")]), ["pao", "carne", "alho", "queijo"]);
    expect(encerrarNoite(inicial, noite)).toMatchObject({
      dinheiro: 20,
      noite: 2,
      livro: { dracula: { regra: true, mania: false } },
    });
  });

  it("compra o Pote de Gorjetas só com dinheiro e uma única vez", () => {
    const pobre = { ...progressoInicial(), dinheiro: 29 };
    expect(comprarPote(pobre)).toEqual(pobre);

    const comprado = comprarPote({ ...progressoInicial(), dinheiro: 30 });
    expect(comprado).toMatchObject({ dinheiro: 0, temPoteDeGorjetas: true });

    const rico = { ...comprado, dinheiro: 100 };
    expect(comprarPote(rico)).toEqual(rico);
  });

  it("a noite seguinte herda o Pote comprado", () => {
    const progresso = comprarPote({ ...progressoInicial(), dinheiro: 30 });
    expect(iniciarNoite(progresso, rngSequencial(1)).temPoteDeGorjetas).toBe(true);
  });
});

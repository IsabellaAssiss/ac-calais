import type { Server } from "node:http";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { progressoInicial } from "../src/game/jogo.ts";
import { criarApp } from "./app.ts";

let servidor: Server;
let base: string;

beforeAll(async () => {
  await new Promise<void>((pronto) => {
    servidor = criarApp(":memory:").listen(0, "127.0.0.1", () => pronto());
  });
  const endereco = servidor.address();
  if (endereco === null || typeof endereco === "string") throw new Error("Sem porta.");
  base = `http://127.0.0.1:${endereco.port}`;
});

afterAll(() => {
  servidor.close();
});

/** Cliente HTTP mínimo que guarda o cookie de sessão, como um navegador. */
function navegador() {
  let cookie = "";
  return async (metodo: string, rota: string, corpo?: unknown) => {
    const resposta = await fetch(base + rota, {
      method: metodo,
      headers: { "content-type": "application/json", cookie },
      body: corpo === undefined ? undefined : JSON.stringify(corpo),
    });
    const definido = resposta.headers.get("set-cookie");
    if (definido) cookie = definido.split(";")[0];
    return resposta;
  };
}

describe("autenticação", () => {
  it("cadastra, mantém a sessão e encerra ao sair", async () => {
    const pedir = navegador();
    const cadastro = await pedir("POST", "/api/cadastro", { nome: "Bruna", senha: "segredo1" });
    expect(cadastro.status).toBe(201);
    expect(cadastro.headers.get("set-cookie")).toMatch(/HttpOnly/i);
    expect(await (await pedir("GET", "/api/sessao")).json()).toEqual({ nome: "Bruna" });

    expect((await pedir("POST", "/api/sair")).status).toBe(204);
    expect((await pedir("GET", "/api/sessao")).status).toBe(401);
  });

  it("recusa nome já usado, mesmo com outra caixa", async () => {
    const pedir = navegador();
    await pedir("POST", "/api/cadastro", { nome: "Carla", senha: "segredo1" });
    const repetido = await navegador()("POST", "/api/cadastro", { nome: "CARLA", senha: "outra123" });
    expect(repetido.status).toBe(409);
  });

  it.each([
    [{ nome: "ab", senha: "segredo1" }],
    [{ nome: "Valido", senha: "123" }],
    [{ nome: 1, senha: "segredo1" }],
    [{}],
  ])("recusa cadastro inválido %j", async (corpo) => {
    expect((await navegador()("POST", "/api/cadastro", corpo)).status).toBe(400);
  });

  it("entra com a senha certa e recusa a errada e usuário inexistente", async () => {
    await navegador()("POST", "/api/cadastro", { nome: "Dani", senha: "segredo1" });

    const pedir = navegador();
    expect((await pedir("POST", "/api/entrar", { nome: "Dani", senha: "errada99" })).status).toBe(401);
    expect((await pedir("POST", "/api/entrar", { nome: "Ninguem", senha: "segredo1" })).status).toBe(401);
    expect((await pedir("GET", "/api/sessao")).status).toBe(401);

    expect((await pedir("POST", "/api/entrar", { nome: "Dani", senha: "segredo1" })).status).toBe(200);
    expect((await pedir("GET", "/api/sessao")).status).toBe(200);
  });
});

describe("save", () => {
  const progresso = { ...progressoInicial(), dinheiro: 75, noite: 2 };

  it("exige sessão", async () => {
    const pedir = navegador();
    expect((await pedir("GET", "/api/save")).status).toBe(401);
    expect((await pedir("PUT", "/api/save", progresso)).status).toBe(401);
  });

  it("começa vazio, guarda, sobrescreve e sobrevive a um novo login", async () => {
    const pedir = navegador();
    await pedir("POST", "/api/cadastro", { nome: "Elisa", senha: "segredo1" });
    expect(await (await pedir("GET", "/api/save")).json()).toEqual({ progresso: null });

    expect((await pedir("PUT", "/api/save", progressoInicial())).status).toBe(204);
    expect((await pedir("PUT", "/api/save", progresso)).status).toBe(204);

    const depois = navegador();
    await depois("POST", "/api/entrar", { nome: "Elisa", senha: "segredo1" });
    expect(await (await depois("GET", "/api/save")).json()).toEqual({ progresso });
  });

  it("recusa save inválido", async () => {
    const pedir = navegador();
    await pedir("POST", "/api/cadastro", { nome: "Fabi", senha: "segredo1" });
    expect((await pedir("PUT", "/api/save", { dinheiro: -5 })).status).toBe(400);
  });

  it("recusa save com o Livro vazio e não apaga o que estava guardado", async () => {
    const pedir = navegador();
    await pedir("POST", "/api/cadastro", { nome: "Iara", senha: "segredo1" });
    await pedir("PUT", "/api/save", progresso);

    const resposta = await pedir("PUT", "/api/save", { ...progresso, livro: {} });

    expect(resposta.status).toBe(400);
    expect(await (await pedir("GET", "/api/save")).json()).toEqual({ progresso });
  });

  it("separa o save de cada jogador", async () => {
    const primeira = navegador();
    await primeira("POST", "/api/cadastro", { nome: "Gabi", senha: "segredo1" });
    await primeira("PUT", "/api/save", progresso);

    const segunda = navegador();
    await segunda("POST", "/api/cadastro", { nome: "Hele", senha: "segredo1" });
    expect(await (await segunda("GET", "/api/save")).json()).toEqual({ progresso: null });
  });
});

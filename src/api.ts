import type { Progresso } from "./game/jogo.ts";
import { lerProgresso } from "./game/save.ts";

const SERVIDOR_FORA_DO_AR = "Não foi possível falar com o servidor.";

async function pedir(metodo: string, rota: string, corpo?: unknown): Promise<Response> {
  try {
    return await fetch(rota, {
      method: metodo,
      headers: corpo === undefined ? undefined : { "content-type": "application/json" },
      body: corpo === undefined ? undefined : JSON.stringify(corpo),
    });
  } catch {
    throw new Error(SERVIDOR_FORA_DO_AR);
  }
}

async function mensagemDeErro(resposta: Response): Promise<string> {
  try {
    const { erro } = (await resposta.json()) as { erro?: string };
    if (erro) return erro;
  } catch {
    // Sem corpo JSON: o proxy não alcançou o servidor do jogo.
  }
  return SERVIDOR_FORA_DO_AR;
}

/** Devolve o nome do jogador conectado, ou null se não houver sessão. */
export async function buscarSessao(): Promise<string | null> {
  const resposta = await pedir("GET", "/api/sessao");
  if (!resposta.ok) return null;
  return ((await resposta.json()) as { nome: string }).nome;
}

export async function autenticar(
  acao: "entrar" | "cadastro",
  nome: string,
  senha: string,
): Promise<string> {
  const resposta = await pedir("POST", `/api/${acao}`, { nome, senha });
  if (!resposta.ok) throw new Error(await mensagemDeErro(resposta));
  return ((await resposta.json()) as { nome: string }).nome;
}

export async function sair(): Promise<void> {
  await pedir("POST", "/api/sair");
}

export async function carregarSave(): Promise<Progresso | null> {
  const resposta = await pedir("GET", "/api/save");
  if (!resposta.ok) throw new Error(await mensagemDeErro(resposta));
  const { progresso } = (await resposta.json()) as { progresso: unknown };
  return lerProgresso(progresso);
}

export async function enviarSave(progresso: Progresso): Promise<void> {
  const resposta = await pedir("PUT", "/api/save", progresso);
  if (!resposta.ok) throw new Error(await mensagemDeErro(resposta));
}

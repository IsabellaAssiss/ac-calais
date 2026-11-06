import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { DatabaseSync } from "node:sqlite";
import { promisify } from "node:util";
import express, { type Request, type Response } from "express";
import { lerProgresso } from "../src/game/save.ts";

const derivarChave = promisify(scrypt) as (
  senha: string,
  sal: Buffer,
  tamanho: number,
) => Promise<Buffer>;

const TAMANHO_DA_CHAVE = 64;
const COOKIE = "sessao";

async function protegerSenha(senha: string): Promise<string> {
  const sal = randomBytes(16);
  const chave = await derivarChave(senha, sal, TAMANHO_DA_CHAVE);
  return `${sal.toString("hex")}:${chave.toString("hex")}`;
}

async function senhaConfere(senha: string, guardada: string): Promise<boolean> {
  const [sal, chave] = guardada.split(":");
  const esperada = Buffer.from(chave, "hex");
  const recebida = await derivarChave(senha, Buffer.from(sal, "hex"), TAMANHO_DA_CHAVE);
  return timingSafeEqual(esperada, recebida);
}

function credenciais(req: Request): { nome: string; senha: string } | null {
  const { nome, senha } = (req.body ?? {}) as { nome?: unknown; senha?: unknown };
  if (typeof nome !== "string" || typeof senha !== "string") return null;
  return { nome: nome.trim(), senha };
}

function tokenDoCookie(req: Request): string | null {
  const par = req.headers.cookie
    ?.split(";")
    .map((p) => p.trim())
    .find((p) => p.startsWith(`${COOKIE}=`));
  return par ? par.slice(COOKIE.length + 1) : null;
}

/** Monta a API. O caminho do banco é um parâmetro para os testes usarem um banco em memória. */
export function criarApp(caminhoDoBanco: string) {
  const banco = new DatabaseSync(caminhoDoBanco);
  banco.exec(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY,
      nome TEXT NOT NULL UNIQUE COLLATE NOCASE,
      senha TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS sessoes (
      token TEXT PRIMARY KEY,
      usuario_id INTEGER NOT NULL REFERENCES usuarios(id)
    );
    CREATE TABLE IF NOT EXISTS saves (
      usuario_id INTEGER PRIMARY KEY REFERENCES usuarios(id),
      progresso TEXT NOT NULL
    );
  `);

  function abrirSessao(res: Response, usuarioId: number | bigint) {
    const token = randomBytes(32).toString("hex");
    banco.prepare("INSERT INTO sessoes (token, usuario_id) VALUES (?, ?)").run(token, usuarioId);
    res.cookie(COOKIE, token, { httpOnly: true, sameSite: "strict", path: "/" });
  }

  function usuarioDaSessao(req: Request) {
    const token = tokenDoCookie(req);
    if (token === null) return null;
    return banco
      .prepare(
        `SELECT usuarios.id AS id, usuarios.nome AS nome
         FROM sessoes JOIN usuarios ON usuarios.id = sessoes.usuario_id
         WHERE sessoes.token = ?`,
      )
      .get(token) as { id: number; nome: string } | undefined ?? null;
  }

  /** Devolve o usuário da sessão, ou responde 401 e devolve null. */
  function exigirUsuario(req: Request, res: Response) {
    const usuario = usuarioDaSessao(req);
    if (usuario === null) res.status(401).json({ erro: "Sem sessão." });
    return usuario;
  }

  const app = express();
  app.use(express.json());

  app.post("/api/cadastro", async (req, res) => {
    const dados = credenciais(req);
    if (dados === null || dados.nome.length < 3 || dados.nome.length > 30) {
      res.status(400).json({ erro: "O nome precisa ter de 3 a 30 caracteres." });
      return;
    }
    if (dados.senha.length < 6 || dados.senha.length > 200) {
      res.status(400).json({ erro: "A senha precisa ter de 6 a 200 caracteres." });
      return;
    }
    const senha = await protegerSenha(dados.senha);
    const criado = banco
      .prepare("INSERT OR IGNORE INTO usuarios (nome, senha) VALUES (?, ?)")
      .run(dados.nome, senha);
    if (criado.changes === 0) {
      res.status(409).json({ erro: "Esse nome já está em uso." });
      return;
    }
    abrirSessao(res, criado.lastInsertRowid);
    res.status(201).json({ nome: dados.nome });
  });

  app.post("/api/entrar", async (req, res) => {
    const dados = credenciais(req);
    const usuario = dados
      ? (banco.prepare("SELECT id, nome, senha FROM usuarios WHERE nome = ?").get(dados.nome) as
          | { id: number; nome: string; senha: string }
          | undefined)
      : undefined;
    if (!dados || !usuario || !(await senhaConfere(dados.senha, usuario.senha))) {
      res.status(401).json({ erro: "Nome ou senha incorretos." });
      return;
    }
    abrirSessao(res, usuario.id);
    res.json({ nome: usuario.nome });
  });

  app.post("/api/sair", (req, res) => {
    const token = tokenDoCookie(req);
    if (token !== null) banco.prepare("DELETE FROM sessoes WHERE token = ?").run(token);
    res.clearCookie(COOKIE, { path: "/" });
    res.status(204).end();
  });

  app.get("/api/sessao", (req, res) => {
    const usuario = exigirUsuario(req, res);
    if (usuario === null) return;
    res.json({ nome: usuario.nome });
  });

  app.get("/api/save", (req, res) => {
    const usuario = exigirUsuario(req, res);
    if (usuario === null) return;
    const linha = banco.prepare("SELECT progresso FROM saves WHERE usuario_id = ?").get(usuario.id) as
      | { progresso: string }
      | undefined;
    res.json({ progresso: linha ? JSON.parse(linha.progresso) : null });
  });

  app.put("/api/save", (req, res) => {
    const usuario = exigirUsuario(req, res);
    if (usuario === null) return;
    const progresso = lerProgresso(req.body);
    if (progresso === null) {
      res.status(400).json({ erro: "Save inválido." });
      return;
    }
    banco
      .prepare(
        `INSERT INTO saves (usuario_id, progresso) VALUES (?, ?)
         ON CONFLICT (usuario_id) DO UPDATE SET progresso = excluded.progresso`,
      )
      .run(usuario.id, JSON.stringify(progresso));
    res.status(204).end();
  });

  return app;
}

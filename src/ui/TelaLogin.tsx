import { useState, type FormEvent } from "react";
import { autenticar } from "../api.ts";

export function TelaLogin({ aoEntrar }: { aoEntrar: (nome: string) => void }) {
  const [nome, setNome] = useState("");
  const [senha, setSenha] = useState("");
  const [modo, setModo] = useState<"entrar" | "cadastro">("entrar");
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const cadastrando = modo === "cadastro";

  async function aoEnviar(evento: FormEvent) {
    evento.preventDefault();
    setErro(null);
    setEnviando(true);
    try {
      aoEntrar(await autenticar(modo, nome, senha));
    } catch (falha) {
      setErro(falha instanceof Error ? falha.message : "Algo deu errado.");
      setEnviando(false);
    }
  }

  return (
    <main className="tela tela-login">
      <h1 className="titulo">Monster Munchies</h1>
      <form className="painel formulario" onSubmit={aoEnviar}>
        <label>
          Nome
          <input
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            autoComplete="username"
            autoFocus
            required
          />
        </label>
        <label>
          Senha
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            autoComplete={cadastrando ? "new-password" : "current-password"}
            required
          />
        </label>
        {erro && (
          <p className="erro" role="alert">
            {erro}
          </p>
        )}
        <button className="botao-principal" disabled={enviando}>
          {cadastrando ? "Criar conta" : "Entrar"}
        </button>
        <button
          type="button"
          className="botao-link"
          onClick={() => {
            setModo(cadastrando ? "entrar" : "cadastro");
            setErro(null);
          }}
        >
          {cadastrando ? "Já tenho conta" : "Criar uma conta"}
        </button>
      </form>
    </main>
  );
}

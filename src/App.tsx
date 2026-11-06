import { useEffect, useRef, useState } from "react";
import { buscarSessao, carregarSave, enviarSave, sair } from "./api.ts";
import { progressoInicial, type Progresso } from "./game/jogo.ts";
import { Jogo } from "./Jogo.tsx";
import { TelaLogin } from "./ui/TelaLogin.tsx";

type Estado =
  | { fase: "carregando" }
  | { fase: "login" }
  | { fase: "jogo"; nome: string; progresso: Progresso }
  | { fase: "falha"; mensagem: string };

export function App() {
  const [estado, setEstado] = useState<Estado>({ fase: "carregando" });
  const [falhaAoSalvar, setFalhaAoSalvar] = useState(false);
  // Envia um save de cada vez, para o último nunca ser sobrescrito por um anterior.
  const filaDeSaves = useRef(Promise.resolve());

  async function abrirJogo(nome: string) {
    try {
      const progresso = (await carregarSave()) ?? progressoInicial();
      setEstado({ fase: "jogo", nome, progresso });
    } catch (falha) {
      const mensagem = falha instanceof Error ? falha.message : "Algo deu errado.";
      setEstado({ fase: "falha", mensagem });
    }
  }

  useEffect(() => {
    buscarSessao()
      .then((nome) => (nome === null ? setEstado({ fase: "login" }) : abrirJogo(nome)))
      .catch(() => setEstado({ fase: "login" }));
  }, []);

  function salvar(progresso: Progresso) {
    filaDeSaves.current = filaDeSaves.current
      .then(() => enviarSave(progresso))
      .then(() => setFalhaAoSalvar(false))
      .catch(() => setFalhaAoSalvar(true));
  }

  async function aoSair() {
    await filaDeSaves.current;
    await sair().catch(() => {});
    setFalhaAoSalvar(false);
    setEstado({ fase: "login" });
  }

  if (estado.fase === "carregando") return <main className="tela aviso">Abrindo a lanchonete...</main>;
  if (estado.fase === "falha") return <main className="tela aviso">{estado.mensagem}</main>;
  if (estado.fase === "login") return <TelaLogin aoEntrar={abrirJogo} />;

  return (
    <>
      <div className="conta">
        <span>{estado.nome}</span>
        <button className="botao-link" onClick={aoSair}>
          Sair
        </button>
      </div>
      {falhaAoSalvar && (
        <p className="erro erro-save" role="alert">
          Não foi possível salvar o progresso. Verifique o servidor.
        </p>
      )}
      <Jogo progressoSalvo={estado.progresso} salvar={salvar} />
    </>
  );
}

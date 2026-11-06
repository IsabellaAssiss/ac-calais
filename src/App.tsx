import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { buscarSessao, carregarSave, enviarSave, sair } from "./api.ts";
import { progressoInicial, type Progresso } from "./game/jogo.ts";
import { Jogo } from "./Jogo.tsx";
import { TelaCarregamento, TelaTitulo } from "./ui/TelaAbertura.tsx";
import { TelaLogin } from "./ui/TelaLogin.tsx";

type Estado =
  | { fase: "carregando" }
  | { fase: "login" }
  | { fase: "jogo"; nome: string; progresso: Progresso }
  | { fase: "falha"; mensagem: string };

/** A tela é fixa em 960x600 e só encolhe se a janela for menor que ela. */
function Moldura({ children }: { children: ReactNode }) {
  const calcular = () => Math.min(1, (innerWidth - 16) / 976, (innerHeight - 16) / 616);
  const [escala, setEscala] = useState(calcular);

  useEffect(() => {
    const aoRedimensionar = () => setEscala(calcular());
    addEventListener("resize", aoRedimensionar);
    return () => removeEventListener("resize", aoRedimensionar);
  }, []);

  return (
    <div className="moldura" style={{ transform: `scale(${escala})` }}>
      {children}
    </div>
  );
}

export function App() {
  const [estado, setEstado] = useState<Estado>({ fase: "carregando" });
  const [abertura, setAbertura] = useState<"carregamento" | "titulo" | "encerrada">("carregamento");
  const terminarCarregamento = useCallback(() => setAbertura("titulo"), []);
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

  if (abertura === "carregamento") {
    return (
      <Moldura>
        <TelaCarregamento aoTerminar={terminarCarregamento} />
      </Moldura>
    );
  }
  if (abertura === "titulo") {
    return (
      <Moldura>
        <TelaTitulo aoJogar={() => setAbertura("encerrada")} />
      </Moldura>
    );
  }
  if (estado.fase === "carregando") {
    return (
      <Moldura>
        <main className="tela aviso">Abrindo a lanchonete...</main>
      </Moldura>
    );
  }
  if (estado.fase === "falha") {
    return (
      <Moldura>
        <main className="tela aviso">{estado.mensagem}</main>
      </Moldura>
    );
  }
  if (estado.fase === "login") {
    return (
      <Moldura>
        <TelaLogin aoEntrar={abrirJogo} />
      </Moldura>
    );
  }

  return (
    <>
      <div className="conta">
        <span>{estado.nome}</span>
        <button className="botao-link" onClick={aoSair}>
          Sair
        </button>
      </div>
      <Moldura>
        <Jogo progressoSalvo={estado.progresso} salvar={salvar} aoSair={aoSair} />
        {falhaAoSalvar && (
          <p className="erro erro-save" role="alert">
            Não foi possível salvar o progresso. Verifique o servidor.
          </p>
        )}
      </Moldura>
    </>
  );
}

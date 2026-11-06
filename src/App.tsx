import { useState } from "react";
import {
  encerrarNoite,
  ganhosDaNoite,
  iniciarNoite,
  noiteTerminou,
  progressoInicial,
  servir,
  type Noite,
  type Progresso,
} from "./game/jogo.ts";
import type { Ingrediente } from "./game/conteudo.ts";
import { TelaNoite } from "./ui/TelaNoite.tsx";

export function App() {
  const [progresso, setProgresso] = useState<Progresso>(progressoInicial);
  const [noite, setNoite] = useState<Noite>(() => iniciarNoite(progresso));
  const [fimDeDia, setFimDeDia] = useState(false);

  function aoServir(lanche: Ingrediente[]) {
    setNoite(servir(noite, lanche));
  }

  function aoSeguir() {
    if (noiteTerminou(noite)) {
      setProgresso(encerrarNoite(progresso, noite));
      setFimDeDia(true);
    }
  }

  function aoProximaNoite() {
    setNoite(iniciarNoite(progresso));
    setFimDeDia(false);
  }

  if (fimDeDia) {
    const { pagamentos, gorjetas } = ganhosDaNoite(noite);
    return (
      <main className="tela">
        <h1>Fim da noite {noite.numero}</h1>
        <p>Ganhos: ${pagamentos + gorjetas}</p>
        <button className="botao-principal" onClick={aoProximaNoite}>
          Próxima noite
        </button>
      </main>
    );
  }

  return <TelaNoite noite={noite} aoServir={aoServir} aoSeguir={aoSeguir} />;
}

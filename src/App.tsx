import { progressoInicial } from "./game/jogo.ts";
import { carregarDoNavegador, salvarNoNavegador } from "./game/save.ts";
import { Jogo } from "./Jogo.tsx";

export function App() {
  return (
    <Jogo
      progressoSalvo={carregarDoNavegador(localStorage) ?? progressoInicial()}
      salvar={(progresso) => salvarNoNavegador(localStorage, progresso)}
    />
  );
}

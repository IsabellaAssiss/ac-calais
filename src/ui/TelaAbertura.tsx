import { useEffect } from "react";
import { CAMINHOS_DOS_INGREDIENTES } from "./ImagemIngrediente.tsx";
import { CAMINHOS_DOS_MONSTROS, RetratoMonstro } from "./RetratoMonstro.tsx";

const DURACAO_DO_CARREGAMENTO_EM_MS = 2000;

/** A barra é só para dar clima de jogo Flash, mas aproveita para já baixar as imagens. */
export function TelaCarregamento({ aoTerminar }: { aoTerminar: () => void }) {
  useEffect(() => {
    for (const caminho of [...CAMINHOS_DOS_MONSTROS, ...CAMINHOS_DOS_INGREDIENTES]) {
      new Image().src = caminho;
    }
    const temporizador = setTimeout(aoTerminar, DURACAO_DO_CARREGAMENTO_EM_MS);
    return () => clearTimeout(temporizador);
  }, [aoTerminar]);

  return (
    <main className="tela tela-carregamento">
      <strong className="carregando">Carregando...</strong>
      <div
        className="barra-carregamento"
        role="progressbar"
        aria-label="Carregando"
        style={{ animationDuration: `${DURACAO_DO_CARREGAMENTO_EM_MS}ms` }}
      />
    </main>
  );
}

export function TelaTitulo({ aoJogar }: { aoJogar: () => void }) {
  return (
    <main className="tela-titulo">
      <div className="espiando espiando-esquerda">
        <RetratoMonstro monstro="dracula" />
      </div>
      <div className="espiando espiando-direita">
        <RetratoMonstro monstro="lobisomem" />
      </div>
      <h1 className="logo">
        <span>Monster</span>
        <span>Munchies</span>
      </h1>
      <button className="botao-principal botao-jogar" autoFocus onClick={aoJogar}>
        JOGAR!
      </button>
    </main>
  );
}

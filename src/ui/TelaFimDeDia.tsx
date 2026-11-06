import {
  podeComprarPote,
  PRECO_POTE_DE_GORJETAS,
  type GanhosDaNoite,
  type Progresso,
} from "../game/jogo.ts";
import { useContagem } from "./Efeitos.tsx";

type Props = {
  numeroDaNoite: number;
  ganhos: GanhosDaNoite;
  progresso: Progresso;
  aoComprarPote: () => void;
  aoAbrirLivro: () => void;
  aoProximaNoite: () => void;
};

export function TelaFimDeDia({
  numeroDaNoite,
  ganhos,
  progresso,
  aoComprarPote,
  aoAbrirLivro,
  aoProximaNoite,
}: Props) {
  const dinheiroContado = useContagem(progresso.dinheiro);

  return (
    <main className="tela">
      <h1 className="titulo">Fim da noite {numeroDaNoite}</h1>

      <section className="painel">
        <dl className="contas">
          <dt>Pagamentos</dt>
          <dd>${ganhos.pagamentos}</dd>
          <dt>Gorjetas</dt>
          <dd>${ganhos.gorjetas}</dd>
          <dt className="total">Dinheiro no caixa</dt>
          <dd className="total">${dinheiroContado}</dd>
        </dl>
      </section>

      <section className="painel">
        <h2>Loja</h2>
        <div className="item-loja">
          <span className="emoji">🫙</span>
          <div className="item-loja-texto">
            <strong>Pote de Gorjetas</strong>
            <span>Dobra a gorjeta a partir da próxima noite.</span>
          </div>
          {progresso.temPoteDeGorjetas ? (
            <span className="comprado">✔ Comprado</span>
          ) : (
            <button
              className="botao-secundario"
              disabled={!podeComprarPote(progresso)}
              onClick={aoComprarPote}
            >
              Comprar por ${PRECO_POTE_DE_GORJETAS}
            </button>
          )}
        </div>
      </section>

      <div className="acoes">
        <button className="botao-secundario" onClick={aoAbrirLivro}>
          📖 Livro de Manias
        </button>
        <button className="botao-principal" onClick={aoProximaNoite}>
          Próxima noite
        </button>
      </div>
    </main>
  );
}

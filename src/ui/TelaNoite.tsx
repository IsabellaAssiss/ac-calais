import { useState } from "react";
import { IDS_INGREDIENTES, INGREDIENTES, MONSTROS, type Ingrediente } from "../game/conteudo.ts";
import {
  clienteAtual,
  ganhosDaNoite,
  TAMANHO_DO_LANCHE,
  type Atendimento,
  type Cliente,
  type Noite,
} from "../game/jogo.ts";
import { RetratoMonstro } from "./RetratoMonstro.tsx";

type Props = {
  noite: Noite;
  aoServir: (lanche: Ingrediente[]) => void;
  aoSeguir: () => void;
  aoAbrirLivro: () => void;
};

export function TelaNoite({ noite, aoServir, aoSeguir, aoAbrirLivro }: Props) {
  const [reacaoVisivel, setReacaoVisivel] = useState(false);
  const { pagamentos, gorjetas } = ganhosDaNoite(noite);
  const atendimento = noite.atendimentos.at(-1);
  const total = noite.clientes.length;
  const posicao = reacaoVisivel ? noite.atendimentos.length : noite.atendimentos.length + 1;

  return (
    <main className="tela">
      <header className="placar">
        <strong>Noite {noite.numero}</strong>
        <span>
          Cliente {posicao} de {total}
        </span>
        <span>Ganhos: ${pagamentos + gorjetas}</span>
        <button className="botao-secundario" onClick={aoAbrirLivro}>
          📖 Livro
        </button>
      </header>

      {reacaoVisivel && atendimento ? (
        <Reacao
          atendimento={atendimento}
          aoContinuar={() => {
            setReacaoVisivel(false);
            aoSeguir();
          }}
        />
      ) : (
        <Montagem
          key={noite.atendimentos.length}
          cliente={clienteAtual(noite)!}
          aoServir={(lanche) => {
            aoServir(lanche);
            setReacaoVisivel(true);
          }}
        />
      )}
    </main>
  );
}

function Montagem({
  cliente,
  aoServir,
}: {
  cliente: Cliente;
  aoServir: (lanche: Ingrediente[]) => void;
}) {
  const [lanche, setLanche] = useState<Ingrediente[]>([]);
  const cheio = lanche.length === TAMANHO_DO_LANCHE;

  return (
    <>
      <section className="balcao">
        <div className="retrato">
          <RetratoMonstro monstro={cliente.monstro} />
          <span className="nome-monstro">{MONSTROS[cliente.monstro].nome}</span>
        </div>
        <div className="comanda">
          <h2>Comanda</h2>
          <ul>
            {cliente.comanda.itensFixos.map((item) => (
              <li key={item}>
                {INGREDIENTES[item].emoji} {INGREDIENTES[item].nome}
              </li>
            ))}
            <li className="escolha-da-casa">✨ 2 à escolha da casa</li>
          </ul>
        </div>
      </section>

      <section className="lanche" aria-label="Lanche">
        {Array.from({ length: TAMANHO_DO_LANCHE }, (_, i) => {
          const item = lanche[i];
          return item ? (
            <button
              key={i}
              className="espaco ocupado"
              title={`Remover ${INGREDIENTES[item].nome}`}
              onClick={() => setLanche(lanche.filter((_, p) => p !== i))}
            >
              <span className="emoji">{INGREDIENTES[item].emoji}</span>
              {INGREDIENTES[item].nome}
            </button>
          ) : (
            <div key={i} className="espaco vazio" />
          );
        })}
      </section>

      <section className="estacao" aria-label="Ingredientes">
        {IDS_INGREDIENTES.map((id) => (
          <button
            key={id}
            className="ingrediente"
            disabled={cheio}
            onClick={() => setLanche([...lanche, id])}
          >
            <span className="emoji">{INGREDIENTES[id].emoji}</span>
            {INGREDIENTES[id].nome}
          </button>
        ))}
      </section>

      <button className="botao-principal" disabled={!cheio} onClick={() => aoServir(lanche)}>
        Servir
      </button>
    </>
  );
}

function Reacao({
  atendimento,
  aoContinuar,
}: {
  atendimento: Atendimento;
  aoContinuar: () => void;
}) {
  const { cliente, resultado, pagamento, gorjeta, novaAnotacao } = atendimento;
  const monstro = MONSTROS[cliente.monstro];
  const fala = {
    desastre: monstro.falaDesastre,
    pedidoErrado: "Não foi isso que eu pedi! Leia a comanda!",
    maniaNaoAtendida: monstro.falaMania,
    perfeito: monstro.falaPerfeito,
  }[resultado];

  return (
    <section className={`reacao reacao-${resultado}`}>
      <div className="retrato">
        <RetratoMonstro monstro={cliente.monstro} />
        <span className="nome-monstro">{monstro.nome}</span>
      </div>
      <p className="fala">{fala}</p>
      <p className="valores">
        {pagamento === 0 ? "Não pagou nada!" : `Pagou $${pagamento}`}
        {gorjeta > 0 && ` + $${gorjeta} de gorjeta`}
      </p>
      {novaAnotacao && <p className="nova-anotacao">📖 Nova anotação no Livro!</p>}
      <button className="botao-principal" onClick={aoContinuar}>
        Continuar
      </button>
    </section>
  );
}

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
import { EfeitosDaTela, Monstro, NovaAnotacao, Rachadura } from "./Efeitos.tsx";

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
  const tremendo = reacaoVisivel && atendimento?.resultado === "desastre";

  return (
    <main className={tremendo ? "tela-noite tremendo" : "tela-noite"}>
      <header className="placar">
        <strong className="placar-noite">Noite {noite.numero}</strong>
        <span>
          Cliente {posicao} de {total}
        </span>
        <span className="placar-ganhos">🪙 ${pagamentos + gorjetas}</span>
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
      <section className="cena">
        <Monstro monstro={cliente.monstro} nome={MONSTROS[cliente.monstro].nome} />

        <div className="balao comanda">
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

        <section className="pilha" aria-label="Lanche">
          <p className="pilha-dica">
            {lanche.length === 0 ? "Monte o lanche" : "Clique numa camada para tirar"}
          </p>
          <div className="pilha-camadas">
            {Array.from({ length: TAMANHO_DO_LANCHE }, (_, i) => {
              const ingrediente = lanche[i];
              return ingrediente ? (
                <button
                  key={i}
                  className={`camada camada-${ingrediente}`}
                  title={`Remover ${INGREDIENTES[ingrediente].nome}`}
                  onClick={() => setLanche(lanche.filter((_, p) => p !== i))}
                >
                  {INGREDIENTES[ingrediente].emoji} {INGREDIENTES[ingrediente].nome}
                </button>
              ) : (
                <div key={i} className="camada camada-vazia" />
              );
            })}
          </div>
          <div className="prato" />
        </section>
      </section>

      <section className="balcao">
        <div className="estacao" aria-label="Ingredientes">
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
        </div>
        <button className="botao-principal" disabled={!cheio} onClick={() => aoServir(lanche)}>
          Servir
        </button>
      </section>
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
    <>
      <section className="cena">
        <Monstro monstro={cliente.monstro} nome={monstro.nome} resultado={resultado} />
        <div className={`balao balao-${resultado}`}>
          <p className="fala">{fala}</p>
        </div>
        <div className="canto-da-cena">{novaAnotacao && <NovaAnotacao />}</div>
      </section>

      <section className="balcao balcao-reacao">
        {resultado === "desastre" && cliente.monstro === "lobisomem" && <Rachadura />}
        <p className="valores">
          {pagamento === 0 ? "Não pagou nada!" : `Pagou $${pagamento}`}
          {gorjeta > 0 && ` + $${gorjeta} de gorjeta`}
        </p>
        <button className="botao-principal" onClick={aoContinuar}>
          Continuar
        </button>
      </section>

      <EfeitosDaTela resultado={resultado} />
    </>
  );
}

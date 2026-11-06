import { useState } from "react";
import { IDS_INGREDIENTES, INGREDIENTES, MONSTROS, type Ingrediente } from "../game/conteudo.ts";
import {
  clienteAtual,
  ganhosDaNoite,
  GORJETA,
  TAMANHO_DO_LANCHE,
  type Atendimento,
  type Cliente,
  type Noite,
} from "../game/jogo.ts";
import { EfeitosDaTela, Monstro, NovaAnotacao, Rachadura } from "./Efeitos.tsx";
import { ImagemIngrediente } from "./ImagemIngrediente.tsx";
import { notasDoLanche, type Notas } from "./notas.ts";

type Props = {
  noite: Noite;
  aoServir: (lanche: Ingrediente[]) => void;
  aoSeguir: () => void;
  aoAbrirLivro: () => void;
};

export function TelaNoite({ noite, aoServir, aoSeguir, aoAbrirLivro }: Props) {
  const [reacaoVisivel, setReacaoVisivel] = useState(false);
  const [ultimoLanche, setUltimoLanche] = useState<Ingrediente[]>([]);
  const [pausado, setPausado] = useState(false);
  const { pagamentos, gorjetas } = ganhosDaNoite(noite);
  const atendimento = noite.atendimentos.at(-1);
  const posicao = reacaoVisivel ? noite.atendimentos.length : noite.atendimentos.length + 1;
  const tremendo = reacaoVisivel && atendimento?.resultado === "desastre";
  const classes = ["tela-noite", tremendo && "tremendo", pausado && "pausada"];

  return (
    <main className={classes.filter(Boolean).join(" ")}>
      <header className="hud">
        <div className="hud-lado">
          <button className="botao-hud" aria-label="Pausar" onClick={() => setPausado(true)}>
            ⏸
          </button>
          <strong className="hud-noite">Noite {noite.numero}</strong>
        </div>
        <TrilhoDeComandas total={noite.clientes.length} atual={posicao} />
        <div className="hud-lado hud-direita">
          <span className="hud-dinheiro">💰 ${pagamentos + gorjetas}</span>
          <button className="botao-hud" aria-label="Abrir o Livro de Manias" onClick={aoAbrirLivro}>
            📖
          </button>
        </div>
      </header>

      <div className="cena" />
      <PoteDeGorjetas moedas={gorjetas / GORJETA} />

      {reacaoVisivel && atendimento ? (
        <Reacao
          atendimento={atendimento}
          notas={notasDoLanche(atendimento.cliente, ultimoLanche)}
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
            setUltimoLanche(lanche);
            aoServir(lanche);
            setReacaoVisivel(true);
          }}
        />
      )}

      {pausado && (
        <div className="pausa">
          <h2>Pausado</h2>
          <button className="botao-principal" autoFocus onClick={() => setPausado(false)}>
            Continuar
          </button>
        </div>
      )}
    </main>
  );
}

function TrilhoDeComandas({ total, atual }: { total: number; atual: number }) {
  return (
    <div className="trilho" role="img" aria-label={`Cliente ${atual} de ${total}`}>
      {Array.from({ length: total }, (_, i) => {
        const numero = i + 1;
        const estado = numero === atual ? "atual" : numero < atual ? "feita" : "futura";
        return (
          <span key={numero} className={`comandinha comandinha-${estado}`}>
            {numero}
          </span>
        );
      })}
    </div>
  );
}

function PoteDeGorjetas({ moedas }: { moedas: number }) {
  return (
    <div className="pote-gorjetas" aria-label={`Gorjetas: ${moedas} moedas`} role="img">
      <div className="pote-moedas">
        {Array.from({ length: Math.min(moedas, 12) }, (_, i) => (
          <span key={i} className="moeda-do-pote" />
        ))}
      </div>
      <span className="pote-rotulo">Gorjetas</span>
    </div>
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
      <Monstro monstro={cliente.monstro} />

      <section className="balcao">
        <span className="placa-nome">{MONSTROS[cliente.monstro].nome}</span>
        <button className="botao-principal botao-servir" disabled={!cheio} onClick={() => aoServir(lanche)}>
          Servir
        </button>
        <div className="estacao" aria-label="Ingredientes">
          {IDS_INGREDIENTES.map((id) => (
            <button
              key={id}
              className="ingrediente"
              disabled={cheio}
              onClick={() => setLanche([...lanche, id])}
            >
              <ImagemIngrediente ingrediente={id} />
              <span className="ingrediente-nome">{INGREDIENTES[id].nome}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="bandeja" aria-label="Lanche">
        <p className="bandeja-dica">
          {lanche.length === 0 ? "Monte o lanche" : "Clique para tirar"}
        </p>
        <div className="pilha">
          {Array.from({ length: TAMANHO_DO_LANCHE }, (_, i) => {
            const ingrediente = lanche[i];
            return ingrediente ? (
              <button
                key={i}
                className="camada"
                title={`Remover ${INGREDIENTES[ingrediente].nome}`}
                aria-label={`Remover ${INGREDIENTES[ingrediente].nome}`}
                onClick={() => setLanche(lanche.filter((_, p) => p !== i))}
              >
                <ImagemIngrediente ingrediente={ingrediente} />
              </button>
            ) : (
              <div key={i} className="camada camada-vazia" />
            );
          })}
        </div>
        <div className="prato" />
      </section>

      <div className="comanda">
        <h2>Comanda</h2>
        <ul>
          {cliente.comanda.itensFixos.map((item) => (
            <li key={item}>
              <ImagemIngrediente ingrediente={item} /> {INGREDIENTES[item].nome}
            </li>
          ))}
          <li className="escolha-da-casa">✨ 2 à escolha da casa</li>
        </ul>
      </div>
    </>
  );
}

function Reacao({
  atendimento,
  notas,
  aoContinuar,
}: {
  atendimento: Atendimento;
  notas: Notas;
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
      <Monstro monstro={cliente.monstro} resultado={resultado} />

      <section className={`balao-resultado balao-${resultado}`}>
        <strong className="balao-dinheiro">${pagamento + gorjeta}!</strong>
        <p className="fala">{fala}</p>
        <p className="valores">
          {pagamento === 0 ? "Não pagou nada!" : `Pagou $${pagamento}`}
          {gorjeta > 0 && ` + $${gorjeta} de gorjeta`}
        </p>
        <span className="balao-nome">{monstro.nome}</span>
      </section>

      {novaAnotacao && <NovaAnotacao />}

      <section className="balcao balcao-reacao">
        {resultado === "desastre" && cliente.monstro === "lobisomem" && <Rachadura />}
        <div className="criterios">
          <Criterio nome="Pedido" cor="verde" ok={notas.pedido} />
          <Criterio nome="Regras" cor="laranja" ok={notas.regras} />
          <Criterio nome="Mania" cor="azul" ok={notas.mania} />
        </div>
        <button className="botao-principal botao-continuar" onClick={aoContinuar}>
          Continuar
        </button>
      </section>

      <EfeitosDaTela resultado={resultado} />
    </>
  );
}

function Criterio({ nome, cor, ok }: { nome: string; cor: string; ok: boolean }) {
  return (
    <div className={`criterio criterio-${cor} ${ok ? "criterio-ok" : "criterio-zero"}`}>
      <strong>{ok ? "100%" : "0%"}</strong>
      <span>{nome}</span>
    </div>
  );
}

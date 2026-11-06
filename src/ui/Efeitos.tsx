import { useEffect, useState, type CSSProperties } from "react";
import type { MonstroId } from "../game/conteudo.ts";
import type { Resultado } from "../game/jogo.ts";
import { RetratoMonstro } from "./RetratoMonstro.tsx";

function variaveis(valores: Record<string, string>) {
  return valores as CSSProperties;
}

const FAISCAS = Array.from({ length: 20 }, (_, i) => {
  const angulo = (i / 20) * 2 * Math.PI;
  const distancia = 170 + ((i * 53) % 260);
  return {
    emoji: i % 2 === 0 ? "💥" : "🔥",
    estilo: variaveis({
      "--dx": `${Math.round(Math.cos(angulo) * distancia)}px`,
      "--dy": `${Math.round(Math.sin(angulo) * distancia)}px`,
      "--atraso": `${(i % 4) * 0.05}s`,
      "--tamanho": `${2 + (i % 3)}rem`,
    }),
  };
});

const MOEDAS = Array.from({ length: 28 }, (_, i) => ({
  estilo: variaveis({
    "--x": `${(i * 37) % 100}%`,
    "--atraso": `${((i * 7) % 12) * 0.12}s`,
    "--duracao": `${1.3 + (i % 4) * 0.25}s`,
    "--tamanho": `${1.6 + (i % 3) * 0.6}rem`,
  }),
}));

const BRILHOS = Array.from({ length: 6 }, (_, i) => {
  const angulo = (i / 6) * 2 * Math.PI;
  return {
    estilo: variaveis({
      "--dx": `${Math.round(Math.cos(angulo) * 80)}px`,
      "--dy": `${Math.round(Math.sin(angulo) * 70)}px`,
      "--atraso": `${0.5 + (i % 3) * 0.2}s`,
    }),
  };
});

/** Efeitos que tomam a tela inteira e não recebem cliques. */
export function EfeitosDaTela({ resultado }: { resultado: Resultado }) {
  if (resultado === "desastre") {
    return (
      <div className="efeitos efeitos-desastre" aria-hidden="true">
        {FAISCAS.map(({ emoji, estilo }, i) => (
          <span key={i} className="faisca" style={estilo}>
            {emoji}
          </span>
        ))}
      </div>
    );
  }
  if (resultado === "perfeito") {
    return (
      <div className="efeitos" aria-hidden="true">
        {MOEDAS.map(({ estilo }, i) => (
          <span key={i} className="moeda" style={estilo}>
            🪙
          </span>
        ))}
      </div>
    );
  }
  return null;
}

function DesastreDoMonstro({ monstro }: { monstro: MonstroId }) {
  switch (monstro) {
    case "dracula":
      return (
        <>
          <span className="fumaca">💨</span>
          <span className="morcego">🦇</span>
        </>
      );
    case "lobisomem":
      return <span className="uivo">AUUUU!</span>;
    case "mumia":
      return (
        <svg className="faixas" viewBox="0 0 200 200">
          <path pathLength="1" d="M100 70 C 40 60, 60 130, 10 110 S 0 180, 30 195" />
          <path pathLength="1" d="M100 90 C 160 70, 140 140, 190 120 S 200 180, 170 195" />
          <path pathLength="1" d="M100 110 C 70 140, 130 150, 95 175 S 110 190, 100 198" />
        </svg>
      );
    case "zumbi":
      return <span className="braco">💪</span>;
    case "fantasma":
      return null;
  }
}

function Reclamacao({ cara, texto }: { cara: string; texto: string }) {
  return (
    <>
      <span className="cara-feia">{cara}</span>
      <span className="nuvem-reclamacao">{texto}</span>
    </>
  );
}

/** Sem `resultado`, o monstro está esperando no balcão. */
export function Monstro({
  monstro,
  nome,
  resultado,
}: {
  monstro: MonstroId;
  nome: string;
  resultado?: Resultado;
}) {
  return (
    <div className={`monstro monstro-${monstro} monstro-${resultado ?? "chegando"}`}>
      <span className="nome-monstro">{nome}</span>
      <div className="monstro-corpo">
        <RetratoMonstro monstro={monstro} humor={resultado === "perfeito" ? "feliz" : resultado ? "bravo" : "normal"} />
      </div>
      <div aria-hidden="true">
        {resultado === "desastre" && <DesastreDoMonstro monstro={monstro} />}
        {resultado === "maniaNaoAtendida" && <Reclamacao cara="😒" texto="#@$%!" />}
        {resultado === "pedidoErrado" && <Reclamacao cara="🤨" texto="???" />}
      </div>
    </div>
  );
}

export function Rachadura() {
  return (
    <svg className="rachadura" viewBox="0 0 300 100" preserveAspectRatio="none" aria-hidden="true">
      <path pathLength="1" d="M120 0 L135 22 L112 40 L142 62 L125 80 L140 100" />
      <path pathLength="1" d="M112 40 L80 52 L62 80" />
      <path pathLength="1" d="M142 62 L180 58 L205 86" />
    </svg>
  );
}

export function NovaAnotacao() {
  return (
    <p className="nova-anotacao">
      <span className="livrinho" aria-hidden="true">
        <span className="livrinho-pagina livrinho-direita" />
        <span className="livrinho-pagina livrinho-esquerda" />
        {BRILHOS.map(({ estilo }, i) => (
          <span key={i} className="brilho" style={estilo}>
            ✨
          </span>
        ))}
      </span>
      Nova anotação no Livro!
    </p>
  );
}

/** Sobe de 0 até `alvo` uma vez; se o alvo mudar depois disso, acompanha na hora. */
export function useContagem(alvo: number, duracaoEmMs = 1500) {
  const [andamento, setAndamento] = useState(() =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 1 : 0,
  );

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let quadro: number;
    const inicio = performance.now();
    const avancar = (agora: number) => {
      const novo = Math.min((agora - inicio) / duracaoEmMs, 1);
      setAndamento(novo);
      if (novo < 1) quadro = requestAnimationFrame(avancar);
    };
    quadro = requestAnimationFrame(avancar);
    return () => cancelAnimationFrame(quadro);
  }, [duracaoEmMs]);

  const suavizado = 1 - (1 - andamento) ** 3;
  return Math.round(alvo * suavizado);
}

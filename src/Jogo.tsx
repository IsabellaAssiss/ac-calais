import { useState } from "react";
import {
  comprarPote,
  encerrarNoite,
  iniciarNoite,
  noiteTerminou,
  seguirParaProximaNoite,
  servir,
  type Noite,
  type Progresso,
} from "./game/jogo.ts";
import type { Ingrediente } from "./game/conteudo.ts";
import { LivroDeManias } from "./ui/LivroDeManias.tsx";
import { TelaFimDeDia } from "./ui/TelaFimDeDia.tsx";
import { TelaNoite } from "./ui/TelaNoite.tsx";

type Props = {
  progressoSalvo: Progresso;
  salvar: (progresso: Progresso) => void;
  aoSair: () => void;
};

/** O jogo não salva no meio da noite, então fechá-lo nesse momento recomeça aquela noite. */
export function Jogo({ progressoSalvo, salvar, aoSair }: Props) {
  const [progresso, setProgresso] = useState(progressoSalvo);
  const [noite, setNoite] = useState<Noite>(() => iniciarNoite(progressoSalvo));
  const [livroAberto, setLivroAberto] = useState(false);

  function atualizarESalvar(novo: Progresso) {
    setProgresso(novo);
    salvar(novo);
  }

  function aoServir(lanche: Ingrediente[]) {
    setNoite(servir(noite, lanche));
  }

  function aoSeguir() {
    if (noiteTerminou(noite)) {
      atualizarESalvar(encerrarNoite(progresso, noite));
    }
  }

  function aoProximaNoite() {
    const seguinte = seguirParaProximaNoite(progresso);
    atualizarESalvar(seguinte);
    setNoite(iniciarNoite(seguinte));
  }

  const abrirLivro = () => setLivroAberto(true);

  return (
    <>
      {progresso.fimDeDiaPendente ? (
        <TelaFimDeDia
          numeroDaNoite={progresso.noite - 1}
          ganhos={progresso.fimDeDiaPendente}
          progresso={progresso}
          aoComprarPote={() => atualizarESalvar(comprarPote(progresso))}
          aoAbrirLivro={abrirLivro}
          aoProximaNoite={aoProximaNoite}
        />
      ) : (
        <TelaNoite
          noite={noite}
          aoServir={aoServir}
          aoSeguir={aoSeguir}
          aoAbrirLivro={abrirLivro}
          aoSair={aoSair}
        />
      )}
      {livroAberto && <LivroDeManias livro={noite.livro} aoFechar={() => setLivroAberto(false)} />}
    </>
  );
}

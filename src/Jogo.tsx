import { useState } from "react";
import {
  comprarPote,
  encerrarNoite,
  iniciarNoite,
  noiteTerminou,
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

/** O jogo só salva ao fim da noite, então fechá-lo no meio recomeça aquela noite. */
export function Jogo({ progressoSalvo, salvar, aoSair }: Props) {
  const [progresso, setProgresso] = useState(progressoSalvo);
  const [noite, setNoite] = useState<Noite>(() => iniciarNoite(progressoSalvo));
  const [fimDeDia, setFimDeDia] = useState(false);
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
      setFimDeDia(true);
    }
  }

  function aoProximaNoite() {
    setNoite(iniciarNoite(progresso));
    setFimDeDia(false);
  }

  const abrirLivro = () => setLivroAberto(true);

  return (
    <>
      {fimDeDia ? (
        <TelaFimDeDia
          noite={noite}
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

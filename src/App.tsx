import { useState } from "react";
import {
  comprarPote,
  encerrarNoite,
  iniciarNoite,
  noiteTerminou,
  progressoInicial,
  servir,
  type Noite,
  type Progresso,
} from "./game/jogo.ts";
import type { Ingrediente } from "./game/conteudo.ts";
import { LivroDeManias } from "./ui/LivroDeManias.tsx";
import { TelaFimDeDia } from "./ui/TelaFimDeDia.tsx";
import { TelaNoite } from "./ui/TelaNoite.tsx";

export function App() {
  const [progresso, setProgresso] = useState<Progresso>(progressoInicial);
  const [noite, setNoite] = useState<Noite>(() => iniciarNoite(progresso));
  const [fimDeDia, setFimDeDia] = useState(false);
  const [livroAberto, setLivroAberto] = useState(false);

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

  const abrirLivro = () => setLivroAberto(true);

  return (
    <>
      {fimDeDia ? (
        <TelaFimDeDia
          noite={noite}
          progresso={progresso}
          aoComprarPote={() => setProgresso(comprarPote(progresso))}
          aoAbrirLivro={abrirLivro}
          aoProximaNoite={aoProximaNoite}
        />
      ) : (
        <TelaNoite noite={noite} aoServir={aoServir} aoSeguir={aoSeguir} aoAbrirLivro={abrirLivro} />
      )}
      {livroAberto && <LivroDeManias livro={noite.livro} aoFechar={() => setLivroAberto(false)} />}
    </>
  );
}

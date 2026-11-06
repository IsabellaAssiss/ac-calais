import { useEffect } from "react";
import { IDS_MONSTROS, MONSTROS } from "../game/conteudo.ts";
import type { Livro } from "../game/jogo.ts";
import { RetratoMonstro } from "./RetratoMonstro.tsx";

export function LivroDeManias({ livro, aoFechar }: { livro: Livro; aoFechar: () => void }) {
  useEffect(() => {
    const aoTeclar = (evento: KeyboardEvent) => {
      if (evento.key === "Escape") aoFechar();
    };
    window.addEventListener("keydown", aoTeclar);
    return () => window.removeEventListener("keydown", aoTeclar);
  }, [aoFechar]);

  return (
    <div className="livro-fundo" onClick={aoFechar}>
      <section
        className="livro"
        role="dialog"
        aria-modal="true"
        aria-label="Livro de Manias"
        onClick={(evento) => evento.stopPropagation()}
      >
        <h2>📖 Livro de Manias</h2>
        <div className="livro-paginas">
          {IDS_MONSTROS.map((id) => (
            <article key={id} className="livro-pagina">
              <div className="retrato retrato-pequeno">
                <RetratoMonstro monstro={id} />
                <span className="nome-monstro">{MONSTROS[id].nome}</span>
              </div>
              <p>
                <strong>Regra:</strong> {livro[id].regra ? MONSTROS[id].anotacaoRegra : "???"}
              </p>
              <p>
                <strong>Mania:</strong> {livro[id].mania ? MONSTROS[id].anotacaoMania : "???"}
              </p>
            </article>
          ))}
        </div>
        <button className="botao-principal" autoFocus onClick={aoFechar}>
          Fechar
        </button>
      </section>
    </div>
  );
}

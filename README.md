# Monster Munchies

Jogo web por cliques: você atende monstros numa lanchonete e descobre, errando, as regras de cada um. O jogo não avisa nada. O que você aprende fica anotado no Livro de Manias.

São cinco monstros: Vampira, Lobisomem, Múmia, Zumbi e Fantasma. Cada noite tem 5 clientes: 4 monstros sorteados, e um deles volta uma segunda vez.

## Como rodar

Requer Node 24 ou superior.

```bash
npm install
npm start
```

Abra <http://localhost:3001> e crie uma conta. Cada conta nova começa do zero.

O progresso é salvo ao fim de cada noite em `data/monster-munchies.db`. Fechar o jogo no meio de uma noite recomeça aquela noite.

## Desenvolvimento

```bash
npm run dev:server   # API em http://localhost:3001
npm run dev          # jogo com recarregamento automático, em outro terminal
npm test
npm run build
```

## Documentação

- `docs/roteiro-demo.md`: roteiro da apresentação, com as respostas do jogo
- `GLOSSARY.md`: vocabulário do jogo
- `docs/adr/`: decisões de arquitetura
- `docs/c4/`: diagramas C4, gerados depois do MVP
- `docs/diario.md`: diário de bordo
- `docs/resumo-da-noite.md`: resumo do incremento e comparação com o MVP
- `docs/pendencias.md`: o que ficou em aberto

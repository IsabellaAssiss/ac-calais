# Monster Munchies

Jogo web por cliques: você atende monstros numa lanchonete e descobre, errando, as regras de cada um. O jogo não avisa nada. O que você aprende fica anotado no Livro de Manias.

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

- `GLOSSARY.md`: vocabulário do jogo
- `docs/adr/`: decisões de arquitetura

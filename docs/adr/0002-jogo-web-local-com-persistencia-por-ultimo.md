# Jogo web local, com persistência em banco por último

O jogo será apresentado no dia seguinte ao início do projeto, então priorizamos o que aparece na tela. Decidimos usar Vite + React + TypeScript, com HTML e CSS em vez de um motor de jogo, e salvar primeiro no `localStorage`. Login e banco (Express + SQLite) são a última etapa e rodam na máquina da apresentação, sem depender de internet nem de contas externas. Se o tempo acabar, o jogo é apresentado com `localStorage`.

## Considered Options

- **Supabase + deploy na Vercel:** daria uma URL pública e autenticação pronta, mas depende de internet na apresentação e exige criar e configurar contas na véspera.
- **Motor de jogo (Phaser):** rejeitado porque o jogo é só cliques e telas, sem física nem animação contínua.

## Consequences

Quando o login está ativo, ele é a primeira tela e o save passa a ficar no banco, sem migrar o que estava no `localStorage`. O jogo só salva ao fim da noite, então fechá-lo no meio recomeça aquela noite.

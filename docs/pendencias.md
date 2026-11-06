# Pendências

## Falta fazer

- **Issue #10:** botão Recomeçar nas telas de pausa e de fim de dia. Ainda não foi implementado. Quando ele ficar pronto, a spec #8 pode ser fechada.

## Para você decidir

- **Sorteio de 4 dos 5 monstros:** você pediu que o Fantasma entrasse no sorteio, e, para manter os 5 clientes, cada noite passou a deixar um monstro de fora. A decisão está no ADR-0003 e precisa da sua confirmação.
- **Issue #5:** sessões do servidor nunca expiram. O impacto é baixo enquanto o jogo roda só na máquina local.

## Não verificado

- `npm run dev` junto com `npm run dev:server` não foi testado com o login.
- As telas não têm teste automatizado. Foram conferidas no Chrome com scripts fora do repositório.

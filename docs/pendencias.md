# Pendências

## Para você decidir

- **Sorteio de 4 dos 5 monstros:** você pediu que o Fantasma entrasse no sorteio, e, para manter os 5 clientes, cada noite passou a deixar um monstro de fora. A decisão está no ADR-0003 e precisa da sua confirmação.
- **Issue #1:** recarregar a página na tela de fim de dia pula a loja daquela noite. Corrigir exige mudar o formato do save.
- **Issue #5:** sessões do servidor nunca expiram. O impacto é baixo enquanto o jogo roda só na máquina local.

## Para você preencher

- Campos "O que fiz à mão" e "Print" em `docs/diario.md`.
- `docs/prints/` continua vazia.

## Não verificado

- `npm run dev` junto com `npm run dev:server` não foi testado com o login. O caminho da apresentação, `npm start`, foi testado antes do Fantasma; depois dele, o jogo foi testado com o mesmo servidor em um banco temporário.
- As telas não têm teste automatizado. Foram conferidas no Chrome com scripts fora do repositório.

## Skills `to-spec` e `to-tickets` não foram usadas no incremento Fantasma

As duas skills estão configuradas com `disable-model-invocation`, então o agente não pode invocá-las, e o erro retornado pede para não reproduzir o fluxo delas por outros meios:

> Skill to-spec cannot be used with Skill tool due to disable-model-invocation. Ask the user to run /to-spec themselves — it cannot be invoked via the Skill tool. Do not replicate this skill's workflow by other means — it is reserved for explicit user invocation.

**Consequência:** os passos 3a e 3b do pedido não foram feitos. Não existe spec nem tickets gerados por essas skills. O trabalho foi acompanhado por uma única issue comum, sem quebra em tickets, e os requisitos estão em `docs/adr/0003-fantasma-e-sorteio-de-quatro-monstros.md`.

**O que depende de você:** rodar `/to-spec` e `/to-tickets` você mesma. Como o Fantasma já foi implementado, fazer isso agora só registraria o processo depois do fato, então serviria melhor num próximo incremento.

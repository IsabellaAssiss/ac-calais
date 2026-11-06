# Pendências

## Skills `to-spec` e `to-tickets` não foram usadas no incremento Fantasma

As duas skills estão configuradas com `disable-model-invocation`, então o agente não pode invocá-las, e o erro retornado pede para não reproduzir o fluxo delas por outros meios:

> Skill to-spec cannot be used with Skill tool due to disable-model-invocation. Ask the user to run /to-spec themselves — it cannot be invoked via the Skill tool. Do not replicate this skill's workflow by other means — it is reserved for explicit user invocation.

**Consequência:** os passos 3a e 3b do pedido não foram feitos. Não existe spec nem tickets gerados por essas skills. O trabalho foi acompanhado por uma única issue comum, sem quebra em tickets, e os requisitos estão em `docs/adr/0003-fantasma-e-sorteio-de-quatro-monstros.md`.

**O que depende de você:** rodar `/to-spec` e `/to-tickets` você mesma. Como o Fantasma já foi implementado, fazer isso agora só registraria o processo depois do fato, então serviria melhor num próximo incremento.

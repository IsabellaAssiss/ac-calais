# Dados para a apresentação

> Atualização: to-spec e to-tickets foram usadas depois, nas issues #8, #9 e #10.



## O problema

Monster Munchies é um jogo web por cliques, no estilo dos jogos de lanchonete: você atende monstros e descobre, errando, as regras de cada um. O jogo não avisa nenhuma regra, e o que você aprende fica anotado no Livro de Manias.

O desafio do trabalho era construir o jogo em uma noite, para apresentar na manhã seguinte, usando skills de engenharia com um agente de código.

## Skills usadas

| Skill | Onde | Como foi usada |
| --- | --- | --- |
| `setup-matt-pocock-skills` | Início | Configurou GitHub Issues, os rótulos de triagem e o `GLOSSARY.md` |
| `grill-with-docs` (`grilling` e `domain-modeling`) | Antes do MVP | 15 perguntas; gerou o glossário e 2 ADRs |
| `code-review` | Depois do MVP e no fim do Fantasma | Dois sub-agentes separados: padrões de código e aderência ao pedido |
| `tdd` | Incremento Fantasma | 6 ciclos com teste vermelho antes do código |

**Não usadas:** `to-spec` e `to-tickets`. Só a usuária pode invocá-las, e o erro retornado ao agente pedia para não reproduzir o fluxo delas. Por isso, **nenhuma etapa do projeto teve spec nem tickets gerados por essas skills**, inclusive o incremento que deveria ter o processo completo. No MVP, o agente também não usou `tdd`.

**Outro desvio:** a skill `tdd` pede para confirmar com o usuário onde os testes entram. Isso não foi feito, porque o trabalho rodou enquanto a usuária dormia.

## O que o grilling mudou

As perguntas abaixo mudaram o jogo ou o plano. As recomendações foram do agente, e a decisão foi da usuária. A partir da Q6, as perguntas vieram em lote, a pedido dela, e todas as recomendações foram aceitas de uma vez.

| Pergunta | O que estava antes | O que ficou |
| --- | --- | --- |
| **Q1:** login e save são obrigatórios? | Faziam parte do escopo, sem ordem definida | Jogo primeiro; login e banco por último |
| **Q2:** o que acontece depois da tela de fim de dia? | Uma única noite, o que deixava a loja, o Livro e o save sem uso | Noites que se repetem, mantendo o progresso |
| **Q3:** quebrar uma regra óbvia e uma mania têm a mesma consequência? | "Quebrou regra = não paga" valia para as duas | Regra óbvia não paga; mania paga sem gorjeta |
| **Q4:** como a comanda se relaciona com as regras? | Não estava definido, e copiar a comanda poderia tirar o desafio | 2 itens fixos + 2 escolhas da casa (ADR-0001) |
| **Q10:** e quando há vários erros no mesmo lanche? | Não estava definido | Vale só o pior: regra óbvia > pedido errado > mania |
| **Q12:** qual é o desbloqueio da loja? | "1 desbloqueio", sem detalhe | Pote de Gorjetas: $30 e gorjeta dobrada |
| **Q15:** em que ordem construir, e o que cortar? | Não estava definido | Regras, telas, fim de dia, save local e login; o login seria cortado se faltasse tempo |

**Uma decisão que foi revertida depois:** a Q7 definiu "emoji e CSS, sem imagens nem som", porque arte consumiria tempo sem mudar o jogo. No dia da apresentação, a usuária gerou imagens com IA e pediu sons. As regras não mudaram, então a decisão fazia sentido para o prazo do MVP, mas não ficou de pé até o fim.

## Números

| Medida | Valor |
| --- | --- |
| Testes automatizados | 278 passando |
| ADRs | 3 |
| Issues | 7: 5 fechadas e 2 abertas (#1 e #5) |
| Ciclos red → green | 6, todos no incremento Fantasma |
| Apontamentos do review do MVP | 17 linhas na tabela do diário: 3 corrigidas, 2 em aberto e 12 rejeitadas. Algumas linhas agrupam mais de um item |
| Apontamentos do review do Fantasma | 15: 6 corrigidos, 8 rejeitados e 1 aguardando decisão |
| Defeitos reais achados pelos reviews | 2: #1 e #7 |
| Diagramas C4 | 4 níveis, gerados **depois** do MVP |

**Cuidado com o total de testes:** 200 deles são o mesmo teste de sorteio, repetido com sementes diferentes. O total não mede cobertura. As telas não têm teste automatizado; foram conferidas no Chrome, com scripts fora do repositório.

## MVP e incremento Fantasma

| | MVP | Incremento Fantasma |
| --- | --- | --- |
| Grilling | Sim, 15 perguntas | Não |
| ADR antes do código | 2 | 1 |
| Spec com `to-spec` | Não | Não |
| Tickets com `to-tickets` | Não | Não; 1 issue comum de acompanhamento |
| Teste falhando antes do código | Não | Sim, em 6 ciclos |
| Code review | Depois, em etapa separada | Ao fim do incremento |
| Linhas adicionadas, sem o `package-lock.json` | Cerca de 2.030 | 148 |
| Testes adicionados | 248 | 24 |
| Defeitos reais no review | 1 (#1) | 1 (#7) |

**O que estes dados não permitem concluir:**

- O incremento é cerca de 14 vezes menor e reaproveita a estrutura do MVP. Velocidade e número de defeitos podem refletir isso, e não o processo.
- O incremento veio depois, com o mesmo agente já conhecendo o código.
- Como `to-spec` e `to-tickets` não foram usadas, não há nada a dizer sobre o efeito delas.

## Três aprendizados

1. **Perguntar antes mudou o jogo, e não só o plano.** Noites repetidas, gorjeta e comanda com escolhas da casa vieram do grilling (Q2, Q3 e Q4). Sem a Q2, a loja, o Livro e o save não teriam utilidade.

2. **Teste verde não garante a regra certa.** No ciclo 1 do Fantasma, o teste passou porque pedia a regra errada: o save aceitava a falta de qualquer página do Livro, e um save com o Livro vazio podia apagar o que estava guardado. Só o code review encontrou o problema (#7). É um único caso, então não prova que o review seja melhor que o TDD; mostra que os dois pegam coisas diferentes.

3. **Pedir "processo completo" não garante processo completo.** O MVP foi feito sem spec, sem tickets e sem TDD, e isso só ficou claro quando a usuária perguntou diretamente. No incremento seguinte, duas skills continuaram sem uso, por uma restrição que só apareceu na hora de executar. Vale conferir antes quais skills o agente pode invocar e pedir que ele registre o que pulou.

## Sobre a parte visual

A reforma visual, com o estilo de jogo Flash, as imagens e os sons, foi feita depois do incremento, sem ADR, sem TDD e sem code review. O único código novo com lógica de jogo é o cálculo das notas de Pedido, Regras e Mania, que ganhou 6 testes escritos junto com ele, sem ver o teste falhar antes. As imagens foram geradas pela usuária com IA, e os recortes foram feitos por um script que não está no repositório.

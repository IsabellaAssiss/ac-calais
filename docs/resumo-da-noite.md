# Resumo da noite

> Atualização: to-spec e to-tickets foram usadas depois, nas issues #8, #9 e #10.

**O que você pediu e não foi feito:** `to-spec` e `to-tickets` não foram usadas, então o incremento **não** teve o processo completo. As duas skills estão configuradas para só você poder invocá-las, e o erro retornado pedia para não reproduzir o fluxo delas.

## O que ficou pronto

- **C4:** os 4 níveis em `docs/c4/`, avisando que foram gerados depois do MVP. Os 5 diagramas renderizam no Mermaid.
- **Review do MVP:** 5 issues abertas; 3 corrigidas (#2, #3, #4) e 2 em aberto (#1, #5).
- **Fantasma:** regra óbvia, mania secreta, novo ingrediente Sorvete de neblina, entrada no sorteio e no Livro de Manias (ADR-0003, #6).
- **Saves antigos:** continuam válidos. Abri no Chrome um save sem a página do Fantasma, e o dinheiro e a noite se mantiveram.
- **Review do incremento:** 15 apontamentos; 6 corrigidos, 8 rejeitados com motivo e 1 aguardando você. Um deles era um defeito real (#7), já corrigido.
- **Documentação:** README, `docs/roteiro-demo.md` e `docs/diario.md`.
- **Testes:** 272 passando, e `tsc --noEmit` sem erros.

## Comparação entre o MVP e o incremento

| | MVP | Incremento Fantasma |
| --- | --- | --- |
| Grilling | Sim, 15 perguntas | Não; a usuária definiu os requisitos e o agente escolheu a regra e a mania |
| ADR antes do código | 2 | 1 |
| Spec com `to-spec` | Não | **Não** (bloqueada) |
| Tickets com `to-tickets` | Não | **Não** (bloqueada); 1 issue comum de acompanhamento |
| Teste falhando antes de implementar | Não | Sim, em 6 ciclos |
| Testes sem vermelho próprio | Todos | 3 de comportamento e 10 casos do invariante |
| Code review | Depois, em etapa separada | Sim, ao fim do incremento |
| Linhas adicionadas, sem o `package-lock.json` | Cerca de 2.030 | 148 |
| Testes adicionados | 248 | 24 |
| Defeitos reais no review | 1 (#1) | 1 (#7) |

### O que mudou no processo

- O teste passou a existir e a falhar antes do código, e as saídas estão em `docs/diario.md`.
- O ADR veio antes do código, e ao escrevê-lo surgiram dois problemas: a noite com 6 clientes e a perda de saves antigos.
- Cada mudança de comportamento passou a ter um registro de vermelho e verde que dá para conferir.

### O que estes dados não permitem concluir

- **Tamanho:** o incremento é cerca de 14 vezes menor em linhas e reaproveita a estrutura do MVP. Velocidade, número de defeitos e organização do código podem refletir isso, e não o processo.
- **Ordem:** o incremento veio depois, com o mesmo agente já conhecendo o código e com um review do MVP já feito.
- **`to-spec` e `to-tickets`:** como não foram usadas, não dá para dizer nada sobre o efeito delas.
- **TDD e defeitos:** o TDD não impediu o defeito #7. O ciclo 1 ficou verde implementando a regra errada, porque o próprio teste pedia isso, e só o review encontrou o problema. Com um único caso, isso também não prova nada sobre TDD ou review em geral.
- **Contagem de testes:** 200 dos 248 testes do MVP são o mesmo teste com sementes diferentes, então os totais não medem cobertura.
- **Tempo:** os horários dos commits não incluem o grilling nem medem o mesmo tipo de trabalho, então não servem de comparação.

## Pendências

A lista atual está em `docs/pendencias.md`. Naquela noite, as principais eram:

1. **Confirmar o sorteio de 4 dos 5 monstros**, que é uma mudança no jogo que você não pediu literalmente.
2. **Decidir as issues #1 e #5.**
3. **Preencher** "O que fiz à mão" e "Print" no diário, e os prints em `docs/prints/`.

Outro desvio da skill `tdd`: as interfaces testadas não foram confirmadas com você, porque você pediu para eu não esperar. Elas estão registradas no diário.

## Como rodar

```bash
npm install
npm start
```

Abra <http://localhost:3001>. O roteiro da apresentação está em `docs/roteiro-demo.md`.

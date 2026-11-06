# Diário de bordo

## Modelo de entrada

Copie o bloco abaixo para cada nova entrada.

```markdown
### Entrada

- **Data:**
- **Skill usada:**
- **Modelo:**
- **Tempo:**
- **O que fez:**
- **Mudou a rota?:**
- **Problemas:**
- **O que fiz à mão:**
- **Print:**
```

### Entrada: code review do MVP

- **Data:** 2026-11-05
- **Skill usada:** `code-review` (Matt Pocock), base `9e63e47`, com dois sub-agentes: Standards e Spec
- **Modelo:** Claude Opus 5.5
- **Tempo:** não medido
- **O que fez:** revisou o código do MVP. Como o MVP não tem spec escrita, o eixo Spec usou as decisões do grilling, o `GLOSSARY.md` e os ADRs. O eixo Standards usou `CLAUDE.md`, `docs/agents/domain.md` e a lista de smells da skill, porque o repositório não tem documento de padrões de código.
- **Mudou a rota?:** sim, em parte. Gerou 5 issues e 3 correções, mas nenhuma regra de jogo mudou.
- **Problemas:** a revisão não jogou no navegador; os cenários de tela vêm da leitura do código.
- **O que fiz à mão:** Respondi e decidi as perguntas do grilling, escolhi e cortei o escopo, conferi cada etapa e percebi que o agente tinha pulado spec, tickets e TDD, gerei as imagens com IA, gravei o vídeo da demo e montei os slides.
- **Print:** não registrado

**Aceitos e corrigidos**

| Apontamento | Eixo | Issue | Correção |
| --- | --- | --- | --- |
| `Atendimento` e `item` divergem do glossário | Standards | #2 | Termos registrados no glossário; `item` renomeado para `ingrediente` |
| Guarda de sessão repetida em 3 rotas | Standards | #3 | Extraída para `exigirUsuario`; coberta pelos testes de API existentes |
| ADR-0002 dizia que o login é sempre a primeira tela | Standards e Spec | #4 | Texto do ADR corrigido; o comportamento era o desejado |

**Aceitos, ainda não corrigidos**

| Apontamento | Eixo | Issue | Motivo |
| --- | --- | --- | --- |
| F5 na tela de fim de dia pula a loja daquela noite | Spec | #1 | Muda o formato do save e pede decisão de produto |
| Sessões nunca expiram | Spec | #5 | Impacto baixo enquanto o jogo roda só na máquina local |

**Rejeitados**

| Apontamento | Eixo | Motivo |
| --- | --- | --- |
| `fase`, `placar` e `item-loja` colidem com o _Avoid_ do glossário | Standards | São homônimos em outro sentido: estado da aplicação, cabeçalho da noite e item à venda |
| Termos Save, Pagamento, Resultado e Anotação sem verbete | Standards | Sem ambiguidade real no uso atual; `Progresso` e `Atendimento` entraram pela #2 |
| Repetições menores (`instanceof Error`, `throw` em `api.ts`, bloco retrato + nome) | Standards | Poucas linhas; extrair não simplificaria |
| Decisões sobre `Resultado` espalhadas | Standards | São 3 pontos pequenos; um mapa de efeitos seria mais código |
| Emoji do monstro fora de `MONSTROS` | Standards | O tipo do `Record` já obriga a declarar o emoji de um monstro novo, com erro de compilação |
| "2" das escolhas da casa e posições `[0, 1, 2, 3, 4]` fixos | Standards | O tamanho da noite e da comanda não muda |
| `Progresso.noite`, `aoSeguir`, `dados` | Standards | Renomear não traria ganho claro neste prazo |
| `livro` e pote em `Progresso` e `Noite`; `{nome, senha}` | Standards | A `Noite` guarda uma cópia de propósito; um tipo a mais não simplifica |
| União `"entrar" \| "cadastro"` repetida | Standards | Duas ocorrências e checagem do compilador |
| `criarApp` reúne schema, sessão, autenticação e save | Standards | Dividir 170 linhas agora é risco sem benefício imediato |
| `TelaNoite` deriva posição de `noite.atendimentos` | Standards | Derivação de exibição, usada só nessa tela |
| Botão Sair, sessão persistente, validação de cadastro, aviso de falha ao salvar, placar e fechar o Livro com Esc | Spec | Não foram pedidos, mas são pequenos; Sair e a sessão são necessários para o login funcionar direito |

### Entrada: MVP

- **Data:** 2026-11-05
- **Skill usada:** `grilling` e `domain-modeling` (via `grill-with-docs`). Depois disso, nenhuma: não foram usadas `to-spec`, `to-tickets` nem `tdd`.
- **Modelo:** Claude Opus 5.5
- **Tempo:** código entre 23:42 e 23:51, pelos horários dos commits. O tempo do grilling não foi medido.
- **O que fez:** grilling com 15 perguntas (Q1 a Q5 uma por vez e Q6 a Q15 em lote, a pedido) e 2 ADRs. Depois, o agente foi direto ao código, sem spec, tickets ou TDD. Os testes foram escritos junto com o código ou logo depois, sem ver um teste falhar antes de implementar. Resultado: 5 commits de funcionalidade, 248 testes passando (200 são o mesmo teste de sorteio com sementes diferentes) e cerca de 2.030 linhas adicionadas, sem contar o `package-lock.json`.
- **Mudou a rota?:** sim. O grilling acrescentou noites que se repetem, gorjeta, comanda com escolhas da casa e o Pote de Gorjetas.
- **Problemas:** os diagramas C4 só foram gerados depois do MVP. As telas foram verificadas no Chrome com scripts que ficaram fora do repositório.
- **O que fiz à mão:** Respondi e decidi as perguntas do grilling, escolhi e cortei o escopo, conferi cada etapa e percebi que o agente tinha pulado spec, tickets e TDD, gerei as imagens com IA, gravei o vídeo da demo e montei os slides.
- **Print:** não registrado

### Entrada: incremento Fantasma

- **Data:** 2026-11-05 e 2026-11-06
- **Skill usada:** `tdd` e `code-review`. **Não usadas:** `to-spec` e `to-tickets`, que o agente não pode invocar (ver `docs/pendencias.md`).
- **Modelo:** Claude Opus 5.5
- **Tempo:** entre 23:58 e 00:05, pelos horários dos commits, sem contar a documentação.
- **O que fez:** ADR-0003 antes do código, 6 ciclos red → green, 1 quebra proposital do código para validar um teste e code review do incremento. **O processo não foi completo:** faltaram spec e tickets.
- **Mudou a rota?:** sim, duas vezes. Ao desenhar o incremento, surgiu o sorteio de 4 dos 5 monstros e a compatibilidade com saves antigos. O review obrigou a refazer a validação do save (#7).
- **Problemas:**
  - O ciclo 1 passou, mas implementou a regra errada: aceitava a falta de qualquer página do Livro. O teste estava verde porque pedia isso mesmo. Só o review encontrou o problema.
  - A skill `tdd` pede para confirmar com o usuário onde os testes entram. Isso não foi feito, porque a usuária estava dormindo e pediu para não esperar. O agente usou as interfaces públicas existentes.
  - A skill `tdd` trata a refatoração como etapa do review, não do ciclo. Por isso não houve um passo de refatoração separado em cada ciclo; os ajustes de nome vieram do review.
  - As telas não têm teste automatizado: foram conferidas no Chrome com um script fora do repositório.
- **O que fiz à mão:** Respondi e decidi as perguntas do grilling, escolhi e cortei o escopo, conferi cada etapa e percebi que o agente tinha pulado spec, tickets e TDD, gerei as imagens com IA, gravei o vídeo da demo e montei os slides.
- **Print:** não registrado

**Números**

| Medida | Valor |
| --- | --- |
| Tickets gerados por `to-tickets` | 0 |
| Issues do incremento | 2: #6 (acompanhamento) e #7 (defeito achado no review) |
| Testes | de 248 para 272 (+24) |
| Ciclos red → green | 6 |
| Quebra proposital do código para validar um teste | 1 (invariante) |
| Testes sem vermelho próprio | 3 de comportamento ("entra no sorteio", "sem Sorvete de neblina" e "save anterior ao Fantasma"), mais os 10 casos do invariante |
| Apontamentos do review | 15: 9 de Standards e 6 de Spec |
| Linhas | 148 adicionadas e 20 removidas |

**Saídas dos testes**

Cada saída abaixo é um trecho real. O ciclo 3 ficou vermelho por testes já existentes, que quebraram quando o Fantasma entrou. Os ciclos 2 a 5 foram enviados juntos, em `5c79e28`, para o jogo nunca ficar com um monstro pela metade.

**Ciclo 1: save sem a página de um monstro** (`49a16be`)

```text
RED
 FAIL  src/game/save.test.ts > lerProgresso > aceita save sem a página de um monstro e a devolve em branco
AssertionError: expected undefined to deeply equal { regra: false, mania: false }
      Tests  1 failed | 8 passed (9)
GREEN
      Tests  9 passed (9)
```

**Ciclo 2: página do Fantasma no Livro**

```text
RED
+ Received:
undefined
 ❯ src/game/jogo.test.ts:154:47
      Tests  1 failed | 229 skipped (230)
GREEN
      Tests  1 passed | 229 skipped (230)
```

**Ciclo 3: noite continua com 5 clientes**

```text
RED
AssertionError: expected [ 'lobisomem', 'dracula', …(4) ] to have a length of 5 but got 6
      Tests  201 failed | 29 passed (230)
GREEN
      Tests  2 failed | 230 passed (232)
      (as 2 falhas restantes são o vermelho do ciclo 4 e a noite perfeita de teste, que ainda não conhecia o Fantasma)
```

**Ciclo 4: regra óbvia**

```text
RED
 FAIL  src/game/jogo.test.ts > Fantasma > Sal de prata causa desastre: ele atravessa a parede sem pagar
-   "pagamento": 0,
-   "resultado": "desastre",
+   "pagamento": 10,
+   "resultado": "maniaNaoAtendida",
GREEN (junto com o vermelho do ciclo 5)
      Tests  2 failed | 232 passed (234)
```

**Ciclo 5: mania secreta**

```text
RED
 FAIL  src/game/jogo.test.ts > Fantasma > Sorvete de neblina nas escolhas da casa vale a gorjeta
-   "gorjeta": 5,
-   "resultado": "perfeito",
+   "gorjeta": 0,
+   "resultado": "maniaNaoAtendida",
GREEN
      Tests  244 passed (244)
```

**Invariante dos itens fixos: não foi um ciclo red → green**

O teste nasceu verde, porque o invariante já valia. Para saber se ele detecta uma violação, o código foi quebrado de propósito (Fantasma recusando Queijo) e depois restaurado:

```text
 FAIL  src/game/jogo.test.ts > invariante dos itens fixos > fantasma com Pão + queijo pode ser totalmente atendido
      Tests  1 failed | 9 passed | 234 skipped (244)
```

**Ciclo 6: validação do save** (`731bdea`, `Closes #7`)

```text
RED
 FAIL  server/app.test.ts > save > recusa save com o Livro vazio e não apaga o que estava guardado
AssertionError: expected 204 to be 400 // Object.is equality
 FAIL  src/game/save.test.ts > lerProgresso > recusa livro vazio
      Tests  8 failed | 20 passed (28)
GREEN
      Tests  28 passed (28)
```

Ao final: `npm test` com 272 testes passando e `tsc --noEmit` sem erros.

### Entrada: code review do incremento Fantasma

- **Data:** 2026-11-06
- **Skill usada:** `code-review` (Matt Pocock), base `16d8974`, com dois sub-agentes: Standards e Spec
- **Modelo:** Claude Opus 5.5
- **Tempo:** não medido
- **O que fez:** revisou o Fantasma e a tolerância a saves antigos. Como não havia spec gerada, o eixo Spec usou os requisitos do pedido e o ADR-0003.
- **Mudou a rota?:** sim. Encontrou o defeito na validação do save.
- **Problemas:** o revisor de Spec não abriu o jogo no navegador.
- **O que fiz à mão:** Respondi e decidi as perguntas do grilling, escolhi e cortei o escopo, conferi cada etapa e percebi que o agente tinha pulado spec, tickets e TDD, gerei as imagens com IA, gravei o vídeo da demo e montei os slides.
- **Print:** não registrado

**Aceitos e corrigidos (6)**

| Apontamento | Eixo | Correção |
| --- | --- | --- |
| `lerProgresso` aceita Livro vazio e página malformada | Spec | #7, ciclo com teste vermelho antes |
| Tipo `Pagina` não diz que é uma página ainda não validada | Standards | Renomeado para `PaginaNoSave` |
| Nomes `a`, `b` e `perfeitos` no teste do invariante | Standards | Renomeados, usando `some` |
| Lista de monstros repetida à mão no invariante | Standards | Usa `IDS_MONSTROS` |
| Glossário usa "componentes", termo que ele mesmo evita | Standards | Trocado por "alimentos" |
| C4 desatualizado sobre `save.ts` | Spec | Descrição atualizada |

**Aguardando a usuária (1)**

| Apontamento | Eixo | Situação |
| --- | --- | --- |
| Excluir um monstro por noite não foi pedido literalmente | Spec | Registrado no ADR-0003; precisa de confirmação |

**Rejeitados (8)**

| Apontamento | Eixo | Motivo |
| --- | --- | --- |
| "Página" e "save" sem verbete no glossário | Standards | Sem ambiguidade no uso atual |
| Testes com mais de um `expect` | Standards | O Livro faz parte do mesmo desfecho do atendimento |
| Página em branco escrita em dois lugares | Standards | Duas ocorrências de uma linha |
| `MONSTROS_POR_NOITE` ligado à mão às posições `[0, 1, 2, 3, 4]` | Standards | O tamanho da noite não muda |
| Emoji do monstro fora de `MONSTROS`; grade de 3 colunas | Standards | O compilador obriga a declarar o emoji; a grade só serve aos 9 ingredientes |
| `lerProgresso` descarta campos desconhecidos | Spec | Inofensivo hoje |
| Grade de ingredientes mudou de 4 para 3 colunas | Spec | Necessário para os 9 ingredientes |
| Itens fixos do invariante escritos à mão | Spec | A lista literal é a própria decisão de design, de fonte independente do código |

### Entrada: spec, tickets e TDD do fim de dia pendente

- **Data:** 2026-11-06, de manhã
- **Skill usada:** `to-spec`, `to-tickets` e `tdd`, invocadas pela usuária
- **Modelo:** Claude Opus 5.5
- **Tempo:** visual entre 06:49 e 07:08, e da spec ao commit do #9 entre 08:26 e 08:38, pelos horários das issues e dos commits.
- **O que fez:**
  - `to-spec` gerou a spec na issue #8 e perguntou onde testar e onde colocar o botão Recomeçar.
  - `to-tickets` gerou o #9 e o #10, com o #10 bloqueado pelo #9.
  - `tdd` implementou o #9 em 4 ciclos red → green, com o teste falhando antes do código, e fechou o bug #1. A suíte foi de 278 para 289 testes. O botão Recomeçar (#10) ainda não foi implementado.
  - O visual foi refeito no estilo de jogo Flash, com imagens que a usuária gerou por IA.
- **Mudou a rota?:** sim. A spec registrou a decisão de produto que a #1 pedia: o fim de dia pendente sobrevive ao recarregamento e a um novo login.
- **Problemas:**
  - O primeiro `/tdd` parou sem mexer no código, porque o `to-tickets` ainda não tinha sido rodado.
  - Os testes do Pote, do save antigo e da API passaram de primeira. Para provar que detectam erro, o código foi quebrado de propósito, e cada um falhou.
  - As telas continuam sem teste automatizado: foram conferidas no Chrome com um script fora do repositório, que falhou no código antigo e passou nas 12 verificações do novo.
  - A reforma visual foi feita sem ADR, sem TDD e sem code review.
- **O que fiz à mão:** Respondi e decidi as perguntas do grilling, escolhi e cortei o escopo, conferi cada etapa e percebi que o agente tinha pulado spec, tickets e TDD, gerei as imagens com IA, gravei o vídeo da demo e montei os slides.
- **Print:** não registrado

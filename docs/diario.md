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
- **O que fiz à mão:**
- **Print:**

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

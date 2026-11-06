# C4 nível 3: Componentes

> **Gerado depois do MVP.** Este diagrama não guiou a construção: o código veio primeiro, e o diagrama documenta o sistema como ele ficou.

As regras do jogo ficam em `src/game/`, em funções puras, sem depender de React nem do servidor. O servidor reutiliza `save.ts` para validar o progresso recebido.

## Jogo web

```mermaid
C4Component
  title Componentes do jogo web

  Container_Boundary(spa, "Jogo web") {
    Component(app, "App", "src/App.tsx", "Sessão, carga do save e fila de envios")
    Component(jogoUi, "Jogo", "src/Jogo.tsx", "Controla a noite, o fim de dia e o Livro")
    Component(telas, "Telas", "src/ui/", "Login, noite, fim de dia e Livro de Manias")
    Component(apiCliente, "Cliente da API", "src/api.ts", "Chamadas HTTP ao servidor")
    Component(regras, "Regras", "src/game/jogo.ts", "Avaliação do lanche, sorteio, pagamento e loja")
    Component(conteudo, "Conteúdo", "src/game/conteudo.ts", "Ingredientes, monstros, regras e falas")
    Component(leitor, "Leitor de save", "src/game/save.ts", "Valida o formato do progresso")
  }

  Container_Ext(api, "Servidor", "Node, Express")

  Rel(app, jogoUi, "Renderiza")
  Rel(app, telas, "Renderiza o login")
  Rel(app, apiCliente, "Sessão e save")
  Rel(jogoUi, telas, "Renderiza")
  Rel(jogoUi, regras, "Serve lanches e encerra noites")
  Rel(telas, conteudo, "Lê nomes e falas")
  Rel(regras, conteudo, "Consulta os monstros")
  Rel(apiCliente, leitor, "Valida o save recebido")
  Rel(apiCliente, api, "JSON")
```

## Servidor

```mermaid
C4Component
  title Componentes do servidor

  Container_Boundary(api, "Servidor") {
    Component(entrada, "Inicialização", "server/index.ts", "Cria a pasta do banco, serve dist/ e abre a porta")
    Component(rotas, "Aplicação", "server/app.ts", "Rotas de cadastro, entrada, saída, sessão e save")
    Component(leitor, "Leitor de save", "src/game/save.ts", "Valida o formato do progresso")
  }

  ContainerDb(banco, "Banco", "SQLite")

  Rel(entrada, rotas, "Cria")
  Rel(rotas, leitor, "Valida o save recebido")
  Rel(rotas, banco, "Usuários, sessões e saves", "SQL")
```

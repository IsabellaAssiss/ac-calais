# C4 nível 2: Container

> **Gerado depois do MVP.** Este diagrama não guiou a construção: o código veio primeiro, e o diagrama documenta o sistema como ele ficou.

Em `npm start`, o mesmo processo Node serve os arquivos do jogo e a API, em `http://localhost:3001`. O motivo de rodar localmente está em [ADR-0002](../adr/0002-jogo-web-local-com-persistencia-por-ultimo.md).

```mermaid
C4Container
  title Containers do Monster Munchies

  Person(jogador, "Jogador", "Joga pelo navegador")

  System_Boundary(sistema, "Monster Munchies") {
    Container(spa, "Jogo web", "React, TypeScript", "Telas e regras do jogo, executadas no navegador")
    Container(api, "Servidor", "Node, Express", "Serve o jogo, autentica e guarda o progresso")
    ContainerDb(banco, "Banco", "SQLite (node:sqlite)", "Usuários, sessões e saves em data/monster-munchies.db")
  }

  Rel(jogador, spa, "Usa", "HTTP")
  Rel(api, spa, "Entrega os arquivos de", "HTTP")
  Rel(spa, api, "Login e save", "JSON, cookie de sessão")
  Rel(api, banco, "Lê e grava", "SQL")
```

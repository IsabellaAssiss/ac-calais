# C4 nível 4: Código

> **Gerado depois do MVP.** Este diagrama não guiou a construção: o código veio primeiro, e o diagrama documenta o sistema como ele ficou.

Principais tipos e funções de `src/game/jogo.ts` e `src/game/conteudo.ts`. Os módulos aparecem como classes porque o Mermaid não tem notação própria para funções soltas.

```mermaid
classDiagram
  class Progresso {
    +number dinheiro
    +number noite
    +boolean temPoteDeGorjetas
    +Livro livro
    +GanhosDaNoite fimDeDiaPendente
  }
  class Noite {
    +number numero
    +Cliente[] clientes
    +Atendimento[] atendimentos
    +Livro livro
    +boolean temPoteDeGorjetas
  }
  class Cliente {
    +MonstroId monstro
    +Comanda comanda
  }
  class Comanda {
    +Ingrediente[2] itensFixos
  }
  class Atendimento {
    +Cliente cliente
    +Resultado resultado
    +number pagamento
    +number gorjeta
    +boolean novaAnotacao
  }
  class Monstro {
    +string nome
    +quebraRegraObvia(lanche) boolean
    +atendeMania(escolhas) boolean
    +string anotacaoRegra
    +string anotacaoMania
  }
  class Resultado {
    <<enumeration>>
    desastre
    pedidoErrado
    maniaNaoAtendida
    perfeito
  }
  class jogo_ts {
    <<module>>
    +progressoInicial() Progresso
    +sortearClientes(rng) Cliente[]
    +iniciarNoite(progresso, rng) Noite
    +avaliarLanche(cliente, lanche) Resultado
    +servir(noite, lanche) Noite
    +encerrarNoite(progresso, noite) Progresso
    +seguirParaProximaNoite(progresso) Progresso
    +comprarPote(progresso) Progresso
  }

  Progresso --> Noite : iniciarNoite
  Noite "1" --> "5" Cliente
  Noite "1" --> "0..5" Atendimento
  Cliente --> Comanda
  Cliente --> Monstro : monstro
  Atendimento --> Resultado
  jogo_ts ..> Monstro : consulta
  jogo_ts ..> Noite : produz
  jogo_ts ..> Progresso : produz
```

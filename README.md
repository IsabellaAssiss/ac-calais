# Monster Munchies

Jogo web por cliques: você atende monstros numa lanchonete e descobre, errando, as regras de cada um. O jogo não avisa nada. O que você aprende fica anotado no Livro de Manias.

São cinco monstros: Vampira, Lobisomem, Múmia, Zumbi e Fantasma. Cada noite tem 5 clientes: 4 monstros sorteados, e um deles volta uma segunda vez.

Feito com React, TypeScript e Vite no navegador, e Express e SQLite no servidor.

## Pré-requisitos

- [Node.js](https://nodejs.org/) 24 ou superior, que já inclui o npm e o SQLite usado pelo servidor.

Não é preciso instalar um banco de dados nem criar contas em serviços externos. Com internet, o jogo baixa as fontes do Google Fonts. Sem internet, ele continua funcionando, com as fontes padrão do navegador.

## Como rodar

```bash
npm install
npm start
```

Abra <http://localhost:3001>, clique em **JOGAR!** e crie uma conta. Cada conta nova começa do zero.

A conta e o progresso ficam em `data/monster-munchies.db`, criado na primeira execução e fora do git. O jogo salva ao encerrar a noite, ao comprar na loja e ao seguir para a próxima noite. Fechar o jogo no meio de uma noite recomeça aquela noite.

## Como rodar os testes

```bash
npm test
```

Os testes usam um banco em memória e não mexem em `data/`. As senhas que aparecem neles são fictícias.

## Desenvolvimento

```bash
npm run dev:server   # API em http://localhost:3001
npm run dev          # jogo com recarregamento automático, em outro terminal
npm run build        # confere os tipos e gera a versão final em dist/
```

## Configuração e segurança

O projeto não precisa de arquivo `.env` nem de variáveis de ambiente, porque não há chave secreta no código:

- **Sessões:** cada login gera um token aleatório, guardado no banco local. O projeto não usa JWT.
- **Senhas:** são guardadas apenas como hash `scrypt`, com um sal próprio para cada conta.
- **Servidor:** escuta somente em `127.0.0.1`, feito para rodar na própria máquina. As sessões não expiram ([#5](https://github.com/IsabellaAssiss/ac-calais/issues/5)), então é preciso rever isso antes de publicá-lo na internet.

## Processo com skills

O jogo foi construído com um agente de código e skills de engenharia. Estes são os registros do processo:

- [Diário de bordo](docs/diario.md): o que foi feito em cada etapa até o incremento do Fantasma, com os problemas e os números.
- [Glossário](GLOSSARY.md): vocabulário do jogo, usado no código e nas issues.
- [Decisões de arquitetura (ADRs)](docs/adr): por que o projeto seguiu cada caminho.
- [Diagramas C4](docs/c4): os 4 níveis, gerados depois do MVP.

O incremento seguinte usou o fluxo `to-spec` → `to-tickets` → `tdd`, que não tinha sido usado nas etapas anteriores. Por isso, o diário e os outros documentos da época registram essas skills como não usadas.

- [#8: spec](https://github.com/IsabellaAssiss/ac-calais/issues/8) do fim de dia pendente e do botão Recomeçar.
- [#9: fim de dia pendente sobrevive ao recarregamento](https://github.com/IsabellaAssiss/ac-calais/issues/9), já implementado.
- [#10: botão Recomeçar](https://github.com/IsabellaAssiss/ac-calais/issues/10), ainda não implementado.

## Outros documentos

- [`docs/roteiro-demo.md`](docs/roteiro-demo.md): roteiro da apresentação, com as respostas do jogo
- [`docs/apresentacao.md`](docs/apresentacao.md): dados do projeto para os slides
- [`docs/resumo-da-noite.md`](docs/resumo-da-noite.md): resumo do incremento do Fantasma e comparação com o MVP
- [`docs/pendencias.md`](docs/pendencias.md): o que ficou em aberto

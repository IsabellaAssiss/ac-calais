# Monster Munchies

Jogo de gestão por cliques em que o jogador atende monstros numa lanchonete e descobre, errando, as regras de cada um.

## Language

**Noite**:
Uma rodada de jogo, com 5 clientes atendidos em sequência e encerrada pela tela de fim de dia. Noites se repetem sem final.
_Avoid_: Fase, nível

**Cliente**:
Uma das 5 visitas de uma noite, formada por um monstro e sua comanda. Cada noite sorteia 4 dos 5 monstros, e um deles volta como quinto cliente, nunca em sequência.
_Avoid_: Freguês

**Atendimento**:
O desfecho de servir um lanche a um cliente: o resultado, o valor pago e a gorjeta.
_Avoid_: Pedido, venda

**Progresso**:
O que o jogador mantém entre noites: dinheiro, desbloqueio, Livro de Manias e número da próxima noite.
_Avoid_: Estado, perfil

**Tela de fim de dia**:
O encerramento da noite, que mostra o dinheiro ganho e dá acesso à loja.
_Avoid_: Resumo, placar

**Loja**:
O lugar onde o jogador gasta dinheiro com desbloqueios, disponível só na tela de fim de dia.
_Avoid_: Mercado, upgrades

**Pote de Gorjetas**:
O desbloqueio da loja, de compra única, que dobra a gorjeta nas noites seguintes.
_Avoid_: Upgrade, power-up

**Monstro**:
Um dos cinco tipos de cliente: Drácula, Lobisomem, Múmia, Zumbi ou Fantasma.
_Avoid_: Vampiro, personagem

**Ingrediente**:
Um dos 9 alimentos disponíveis na estação de montagem: Pão, Carne, Queijo, Picles, Molho vermelho, Alho, Sal de prata, Cérebro e Sorvete de neblina.
_Avoid_: Item, componente

**Lanche**:
O conjunto de 4 ingredientes que o jogador monta e serve. A ordem dos ingredientes não importa.
_Avoid_: Prato, hambúrguer

**Regra óbvia**:
Exigência de um monstro dedutível do folclore e nunca avisada pelo jogo. Quebrá-la anula o pagamento e a gorjeta e causa a reação desastrosa.
_Avoid_: Restrição, proibição

**Mania secreta**:
Capricho de um monstro que só se descobre jogando. Não atendê-la anula apenas a gorjeta e causa uma reclamação leve.
_Avoid_: Preferência, regra secreta

**Gorjeta**:
Valor extra pago por um monstro quando a comanda, sua regra óbvia e sua mania secreta são atendidas.
_Avoid_: Bônus

**Comanda**:
O pedido de um monstro, composto de itens fixos e escolhas da casa.
_Avoid_: Pedido, receita

**Item fixo**:
Ingrediente exigido nominalmente pela comanda. Nunca viola uma regra do monstro.
_Avoid_: Item obrigatório

**Escolha da casa**:
Espaço da comanda em que o jogador decide qual ingrediente colocar.
_Avoid_: Espaço livre, item opcional

**Pedido errado**:
Lanche servido sem respeitar os itens fixos da comanda. O monstro paga, não dá gorjeta e reclama, e nada é anotado no Livro de Manias.
_Avoid_: Regra quebrada

**Livro de Manias**:
O registro do jogador com as regras de cada monstro, preenchido somente depois que ele as quebra. Persiste entre noites.
_Avoid_: Diário, caderno, tutorial

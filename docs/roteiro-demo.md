# Roteiro de demo

**Contém as respostas do jogo.**

## Antes de começar

```bash
npm start
```

Abra <http://localhost:3001> e crie uma conta nova, para começar com o Livro em branco.

## Roteiro

Cada noite sorteia 4 dos 5 monstros, então a ordem e os clientes mudam. Use o monstro que aparecer.

1. **Comanda:** mostre os 2 itens fixos e as 2 escolhas da casa. Explique que o jogo não avisa nenhuma regra.
2. **Desastre:** quebre a regra óbvia do primeiro cliente, usando a tabela abaixo. Mostre a reação, o "Não pagou nada!" e a "Nova anotação no Livro!".
3. **Livro:** abra o Livro de Manias e mostre a regra anotada e os `???` no resto.
4. **Mania:** no próximo cliente, respeite a regra e não atenda a mania. Ele paga, sem gorjeta, e reclama.
5. **Acerto:** atenda os demais com as escolhas da tabela e mostre a gorjeta.
6. **Fim de dia:** mostre o dinheiro e compre o Pote de Gorjetas por $30, se tiver dinheiro.
7. **Noite 2:** clique em "Próxima noite" e mostre a gorjeta dobrada, de $10, e o erro evitado.
8. **Save:** no início da noite, recarregue a página para mostrar que o progresso continua lá.

## Respostas

| Monstro | Regra óbvia (desastre) | Escolhas da casa perfeitas |
| --- | --- | --- |
| Drácula | Sem Alho | Molho vermelho + outro ingrediente permitido |
| Lobisomem | Sem Sal de prata | Carne + outro ingrediente permitido |
| Múmia | Sem Molho vermelho | Picles + outro ingrediente permitido |
| Zumbi | Precisa ter Cérebro | Cérebro + Cérebro |
| Fantasma | Sem Sal de prata | Sorvete de neblina + outro ingrediente permitido |

Queijo sempre serve como "outro ingrediente permitido".

## Para mostrar o Fantasma

Ele atravessa a parede sem pagar se receber Sal de prata. Como é sorteado, pode não aparecer em uma noite: se isso acontecer, jogue a próxima.

## Cuidados

- **Não recarregue a página na tela de fim de dia.** O jogo pula para a noite seguinte, e a loja só volta ao fim dela (issue #1).
- **Sair** volta para a tela de login, e o progresso continua salvo.

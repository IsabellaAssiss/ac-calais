import { IDS_MONSTROS, MONSTROS, type Ingrediente, type MonstroId } from "./conteudo.ts";

export const TAMANHO_DO_LANCHE = 4;
const MONSTROS_POR_NOITE = 4;
export const PAGAMENTO = 10;
export const GORJETA = 5;
export const PRECO_POTE_DE_GORJETAS = 30;

export type Comanda = { itensFixos: [Ingrediente, Ingrediente] };
export type Cliente = { monstro: MonstroId; comanda: Comanda };
export type Resultado = "desastre" | "pedidoErrado" | "maniaNaoAtendida" | "perfeito";
export type Rng = () => number;

export type Livro = Record<MonstroId, { regra: boolean; mania: boolean }>;

/** O que sobrevive entre noites e vai para o save. */
export type Progresso = {
  dinheiro: number;
  /** Número da próxima noite a ser jogada. */
  noite: number;
  temPoteDeGorjetas: boolean;
  livro: Livro;
  /** Ganhos da noite encerrada, enquanto o jogador não segue para a próxima noite. */
  fimDeDiaPendente?: GanhosDaNoite;
};

export type GanhosDaNoite = { pagamentos: number; gorjetas: number };

export type Atendimento = {
  cliente: Cliente;
  resultado: Resultado;
  pagamento: number;
  gorjeta: number;
  novaAnotacao: boolean;
};

export type Noite = {
  numero: number;
  clientes: Cliente[];
  atendimentos: Atendimento[];
  livro: Livro;
  temPoteDeGorjetas: boolean;
};

export function progressoInicial(): Progresso {
  const livro = Object.fromEntries(
    IDS_MONSTROS.map((id) => [id, { regra: false, mania: false }]),
  ) as Livro;
  return { dinheiro: 0, noite: 1, temPoteDeGorjetas: false, livro };
}

/** Remove os itens fixos do lanche. Retorna null se faltar algum deles. */
function escolhasDaCasa(comanda: Comanda, lanche: Ingrediente[]): Ingrediente[] | null {
  const restante = [...lanche];
  for (const item of comanda.itensFixos) {
    const posicao = restante.indexOf(item);
    if (posicao === -1) return null;
    restante.splice(posicao, 1);
  }
  return restante;
}

/** Vale só o pior resultado: regra óbvia > pedido errado > mania secreta. */
export function avaliarLanche(cliente: Cliente, lanche: Ingrediente[]): Resultado {
  const monstro = MONSTROS[cliente.monstro];
  if (monstro.quebraRegraObvia(lanche)) return "desastre";
  const escolhas = escolhasDaCasa(cliente.comanda, lanche);
  if (escolhas === null) return "pedidoErrado";
  return monstro.atendeMania(escolhas) ? "perfeito" : "maniaNaoAtendida";
}

function sortearIndice(tamanho: number, rng: Rng): number {
  return Math.floor(rng() * tamanho);
}

function embaralhar<T>(itens: T[], rng: Rng): T[] {
  const copia = [...itens];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = sortearIndice(i + 1, rng);
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

/** 4 monstros sorteados mais 1 repetido, que nunca vem logo ao lado de si mesmo. */
export function sortearClientes(rng: Rng): Cliente[] {
  const ordem = embaralhar(IDS_MONSTROS, rng).slice(0, MONSTROS_POR_NOITE);
  const repetido = ordem[sortearIndice(ordem.length, rng)];
  const posicoesValidas = [0, 1, 2, 3, 4].filter(
    (p) => ordem[p - 1] !== repetido && ordem[p] !== repetido,
  );
  const posicao = posicoesValidas[sortearIndice(posicoesValidas.length, rng)];
  ordem.splice(posicao, 0, repetido);
  return ordem.map((monstro) => ({
    monstro,
    comanda: { itensFixos: ["pao", rng() < 0.5 ? "carne" : "queijo"] },
  }));
}

export function iniciarNoite(progresso: Progresso, rng: Rng = Math.random): Noite {
  return {
    numero: progresso.noite,
    clientes: sortearClientes(rng),
    atendimentos: [],
    livro: progresso.livro,
    temPoteDeGorjetas: progresso.temPoteDeGorjetas,
  };
}

export function clienteAtual(noite: Noite): Cliente | null {
  return noite.clientes[noite.atendimentos.length] ?? null;
}

function anotar(livro: Livro, monstro: MonstroId, resultado: Resultado) {
  const campo =
    resultado === "desastre" ? "regra" : resultado === "maniaNaoAtendida" ? "mania" : null;
  if (campo === null || livro[monstro][campo]) return { livro, novaAnotacao: false };
  return {
    livro: { ...livro, [monstro]: { ...livro[monstro], [campo]: true } },
    novaAnotacao: true,
  };
}

/** Serve o lanche ao cliente atual e devolve a noite com o atendimento registrado. */
export function servir(noite: Noite, lanche: Ingrediente[]): Noite {
  const cliente = clienteAtual(noite);
  if (cliente === null) throw new Error("A noite já terminou.");
  if (lanche.length !== TAMANHO_DO_LANCHE) {
    throw new Error(`O lanche precisa de ${TAMANHO_DO_LANCHE} ingredientes.`);
  }
  const resultado = avaliarLanche(cliente, lanche);
  const { livro, novaAnotacao } = anotar(noite.livro, cliente.monstro, resultado);
  const gorjetaCheia = noite.temPoteDeGorjetas ? GORJETA * 2 : GORJETA;
  const atendimento: Atendimento = {
    cliente,
    resultado,
    pagamento: resultado === "desastre" ? 0 : PAGAMENTO,
    gorjeta: resultado === "perfeito" ? gorjetaCheia : 0,
    novaAnotacao,
  };
  return { ...noite, livro, atendimentos: [...noite.atendimentos, atendimento] };
}

export function noiteTerminou(noite: Noite): boolean {
  return clienteAtual(noite) === null;
}

export function ganhosDaNoite(noite: Noite): GanhosDaNoite {
  return noite.atendimentos.reduce(
    (total, a) => ({
      pagamentos: total.pagamentos + a.pagamento,
      gorjetas: total.gorjetas + a.gorjeta,
    }),
    { pagamentos: 0, gorjetas: 0 },
  );
}

export function encerrarNoite(progresso: Progresso, noite: Noite): Progresso {
  const { pagamentos, gorjetas } = ganhosDaNoite(noite);
  return {
    ...progresso,
    dinheiro: progresso.dinheiro + pagamentos + gorjetas,
    noite: noite.numero + 1,
    livro: noite.livro,
    fimDeDiaPendente: { pagamentos, gorjetas },
  };
}

export function seguirParaProximaNoite(progresso: Progresso): Progresso {
  const { fimDeDiaPendente: _encerrado, ...seguinte } = progresso;
  return seguinte;
}

export function podeComprarPote(progresso: Progresso): boolean {
  return !progresso.temPoteDeGorjetas && progresso.dinheiro >= PRECO_POTE_DE_GORJETAS;
}

export function comprarPote(progresso: Progresso): Progresso {
  if (!podeComprarPote(progresso)) return progresso;
  return {
    ...progresso,
    dinheiro: progresso.dinheiro - PRECO_POTE_DE_GORJETAS,
    temPoteDeGorjetas: true,
  };
}

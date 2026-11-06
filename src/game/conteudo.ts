export type Ingrediente =
  | "pao"
  | "carne"
  | "queijo"
  | "picles"
  | "molho"
  | "alho"
  | "salDePrata"
  | "cerebro"
  | "sorveteDeNeblina";

export type MonstroId = "dracula" | "lobisomem" | "mumia" | "zumbi" | "fantasma";

export const INGREDIENTES: Record<Ingrediente, { nome: string; emoji: string }> = {
  pao: { nome: "Pão", emoji: "🍞" },
  carne: { nome: "Carne", emoji: "🥩" },
  queijo: { nome: "Queijo", emoji: "🧀" },
  picles: { nome: "Picles", emoji: "🥒" },
  molho: { nome: "Molho vermelho", emoji: "🥫" },
  alho: { nome: "Alho", emoji: "🧄" },
  salDePrata: { nome: "Sal de prata", emoji: "🧂" },
  cerebro: { nome: "Cérebro", emoji: "🧠" },
  sorveteDeNeblina: { nome: "Sorvete de neblina", emoji: "🍨" },
};

type Monstro = {
  nome: string;
  /** Avalia o lanche inteiro. */
  quebraRegraObvia: (lanche: Ingrediente[]) => boolean;
  /** Avalia só as escolhas da casa. */
  atendeMania: (escolhas: Ingrediente[]) => boolean;
  anotacaoRegra: string;
  anotacaoMania: string;
  falaDesastre: string;
  falaMania: string;
  falaPerfeito: string;
};

export const MONSTROS: Record<MonstroId, Monstro> = {
  dracula: {
    nome: "Drácula",
    quebraRegraObvia: (lanche) => lanche.includes("alho"),
    atendeMania: (escolhas) => escolhas.includes("molho"),
    anotacaoRegra: "Nunca sirva Alho.",
    anotacaoMania: "Quer Molho vermelho nas escolhas da casa. Parece sangue.",
    falaDesastre: "ALHO?! O Drácula vira um punhado de cinzas fumegantes!",
    falaMania: "Hm. Faltou algo... mais vermelho.",
    falaPerfeito: "Delicioso! Quase tão bom quanto uma jugular.",
  },
  lobisomem: {
    nome: "Lobisomem",
    quebraRegraObvia: (lanche) => lanche.includes("salDePrata"),
    atendeMania: (escolhas) => escolhas.includes("carne"),
    anotacaoRegra: "Nunca sirva Sal de prata.",
    anotacaoMania: "Quer Carne nas escolhas da casa. Carnívoro até no acompanhamento.",
    falaDesastre: "PRATA! O Lobisomem uiva, passa mal e derruba o balcão!",
    falaMania: "Grrr... cadê a carne de verdade?",
    falaPerfeito: "AUUUU! Esse lanche tem dentes!",
  },
  mumia: {
    nome: "Múmia",
    quebraRegraObvia: (lanche) => lanche.includes("molho"),
    atendeMania: (escolhas) => escolhas.includes("picles"),
    anotacaoRegra: "Nunca sirva Molho vermelho. Molhado desfaz as faixas.",
    anotacaoMania: "Quer Picles nas escolhas da casa. Conserva, como ela.",
    falaDesastre: "MOLHO! As faixas se desfazem e a Múmia desmorona no chão!",
    falaMania: "Três mil anos esperando e nada de conserva...",
    falaPerfeito: "Perfeitamente preservado. Volto no próximo milênio!",
  },
  zumbi: {
    nome: "Zumbi",
    quebraRegraObvia: (lanche) => !lanche.includes("cerebro"),
    atendeMania: (escolhas) => escolhas.every((i) => i === "cerebro"),
    anotacaoRegra: "Sempre sirva Cérebro.",
    anotacaoMania: "Quer Cérebro nas 2 escolhas da casa. Só pensa nisso.",
    falaDesastre: "SEM CÉÉÉREBRO?! O Zumbi passa mal e cai aos pedaços!",
    falaMania: "Céééérebro... mais... céééérebro...",
    falaPerfeito: "CÉÉÉREBRO! CÉÉÉREBRO EM DOBRO!",
  },
  fantasma: {
    nome: "Fantasma",
    quebraRegraObvia: (lanche) => lanche.includes("salDePrata"),
    atendeMania: (escolhas) => escolhas.includes("sorveteDeNeblina"),
    anotacaoRegra: "Nunca sirva Sal de prata. Sal espanta fantasma.",
    anotacaoMania: "Quer Sorvete de neblina nas escolhas da casa. Gelado, como ele.",
    falaDesastre: "SAL! O Fantasma atravessa a parede e some sem pagar!",
    falaMania: "Uuuuh... faltou um friozinho na espinha...",
    falaPerfeito: "Uuuuh! De arrepiar!",
  },
};

export const IDS_MONSTROS = Object.keys(MONSTROS) as MonstroId[];
export const IDS_INGREDIENTES = Object.keys(INGREDIENTES) as Ingrediente[];

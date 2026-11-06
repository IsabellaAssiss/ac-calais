const CHAVE_DO_MUDO = "monster-munchies:mudo";

let contexto: AudioContext | null = null;
let mudo = localStorage.getItem(CHAVE_DO_MUDO) === "sim";

export function estaMudo() {
  return mudo;
}

export function alternarMudo() {
  mudo = !mudo;
  localStorage.setItem(CHAVE_DO_MUDO, mudo ? "sim" : "nao");
  return mudo;
}

/** O navegador só libera o áudio depois de um clique, então o contexto nasce no primeiro som. */
function audio() {
  contexto ??= new AudioContext();
  void contexto.resume();
  return contexto;
}

type Tom = {
  de: number;
  ate?: number;
  atraso?: number;
  duracao: number;
  tipo: OscillatorType;
  volume: number;
};

function tocarTom({ de, ate = de, atraso = 0, duracao, tipo, volume }: Tom) {
  const ctx = audio();
  const inicio = ctx.currentTime + atraso;
  const oscilador = ctx.createOscillator();
  const ganho = ctx.createGain();
  oscilador.type = tipo;
  oscilador.frequency.setValueAtTime(de, inicio);
  oscilador.frequency.exponentialRampToValueAtTime(ate, inicio + duracao);
  ganho.gain.setValueAtTime(volume, inicio);
  ganho.gain.exponentialRampToValueAtTime(0.001, inicio + duracao);
  oscilador.connect(ganho).connect(ctx.destination);
  oscilador.start(inicio);
  oscilador.stop(inicio + duracao);
}

export function tocarMoeda() {
  if (mudo) return;
  tocarTom({ de: 988, duracao: 0.09, tipo: "square", volume: 0.08 });
  tocarTom({ de: 1319, atraso: 0.08, duracao: 0.25, tipo: "square", volume: 0.08 });
}

export function tocarBoing() {
  if (mudo) return;
  tocarTom({ de: 180, ate: 520, duracao: 0.16, tipo: "sine", volume: 0.2 });
}

export function tocarExplosao() {
  if (mudo) return;
  const ctx = audio();
  const duracao = 0.7;
  const buffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * duracao), ctx.sampleRate);
  const amostras = buffer.getChannelData(0);
  for (let i = 0; i < amostras.length; i++) amostras[i] = Math.random() * 2 - 1;
  const ruido = ctx.createBufferSource();
  const filtro = ctx.createBiquadFilter();
  const ganho = ctx.createGain();
  ruido.buffer = buffer;
  filtro.type = "lowpass";
  filtro.frequency.setValueAtTime(1400, ctx.currentTime);
  filtro.frequency.exponentialRampToValueAtTime(90, ctx.currentTime + duracao);
  ganho.gain.setValueAtTime(0.45, ctx.currentTime);
  ganho.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duracao);
  ruido.connect(filtro).connect(ganho).connect(ctx.destination);
  ruido.start();
}

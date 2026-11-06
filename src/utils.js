import { FAIXAS, FATOS_SEMANA, MOMENTOS, TAMANHO_SEMANA } from './data/conteudo'

const DIA = 86_400_000

// 'aaaa-mm-dd' -> Date local à meia-noite
export function parseData(s) {
  if (!s) return null
  const [a, m, d] = s.split('-').map(Number)
  return new Date(a, m - 1, d)
}
export function hojeISO(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
export const fmtData = (s) => (s ? parseData(s).toLocaleDateString('pt-BR') : '')
export const fmtDataHora = (ts) => new Date(ts).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
export const fmtHora = (ts) => new Date(ts).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })

// Idade gestacional a partir da DUM (ou DPP - 280 dias)
export function gestacao(perfil) {
  let dum = parseData(perfil.dum)
  if (!dum && perfil.dpp) dum = new Date(parseData(perfil.dpp).getTime() - 280 * DIA)
  if (!dum) return null
  const hoje = parseData(hojeISO())
  const dias = Math.round((hoje - dum) / DIA)
  if (dias < 0) return null
  const semanas = Math.floor(dias / 7)
  const dpp = new Date(dum.getTime() + 280 * DIA)
  const trimestre = semanas < 14 ? 1 : semanas < 28 ? 2 : 3
  return {
    semanas, dias: dias % 7, trimestre,
    dpp: hojeISO(dpp),
    faltamSemanas: Math.max(0, 40 - semanas),
    faltamDias: Math.max(0, Math.round((dpp - hoje) / DIA)),
  }
}

export function tamanhoBebe(semanas) {
  const s = Math.min(42, Math.max(8, semanas))
  const [cm, g] = TAMANHO_SEMANA[s]
  return { cm, g, peso: g >= 1000 ? `${(g / 1000).toLocaleString('pt-BR', { maximumFractionDigits: 1 })} kg` : `${g} g` }
}

export function fatoSemana(semanas) {
  let fato = FATOS_SEMANA[0][1]
  for (const [s, t] of FATOS_SEMANA) if (semanas >= s) fato = t
  return fato
}

// Idade do bebê em meses e dias completos
export function idadeBebe(nascimento) {
  const n = parseData(nascimento)
  if (!n) return null
  const h = parseData(hojeISO())
  if (h < n) return null
  let meses = (h.getFullYear() - n.getFullYear()) * 12 + (h.getMonth() - n.getMonth())
  if (h.getDate() < n.getDate()) meses--
  const dias = Math.round((h - new Date(n.getFullYear(), n.getMonth() + meses, n.getDate())) / DIA)
  return { meses, dias, totalDias: Math.round((h - n) / DIA) }
}

export function textoIdade({ meses, dias }) {
  if (meses >= 24) return `${Math.floor(meses / 12)} anos${meses % 12 ? ` e ${meses % 12} meses` : ''}`
  if (meses === 0) return `${dias} ${dias === 1 ? 'dia' : 'dias'}`
  return `${meses} ${meses === 1 ? 'mês' : 'meses'}`
}

export function faixaDaIdade(meses) {
  return FAIXAS.find((f) => meses >= f.de && meses < f.ate) || FAIXAS[FAIXAS.length - 1]
}

export function momento(id) {
  return MOMENTOS.find((m) => m.id === id) || MOMENTOS[MOMENTOS.length - 1]
}

// Classificação de uma leitura de glicemia em relação à meta do momento
export function statusGlicemia(valor, momentoId) {
  const meta = momento(momentoId).meta
  if (valor >= 200) return { nivel: 'perigo', texto: 'Muito alta — procure atendimento' }
  if (valor < 70) return { nivel: 'perigo', texto: 'Hipoglicemia — atenção' }
  if (valor >= meta) return { nivel: 'atencao', texto: `Acima da meta (< ${meta})` }
  return { nivel: 'ok', texto: 'Na meta' }
}

// Classificação da pressão arterial na gestação
export function statusPressao(sis, dia) {
  if (sis >= 160 || dia >= 110) return { nivel: 'perigo', texto: 'Muito alta — procure atendimento' }
  if (sis >= 140 || dia >= 90) return { nivel: 'atencao', texto: 'Alta — avise sua equipe' }
  if (sis < 90 || dia < 60) return { nivel: 'atencao', texto: 'Baixa — atenção a tonturas' }
  return { nivel: 'ok', texto: 'Normal' }
}

export function filtrarPeriodo(lista, periodo, campoTs = 'ts') {
  if (periodo === 'todos') return lista
  const agora = new Date()
  const inicio = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate())
  if (periodo === 'semana') inicio.setDate(inicio.getDate() - 6)
  if (periodo === 'mes') inicio.setDate(inicio.getDate() - 29)
  return lista.filter((x) => x[campoTs] >= inicio.getTime())
}

export function baixarArquivo(nome, conteudo, tipo) {
  const url = URL.createObjectURL(new Blob([conteudo], { type: tipo }))
  const a = Object.assign(document.createElement('a'), { href: url, download: nome })
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export const saudacao = () => {
  const h = new Date().getHours()
  return h < 12 ? 'Bom dia' : h < 18 ? 'Boa tarde' : 'Boa noite'
}

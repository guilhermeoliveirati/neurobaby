// Estado do app guardado no aparelho (localStorage) e, opcionalmente, copiado para o Google Drive.
import { useSyncExternalStore } from 'react'

const KEY = 'neurobaby:dados'

export const ESTADO_INICIAL = {
  versao: 1,
  perfil: { nome: '', dum: '', dpp: '', nascimentoBebe: '', nomeBebe: '', sexoBebe: '' },
  glicemias: [],   // { id, ts, valor, momento, obs }
  medicacoes: [],  // { id, nome, dose, horario, obs, ativo }
  exames: [],      // { id, nome, data, resultado, obs }
  registros: [],   // { id, data, peso, pressao, obs }  (evolução da gestação)
  consultas: [],   // { id, data, hora, profissional, local, obs, feita }
  vacinas: {},     // { [idVacina]: 'aaaa-mm-dd' }
  marcos: {},      // { [idMarco]: 'aaaa-mm-dd' }
  notas: '',       // orientações nutricionais pessoais
  atualizadoEm: 0,
}

function carregar() {
  try {
    const bruto = localStorage.getItem(KEY)
    if (bruto) return normalizar(JSON.parse(bruto))
  } catch { /* armazenamento indisponível */ }
  return structuredClone(ESTADO_INICIAL)
}

export function normalizar(d) {
  const base = structuredClone(ESTADO_INICIAL)
  return { ...base, ...d, perfil: { ...base.perfil, ...(d?.perfil || {}) } }
}

let estado = carregar()
const ouvintes = new Set()
const aoSalvar = new Set()

function emitir() {
  ouvintes.forEach((fn) => fn())
}

export function getEstado() {
  return estado
}

export function setEstado(mudanca, { silencioso = false } = {}) {
  const novo = typeof mudanca === 'function' ? mudanca(estado) : { ...estado, ...mudanca }
  estado = { ...novo, atualizadoEm: Date.now() }
  try { localStorage.setItem(KEY, JSON.stringify(estado)) } catch { /* cheio ou bloqueado */ }
  emitir()
  if (!silencioso) aoSalvar.forEach((fn) => fn(estado))
}

export function substituirEstado(dados) {
  setEstado(() => normalizar(dados), { silencioso: true })
}

// Sair: apaga os dados deste aparelho e volta para a tela de boas-vindas
export function limparEstado() {
  estado = structuredClone(ESTADO_INICIAL)
  try { localStorage.removeItem(KEY) } catch { /* ignora */ }
  emitir()
}

export function onSalvar(fn) {
  aoSalvar.add(fn)
  return () => aoSalvar.delete(fn)
}

export function useEstado() {
  return useSyncExternalStore((fn) => { ouvintes.add(fn); return () => ouvintes.delete(fn) }, getEstado)
}

export const novoId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7)

// Helpers para listas: adicionar, atualizar e remover itens por id
export function addItem(lista, item) {
  setEstado((s) => ({ ...s, [lista]: [...s[lista], { id: novoId(), ...item }] }))
}
export function updItem(lista, id, campos) {
  setEstado((s) => ({ ...s, [lista]: s[lista].map((x) => (x.id === id ? { ...x, ...campos } : x)) }))
}
export function delItem(lista, id) {
  setEstado((s) => ({ ...s, [lista]: s[lista].filter((x) => x.id !== id) }))
}

// Mescla um backup importado com os dados atuais (itens com mesmo id são substituídos)
export function mesclar(atual, outro) {
  const o = normalizar(outro)
  const r = { ...atual }
  for (const k of ['glicemias', 'medicacoes', 'exames', 'registros', 'consultas']) {
    const mapa = new Map(atual[k].map((x) => [x.id, x]))
    o[k].forEach((x) => mapa.set(x.id, x))
    r[k] = [...mapa.values()]
  }
  r.vacinas = { ...atual.vacinas, ...o.vacinas }
  r.marcos = { ...atual.marcos, ...o.marcos }
  r.perfil = { ...o.perfil, ...Object.fromEntries(Object.entries(atual.perfil).filter(([, v]) => v)) }
  r.notas = atual.notas || o.notas
  return r
}

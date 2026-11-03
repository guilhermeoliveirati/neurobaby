// Backup no Google Drive (pasta oculta appDataFolder, visível só para o app), como no app Glicose.
import { getEstado, onSalvar } from './store'

const ARQUIVO = 'neurobaby-backup.json'
const ESCOPO = 'https://www.googleapis.com/auth/drive.appdata'
const CFG_KEY = 'neurobaby:drive'
const API = 'https://www.googleapis.com/drive/v3/files'
const UPLOAD = 'https://www.googleapis.com/upload/drive/v3/files'

let token = null
let expiraEm = 0
let tokenClient = null
let timer = null
const ouvintes = new Set()

function lerCfg() {
  try { return JSON.parse(localStorage.getItem(CFG_KEY)) || {} } catch { return {} }
}
function gravarCfg(campos) {
  const cfg = { ...lerCfg(), ...campos }
  try { localStorage.setItem(CFG_KEY, JSON.stringify(cfg)) } catch { /* ignora */ }
  ouvintes.forEach((fn) => fn())
  return cfg
}

export function statusDrive() {
  const cfg = lerCfg()
  return {
    clientId: cfg.clientId || import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
    conectado: !!cfg.conectado,
    ultimoSync: cfg.ultimoSync || 0,
    pendente: !!cfg.pendente,
    tokenValido: tokenValido(),
    erro: cfg.erro || '',
  }
}
export function onDrive(fn) {
  ouvintes.add(fn)
  return () => ouvintes.delete(fn)
}
export function salvarClientId(clientId) {
  tokenClient = null
  gravarCfg({ clientId: clientId.trim() })
}

const tokenValido = () => !!token && Date.now() < expiraEm - 60_000

function carregarGis() {
  if (window.google?.accounts?.oauth2) return Promise.resolve()
  return new Promise((ok, falha) => {
    const s = document.createElement('script')
    s.src = 'https://accounts.google.com/gsi/client'
    s.onload = ok
    s.onerror = () => falha(new Error('Não foi possível carregar o login do Google (sem internet?)'))
    document.head.appendChild(s)
  })
}

// Precisa ser chamado a partir de um toque do usuário (abre a janela do Google)
async function pedirToken(consentimento) {
  const { clientId } = statusDrive()
  if (!clientId) throw new Error('Configure o ID do cliente OAuth do Google primeiro.')
  await carregarGis()
  return new Promise((ok, falha) => {
    tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: ESCOPO,
      callback: (r) => {
        if (r.error) return falha(new Error(r.error_description || r.error))
        token = r.access_token
        expiraEm = Date.now() + (Number(r.expires_in) || 3600) * 1000
        ok(token)
      },
      error_callback: (e) => falha(new Error(e?.message || 'Login cancelado')),
    })
    tokenClient.requestAccessToken({ prompt: consentimento ? 'consent' : '' })
  })
}

async function garantirToken() {
  if (tokenValido()) return token
  return pedirToken(false)
}

async function api(url, opts = {}) {
  const r = await fetch(url, { ...opts, headers: { Authorization: `Bearer ${token}`, ...(opts.headers || {}) } })
  if (r.status === 401) { token = null; throw new Error('Sessão do Google expirou. Toque em Sincronizar.') }
  if (!r.ok) throw new Error(`Google Drive respondeu ${r.status}`)
  return r
}

async function acharArquivo() {
  const q = encodeURIComponent(`name='${ARQUIVO}'`)
  const r = await api(`${API}?spaces=appDataFolder&q=${q}&fields=files(id,modifiedTime)`)
  const { files } = await r.json()
  return files?.[0] || null
}

async function enviar(dados) {
  const corpo = JSON.stringify(dados)
  const existente = await acharArquivo()
  if (existente) {
    await api(`${UPLOAD}/${existente.id}?uploadType=media`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: corpo,
    })
  } else {
    const form = new FormData()
    form.append('metadata', new Blob([JSON.stringify({ name: ARQUIVO, parents: ['appDataFolder'] })], { type: 'application/json' }))
    form.append('file', new Blob([corpo], { type: 'application/json' }))
    await api(`${UPLOAD}?uploadType=multipart`, { method: 'POST', body: form })
  }
  gravarCfg({ ultimoSync: Date.now(), pendente: false, erro: '' })
}

export async function conectar() {
  await pedirToken(true)
  gravarCfg({ conectado: true, erro: '' })
  await enviar(getEstado())
}

export function desconectar() {
  if (token && window.google?.accounts?.oauth2) window.google.accounts.oauth2.revoke(token)
  token = null
  gravarCfg({ conectado: false, pendente: false })
}

export async function sincronizar() {
  await garantirToken()
  await enviar(getEstado())
}

export async function baixarDoDrive() {
  await garantirToken()
  const arq = await acharArquivo()
  if (!arq) throw new Error('Nenhum backup do NeuroBaby encontrado neste Google Drive.')
  const r = await api(`${API}/${arq.id}?alt=media`)
  return r.json()
}

// Depois de cada alteração, envia para o Drive se a sessão do Google ainda estiver ativa.
// Sem sessão ativa (o token dura ~1h), marca como pendente para o usuário sincronizar com um toque.
onSalvar(() => {
  if (!lerCfg().conectado) return
  clearTimeout(timer)
  timer = setTimeout(async () => {
    if (!tokenValido()) return gravarCfg({ pendente: true })
    try { await enviar(getEstado()) } catch (e) { gravarCfg({ pendente: true, erro: e.message }) }
  }, 2500)
})

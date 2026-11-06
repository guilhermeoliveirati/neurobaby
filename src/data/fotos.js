// Fotos dos exames: ficam no IndexedDB do aparelho (o localStorage é pequeno demais para imagens)
// e, com o Google Drive conectado, também vão para a pasta oculta do app no Drive.
import { useEffect, useState } from 'react'
import { novoId } from './store'

const BANCO = 'neurobaby-fotos'
let db = null

function abrir() {
  if (db) return Promise.resolve(db)
  return new Promise((ok, falha) => {
    const r = indexedDB.open(BANCO, 1)
    r.onupgradeneeded = () => r.result.createObjectStore('fotos')
    r.onsuccess = () => { db = r.result; ok(db) }
    r.onerror = () => falha(r.error)
  })
}

async function tx(modo, fn) {
  const banco = await abrir()
  return new Promise((ok, falha) => {
    const t = banco.transaction('fotos', modo)
    const req = fn(t.objectStore('fotos'))
    t.oncomplete = () => ok(req?.result)
    t.onerror = () => falha(t.error)
  })
}

export const lerFoto = (id) => tx('readonly', (s) => s.get(id))
export const gravarFoto = (id, blob) => tx('readwrite', (s) => s.put(blob, id))
export const apagarFoto = (id) => tx('readwrite', (s) => s.delete(id))
export const temFoto = async (id) => !!(await lerFoto(id))
export const apagarTodasFotos = () => tx('readwrite', (s) => s.clear())

// Reduz a foto (máx. 1600 px, JPEG) para caber bem no aparelho e no Drive
export async function comprimir(arquivo, max = 1600) {
  const img = await createImageBitmap(arquivo).catch(() => null)
  if (!img) return arquivo
  const escala = Math.min(1, max / Math.max(img.width, img.height))
  const c = document.createElement('canvas')
  c.width = Math.round(img.width * escala)
  c.height = Math.round(img.height * escala)
  c.getContext('2d').drawImage(img, 0, 0, c.width, c.height)
  return new Promise((ok) => c.toBlob((b) => ok(b || arquivo), 'image/jpeg', 0.82))
}

export async function salvarFotos(arquivos) {
  const ids = []
  for (const a of arquivos) {
    const id = `f${novoId()}`
    await gravarFoto(id, await comprimir(a))
    ids.push(id)
  }
  return ids
}

export function useFotoUrl(id) {
  const [url, setUrl] = useState('')
  useEffect(() => {
    let u = ''
    let vivo = true
    lerFoto(id).then((b) => { if (b && vivo) { u = URL.createObjectURL(b); setUrl(u) } }).catch(() => {})
    return () => { vivo = false; if (u) URL.revokeObjectURL(u) }
  }, [id])
  return url
}

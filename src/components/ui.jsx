import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { ChevronLeft, ChevronRight, X, Home, Footprints, Brain, User } from 'lucide-react'

// Roteador por hash: '#/diabetes/glicemia' -> ['diabetes', 'glicemia']
export function useRota() {
  const ler = () => window.location.hash.replace(/^#\/?/, '').split('/').filter(Boolean)
  const [rota, setRota] = useState(ler)
  useEffect(() => {
    const fn = () => { setRota(ler()); window.scrollTo(0, 0) }
    window.addEventListener('hashchange', fn)
    return () => window.removeEventListener('hashchange', fn)
  }, [])
  return rota
}
export const ir = (caminho) => { window.location.hash = `/${caminho}` }
export const voltar = (padrao = 'inicio') => {
  if (window.history.length > 1) window.history.back()
  else ir(padrao)
}

export function Topo({ titulo, icone, direita, semVoltar }) {
  return (
    <header className="topo">
      {semVoltar ? <span className="topo-lado" /> : (
        <button className="topo-lado icone-btn" onClick={() => voltar()} aria-label="Voltar"><ChevronLeft size={24} /></button>
      )}
      <h1 className="topo-titulo">{icone}{titulo}</h1>
      <span className="topo-lado">{direita}</span>
    </header>
  )
}

const ABAS = [
  ['inicio', 'Início', Home],
  ['gestacao', 'Minha Jornada', Footprints],
  ['desenvolvimento', 'Desenvolvimento', Brain],
  ['mais', 'Perfil', User],
]

export function Navegacao({ atual }) {
  return (
    <nav className="nav">
      {ABAS.map(([id, nome, Ic]) => (
        <a key={id} href={`#/${id}`} className={`nav-item ${atual === id ? 'ativo' : ''}`}>
          <Ic size={22} strokeWidth={atual === id ? 2.4 : 1.8} />
          <span>{nome}</span>
        </a>
      ))}
    </nav>
  )
}

export function Abas({ opcoes, valor, onChange }) {
  return (
    <div className="abas" role="tablist">
      {opcoes.map(([id, nome]) => (
        <button key={id} role="tab" aria-selected={valor === id} className={valor === id ? 'ativa' : ''} onClick={() => onChange(id)}>
          {nome}
        </button>
      ))}
    </div>
  )
}

export function ItemLista({ icone, cor = 'rosa', titulo, sub, onClick, href, direita }) {
  const Tag = href ? 'a' : 'button'
  return (
    <Tag className="item-lista" href={href} onClick={onClick}>
      {icone && <span className={`item-icone bg-${cor}`}>{icone}</span>}
      <span className="item-texto">
        <strong>{titulo}</strong>
        {sub && <small>{sub}</small>}
      </span>
      {direita ?? <ChevronRight size={20} className="muted" />}
    </Tag>
  )
}

export function Folha({ titulo, aberta, onFechar, children }) {
  useEffect(() => {
    if (!aberta) return
    const fn = (e) => e.key === 'Escape' && onFechar()
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [aberta, onFechar])
  if (!aberta) return null
  // Portal no body: fica acima da navegação inferior e fora da animação da tela
  return createPortal(
    <div className="folha-fundo" onClick={onFechar}>
      <div className="folha" role="dialog" aria-modal="true" aria-label={titulo} onClick={(e) => e.stopPropagation()}>
        <div className="folha-topo">
          <h2>{titulo}</h2>
          <button className="icone-btn" onClick={onFechar} aria-label="Fechar"><X size={22} /></button>
        </div>
        {children}
      </div>
    </div>,
    document.body
  )
}

export function Campo({ rotulo, children }) {
  return (
    <label className="campo">
      <span>{rotulo}</span>
      {children}
    </label>
  )
}

export function Vazio({ children }) {
  return <p className="vazio">{children}</p>
}

// Gráfico de linha simples em SVG; faixa opcional destaca a meta.
// Usa a largura real do cartão: no tablet o gráfico fica mais largo em vez de só ampliar.
export function GraficoLinha({ pontos, meta, unidade = '', altura = 160 }) {
  const caixa = useRef(null)
  const [largura, setLargura] = useState(320)
  useEffect(() => {
    if (!caixa.current || typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(([e]) => setLargura(Math.max(280, Math.round(e.contentRect.width))))
    ro.observe(caixa.current)
    return () => ro.disconnect()
  }, [])
  return (
    <div ref={caixa}>
      {pontos.length < 2
        ? <Vazio>Registre ao menos 2 valores para ver o gráfico.</Vazio>
        : <Linha pontos={pontos} meta={meta} unidade={unidade} L={largura} A={largura > 520 ? Math.round(altura * 1.4) : altura} />}
    </div>
  )
}

function Linha({ pontos, meta, unidade, L, A }) {
  const pad = { e: 34, d: 10, t: 12, b: 22 }
  const xs = pontos.map((p) => p.x), ys = pontos.map((p) => p.y)
  const minX = Math.min(...xs), maxX = Math.max(...xs)
  const minY = Math.floor(Math.min(...ys, meta ?? Infinity) * 0.9), maxY = Math.ceil(Math.max(...ys, meta ?? -Infinity) * 1.08)
  const px = (x) => pad.e + ((x - minX) / (maxX - minX || 1)) * (L - pad.e - pad.d)
  const py = (y) => A - pad.b - ((y - minY) / (maxY - minY || 1)) * (A - pad.t - pad.b)
  const d = pontos.map((p, i) => `${i ? 'L' : 'M'}${px(p.x).toFixed(1)},${py(p.y).toFixed(1)}`).join(' ')
  const marcas = [minY, Math.round((minY + maxY) / 2), maxY]
  return (
    <svg viewBox={`0 0 ${L} ${A}`} className="grafico" role="img" aria-label="Gráfico de evolução">
      {marcas.map((v) => (
        <g key={v}>
          <line x1={pad.e} x2={L - pad.d} y1={py(v)} y2={py(v)} className="grade" />
          <text x={pad.e - 6} y={py(v) + 4} textAnchor="end" className="eixo">{v}</text>
        </g>
      ))}
      {meta != null && <line x1={pad.e} x2={L - pad.d} y1={py(meta)} y2={py(meta)} className="linha-meta" />}
      <path d={d} className="linha" />
      {pontos.map((p, i) => (
        <circle key={i} cx={px(p.x)} cy={py(p.y)} r="3.5" className={`ponto ${p.classe || ''}`}>
          <title>{`${p.rotulo ?? ''} ${p.y}${unidade}`}</title>
        </circle>
      ))}
      <text x={pad.e} y={A - 4} className="eixo">{pontos[0].rotuloX}</text>
      <text x={L - pad.d} y={A - 4} textAnchor="end" className="eixo">{pontos[pontos.length - 1].rotuloX}</text>
    </svg>
  )
}

import { useRef, useState } from 'react'
import { Info, Heart, Trash2, Download, Plus, Pill, Camera, FileText, X } from 'lucide-react'
import { useEstado, addItem, delItem, updItem, setEstado } from '../data/store'
import { MOMENTOS, ORIENTACOES } from '../data/conteudo'
import { REF_PRESSAO, SINAIS_PRESSAO } from '../data/guias'
import { salvarFotos, apagarFoto, useFotoUrl } from '../data/fotos'
import { statusPressao, statusGlicemia, momento, filtrarPeriodo, fmtDataHora, fmtData, hojeISO, baixarArquivo, gestacao, parseData } from '../utils'
import { Topo, ItemLista, Folha, Campo, Vazio, GraficoLinha, Abas, ir } from '../components/ui'

export default function Diabetes({ sub }) {
  if (sub === 'glicemia') return <Glicemia />
  if (sub === 'pressao') return <Pressao />
  if (sub === 'medicacoes') return <Medicacoes />
  if (sub === 'exames') return <Exames />
  if (sub === 'nutricao') return <Nutricao />
  if (sub === 'evolucao') return <Evolucao />
  return <Menu />
}

function Menu() {
  const s = useEstado()
  const [info, setInfo] = useState(false)
  return (
    <div className="tela">
      <Topo titulo="Caderneta do Diabetes" icone={<span className="gota">💧</span>}
        direita={<button className="icone-btn" onClick={() => setInfo(true)} aria-label="Sobre a caderneta"><Info size={22} /></button>} />
      <div className="card card-rosa intro">
        <p>Aqui você registra glicemia, pressão, medicações e exames da sua gestação.</p>
        <Heart size={22} className="rosa" />
      </div>
      <div className="lista">
        <ItemLista icone="🩸" titulo="Controle Glicêmico" sub={`${s.glicemias.length} medições`} href="#/diabetes/glicemia" />
        <ItemLista icone="🩺" cor="lilas" titulo="Pressão Arterial" sub={`${s.pressoes.length} aferições`} href="#/diabetes/pressao" />
        <ItemLista icone="💊" cor="lilas" titulo="Medicações" sub={`${s.medicacoes.filter((m) => m.ativo !== false).length} em uso`} href="#/diabetes/medicacoes" />
        <ItemLista icone="🧪" cor="azul" titulo="Exames" sub={`${s.exames.length} registrados`} href="#/diabetes/exames" />
        <ItemLista icone="🍎" cor="verde" titulo="Orientações Nutricionais" href="#/diabetes/nutricao" />
        <ItemLista icone="🤰" cor="rosa" titulo="Evolução da Gestação" href="#/diabetes/evolucao" />
      </div>
      <div className="card card-lilas alerta">
        <span>⭐</span>
        <p>Lembre-se: em caso de glicemia acima de 200 mg/dL, procure atendimento médico.</p>
      </div>
      <Folha titulo="Metas de referência" aberta={info} onFechar={() => setInfo(false)}>
        <ul className="metas">
          <li><strong>Jejum e antes das refeições</strong><span>&lt; 95 mg/dL</span></li>
          <li><strong>1 hora após as refeições</strong><span>&lt; 140 mg/dL</span></li>
          <li><strong>2 horas após as refeições</strong><span>&lt; 120 mg/dL</span></li>
        </ul>
        <p className="muted">Metas usuais para diabetes gestacional (SBD/ADA). Siga sempre as metas definidas pela sua equipe de saúde.</p>
      </Folha>
    </div>
  )
}

function Glicemia() {
  const s = useEstado()
  const [periodo, setPeriodo] = useState('semana')
  const [grupo, setGrupo] = useState('todos')
  const [form, setForm] = useState(false)

  const filtradas = filtrarPeriodo(s.glicemias, periodo)
    .filter((g) => grupo === 'todos' || (grupo === 'jejum' ? g.momento === 'jejum' : g.momento.startsWith(grupo)))
    .sort((a, b) => a.ts - b.ts)
  const media = filtradas.length ? Math.round(filtradas.reduce((t, g) => t + g.valor, 0) / filtradas.length) : null
  const naMeta = filtradas.filter((g) => statusGlicemia(g.valor, g.momento).nivel === 'ok').length
  const metaGrupo = { jejum: 95, '1h': 140, '2h': 120 }[grupo]

  const pontos = filtradas.map((g) => ({
    x: g.ts, y: g.valor, rotulo: `${fmtDataHora(g.ts)} · ${momento(g.momento).nome}`,
    rotuloX: fmtDataHora(g.ts).slice(0, 5), classe: `nivel-${statusGlicemia(g.valor, g.momento).nivel}`,
  }))

  function exportar() {
    const linhas = [['data', 'hora', 'momento', 'mg_dl', 'status', 'observacao', 'timestamp']]
    ;[...s.glicemias].sort((a, b) => a.ts - b.ts).forEach((g) => {
      const d = new Date(g.ts)
      linhas.push([d.toLocaleDateString('pt-BR'), d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        momento(g.momento).nome, g.valor, statusGlicemia(g.valor, g.momento).texto, (g.obs || '').replace(/[;\n]/g, ' '), g.ts])
    })
    baixarArquivo(`neurobaby-glicemias-${hojeISO()}.csv`, '﻿' + linhas.map((l) => l.join(';')).join('\n'), 'text/csv')
  }

  return (
    <div className="tela">
      <Topo titulo="Controle Glicêmico" direita={<button className="icone-btn" onClick={exportar} aria-label="Exportar CSV" title="Exportar CSV"><Download size={20} /></button>} />
      <button className="btn btn-primario btn-largo" onClick={() => setForm(true)}><Plus size={18} /> Nova medição</button>

      <Abas opcoes={[['dia', 'Dia'], ['semana', 'Semana'], ['mes', 'Mês'], ['todos', 'Todos']]} valor={periodo} onChange={setPeriodo} />
      <div className="chips">
        {[['todos', 'Todas'], ['jejum', 'Jejum'], ['1h', '1h após'], ['2h', '2h após']].map(([id, n]) => (
          <button key={id} className={grupo === id ? 'ativo' : ''} onClick={() => setGrupo(id)}>{n}</button>
        ))}
      </div>

      <div className="resumo-linha">
        <div className="card mini"><small>Média</small><strong>{media ?? '—'} <em>mg/dL</em></strong></div>
        <div className="card mini"><small>Na meta</small><strong>{filtradas.length ? Math.round((naMeta / filtradas.length) * 100) : '—'}<em>%</em></strong></div>
        <div className="card mini"><small>Medições</small><strong>{filtradas.length}</strong></div>
      </div>
      <div className="card"><GraficoLinha pontos={pontos} meta={metaGrupo} unidade=" mg/dL" /></div>

      <h2 className="titulo-secao">Medições</h2>
      {filtradas.length === 0 ? <Vazio>Nenhuma medição neste período.</Vazio> : <div className="registros">{[...filtradas].reverse().map((g) => {
        const st = statusGlicemia(g.valor, g.momento)
        return (
          <div key={g.id} className={`card registro borda-${st.nivel}`}>
            <div>
              <strong>{g.valor} mg/dL <span className={`selo nivel-${st.nivel}`}>{st.texto}</span></strong>
              <small>{fmtDataHora(g.ts)} · {momento(g.momento).nome}</small>
              {g.obs && <p>{g.obs}</p>}
            </div>
            <button className="icone-btn" onClick={() => confirm('Excluir esta medição?') && delItem('glicemias', g.id)} aria-label="Excluir"><Trash2 size={18} /></button>
          </div>
        )
      })}</div>}
      <FormGlicemia aberta={form} onFechar={() => setForm(false)} />
    </div>
  )
}

function agoraLocal() {
  const d = new Date()
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset())
  return d.toISOString().slice(0, 16)
}

function momentoProvavel() {
  const h = new Date().getHours()
  if (h < 9) return 'jejum'
  if (h < 11) return '1h_cafe'
  if (h < 15) return '1h_almoco'
  if (h < 19) return 'pre_jantar'
  if (h < 22) return '1h_jantar'
  return 'dormir'
}

function FormGlicemia({ aberta, onFechar }) {
  const [f, setF] = useState(() => ({ valor: '', momento: momentoProvavel(), quando: agoraLocal(), obs: '' }))
  const muda = (k) => (e) => setF({ ...f, [k]: e.target.value })
  const v = Number(f.valor)
  const st = v > 0 ? statusGlicemia(v, f.momento) : null
  function salvar(e) {
    e.preventDefault()
    addItem('glicemias', { valor: v, momento: f.momento, ts: new Date(f.quando).getTime(), obs: f.obs })
    setF({ valor: '', momento: momentoProvavel(), quando: agoraLocal(), obs: '' })
    onFechar()
  }
  return (
    <Folha titulo="Nova medição" aberta={aberta} onFechar={onFechar}>
      <form className="form" onSubmit={salvar}>
        <Campo rotulo="Glicemia (mg/dL)">
          <input className="input-grande" type="number" inputMode="numeric" min="20" max="600" required autoFocus value={f.valor} onChange={muda('valor')} />
        </Campo>
        {st && <p className={`selo-grande nivel-${st.nivel}`}>{st.texto}</p>}
        <Campo rotulo="Momento">
          <select value={f.momento} onChange={muda('momento')}>
            {MOMENTOS.map((m) => <option key={m.id} value={m.id}>{m.nome} (meta &lt; {m.meta})</option>)}
          </select>
        </Campo>
        <Campo rotulo="Data e hora"><input type="datetime-local" required value={f.quando} onChange={muda('quando')} /></Campo>
        <Campo rotulo="Observação"><input value={f.obs} onChange={muda('obs')} placeholder="Ex.: comi pão no café" /></Campo>
        <button className="btn btn-primario btn-largo">Salvar medição</button>
      </form>
    </Folha>
  )
}

function Pressao() {
  const s = useEstado()
  const [periodo, setPeriodo] = useState('semana')
  const [form, setForm] = useState(false)
  const [info, setInfo] = useState(false)

  const filtradas = filtrarPeriodo(s.pressoes, periodo).sort((a, b) => a.ts - b.ts)
  const media = (k) => (filtradas.length ? Math.round(filtradas.reduce((t, p) => t + p[k], 0) / filtradas.length) : null)
  const normais = filtradas.filter((p) => statusPressao(p.sis, p.dia).nivel === 'ok').length
  const ponto = (p, k) => ({ x: p.ts, y: p[k], rotulo: fmtDataHora(p.ts), rotuloX: fmtDataHora(p.ts).slice(0, 5), classe: `nivel-${statusPressao(p.sis, p.dia).nivel}` })

  function exportar() {
    const linhas = [['data', 'hora', 'sistolica', 'diastolica', 'pulso', 'status', 'observacao']]
    ;[...s.pressoes].sort((a, b) => a.ts - b.ts).forEach((p) => {
      const d = new Date(p.ts)
      linhas.push([d.toLocaleDateString('pt-BR'), d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        p.sis, p.dia, p.pulso || '', statusPressao(p.sis, p.dia).texto, (p.obs || '').replace(/[;\n]/g, ' ')])
    })
    baixarArquivo(`neurobaby-pressao-${hojeISO()}.csv`, '﻿' + linhas.map((l) => l.join(';')).join('\n'), 'text/csv')
  }

  return (
    <div className="tela">
      <Topo titulo="Pressão Arterial" direita={
        <button className="icone-btn" onClick={exportar} aria-label="Exportar CSV" title="Exportar CSV"><Download size={20} /></button>} />
      <button className="btn btn-primario btn-largo" onClick={() => setForm(true)}><Plus size={18} /> Nova aferição</button>
      <Abas opcoes={[['dia', 'Dia'], ['semana', 'Semana'], ['mes', 'Mês'], ['todos', 'Todos']]} valor={periodo} onChange={setPeriodo} />

      <div className="resumo-linha">
        <div className="card mini"><small>Média</small><strong>{media('sis') ?? '—'}{filtradas.length ? <em> x {media('dia')}</em> : null}</strong></div>
        <div className="card mini"><small>Normais</small><strong>{filtradas.length ? Math.round((normais / filtradas.length) * 100) : '—'}<em>%</em></strong></div>
        <div className="card mini"><small>Aferições</small><strong>{filtradas.length}</strong></div>
      </div>
      <div className="card">
        <GraficoLinha pontos={filtradas.map((p) => ponto(p, 'sis'))} meta={140} pontos2={filtradas.map((p) => ponto(p, 'dia'))} meta2={90} unidade=" mmHg" />
        {filtradas.length >= 2 && <p className="legenda"><i className="l1" />Máxima <i className="l2" />Mínima <i className="lm" />Limite 140 x 90</p>}
      </div>

      <h2 className="titulo-secao">Aferições</h2>
      {filtradas.length === 0 ? <Vazio>Nenhuma aferição neste período.</Vazio> : <div className="registros">{[...filtradas].reverse().map((p) => {
        const st = statusPressao(p.sis, p.dia)
        return (
          <div key={p.id} className={`card registro borda-${st.nivel}`}>
            <div>
              <strong>{p.sis} x {p.dia} <span className={`selo nivel-${st.nivel}`}>{st.texto}</span></strong>
              <small>{fmtDataHora(p.ts)}{p.pulso ? ` · pulso ${p.pulso} bpm` : ''}</small>
              {p.obs && <p>{p.obs}</p>}
            </div>
            <button className="icone-btn" onClick={() => confirm('Excluir esta aferição?') && delItem('pressoes', p.id)} aria-label="Excluir"><Trash2 size={18} /></button>
          </div>
        )
      })}</div>}

      <button className="card card-rosa alerta-pressao" onClick={() => setInfo(true)}>
        <strong>⚠️ Valores de referência e sinais de alerta</strong>
        <Info size={18} />
      </button>

      <FormPressao aberta={form} onFechar={() => setForm(false)} />
      <Folha titulo="Pressão na gestação" aberta={info} onFechar={() => setInfo(false)}>
        <ul className="metas">{REF_PRESSAO.map(([n, v, nivel]) => <li key={n}><strong className={`selo nivel-${nivel}`}>{n}</strong><span>{v}</span></li>)}</ul>
        <p className="selo-grande nivel-perigo pequeno">{SINAIS_PRESSAO}</p>
        <p className="muted pequeno">Afira sentada, depois de 5 minutos de descanso, com o braço apoiado na altura do coração e sem conversar. Siga sempre a orientação da sua equipe de saúde.</p>
      </Folha>
    </div>
  )
}

function FormPressao({ aberta, onFechar }) {
  const vazio = () => ({ sis: '', dia: '', pulso: '', quando: agoraLocal(), obs: '' })
  const [f, setF] = useState(vazio)
  const muda = (k) => (e) => setF({ ...f, [k]: e.target.value })
  const sis = Number(f.sis), dia = Number(f.dia)
  const st = sis > 0 && dia > 0 ? statusPressao(sis, dia) : null
  function salvar(e) {
    e.preventDefault()
    addItem('pressoes', { sis, dia, pulso: Number(f.pulso) || null, ts: new Date(f.quando).getTime(), obs: f.obs })
    setF(vazio())
    onFechar()
  }
  return (
    <Folha titulo="Nova aferição" aberta={aberta} onFechar={onFechar}>
      <form className="form" onSubmit={salvar}>
        <div className="pressao-campos">
          <Campo rotulo="Máxima"><input className="input-grande" type="number" inputMode="numeric" min="50" max="260" required autoFocus value={f.sis} onChange={muda('sis')} placeholder="120" /></Campo>
          <span className="x">x</span>
          <Campo rotulo="Mínima"><input className="input-grande" type="number" inputMode="numeric" min="30" max="180" required value={f.dia} onChange={muda('dia')} placeholder="80" /></Campo>
        </div>
        <p className="dica-campo">No aparelho: 120 x 80 é o mesmo que "12 por 8".</p>
        {st && <p className={`selo-grande nivel-${st.nivel}`}>{st.texto}</p>}
        <div className="duas-col">
          <Campo rotulo="Pulso (opcional)"><input type="number" inputMode="numeric" min="30" max="220" value={f.pulso} onChange={muda('pulso')} placeholder="bpm" /></Campo>
          <Campo rotulo="Data e hora"><input type="datetime-local" required value={f.quando} onChange={muda('quando')} /></Campo>
        </div>
        <Campo rotulo="Observação"><input value={f.obs} onChange={muda('obs')} placeholder="Ex.: com dor de cabeça" /></Campo>
        <button className="btn btn-primario btn-largo">Salvar aferição</button>
      </form>
    </Folha>
  )
}

function Medicacoes() {
  const s = useEstado()
  const [form, setForm] = useState(false)
  const [f, setF] = useState({ nome: '', dose: '', horario: '', obs: '' })
  const muda = (k) => (e) => setF({ ...f, [k]: e.target.value })
  function salvar(e) {
    e.preventDefault()
    addItem('medicacoes', { ...f, ativo: true })
    setF({ nome: '', dose: '', horario: '', obs: '' })
    setForm(false)
  }
  return (
    <div className="tela">
      <Topo titulo="Medicações" />
      <button className="btn btn-primario btn-largo" onClick={() => setForm(true)}><Plus size={18} /> Adicionar medicação</button>
      {s.medicacoes.length === 0 ? <Vazio>Nenhuma medicação cadastrada. Inclua insulina, metformina, vitaminas e suplementos.</Vazio> : <div className="registros">{s.medicacoes.map((m) => (
        <div key={m.id} className={`card registro ${m.ativo === false ? 'inativo' : ''}`}>
          <Pill size={22} className="lilas" />
          <div>
            <strong>{m.nome}</strong>
            <small>{[m.dose, m.horario].filter(Boolean).join(' · ')}</small>
            {m.obs && <p>{m.obs}</p>}
          </div>
          <label className="interruptor" title={m.ativo === false ? 'Suspensa' : 'Em uso'}>
            <input type="checkbox" checked={m.ativo !== false} onChange={(e) => updItem('medicacoes', m.id, { ativo: e.target.checked })} />
            <span />
          </label>
          <button className="icone-btn" onClick={() => confirm('Excluir esta medicação?') && delItem('medicacoes', m.id)} aria-label="Excluir"><Trash2 size={18} /></button>
        </div>
      ))}</div>}
      <Folha titulo="Nova medicação" aberta={form} onFechar={() => setForm(false)}>
        <form className="form" onSubmit={salvar}>
          <Campo rotulo="Nome"><input required value={f.nome} onChange={muda('nome')} placeholder="Ex.: Insulina NPH" /></Campo>
          <div className="duas-col">
            <Campo rotulo="Dose"><input value={f.dose} onChange={muda('dose')} placeholder="Ex.: 10 UI" /></Campo>
            <Campo rotulo="Horário(s)"><input value={f.horario} onChange={muda('horario')} placeholder="Ex.: 7h e 22h" /></Campo>
          </div>
          <Campo rotulo="Observação"><input value={f.obs} onChange={muda('obs')} /></Campo>
          <button className="btn btn-primario btn-largo">Salvar</button>
        </form>
      </Folha>
    </div>
  )
}

function Exames() {
  const s = useEstado()
  const [form, setForm] = useState(false)
  const [ver, setVer] = useState(null)
  const vazio = { nome: '', data: hojeISO(), resultado: '', obs: '', fotos: [] }
  const [f, setF] = useState(vazio)
  const [salvando, setSalvando] = useState(false)
  const camera = useRef()
  const galeria = useRef()
  const muda = (k) => (e) => setF({ ...f, [k]: e.target.value })
  const lista = [...s.exames].sort((a, b) => b.data.localeCompare(a.data))

  async function addFotos(e) {
    const arqs = [...(e.target.files || [])]
    e.target.value = ''
    if (!arqs.length) return
    setSalvando(true)
    try {
      const ids = await salvarFotos(arqs)
      setF((x) => ({ ...x, fotos: [...x.fotos, ...ids] }))
    } catch { alert('Não foi possível salvar a foto neste aparelho.') }
    setSalvando(false)
  }
  function tirarFoto(id) {
    apagarFoto(id).catch(() => {})
    setF((x) => ({ ...x, fotos: x.fotos.filter((y) => y !== id) }))
  }
  function salvar(e) {
    e.preventDefault()
    addItem('exames', f)
    setF(vazio)
    setForm(false)
  }
  function fechar() {
    f.fotos.forEach((id) => apagarFoto(id).catch(() => {}))
    setF(vazio)
    setForm(false)
  }
  function excluir(x) {
    if (!confirm('Excluir este exame e suas fotos?')) return
    ;(x.fotos || []).forEach((id) => apagarFoto(id).catch(() => {}))
    delItem('exames', x.id)
  }

  return (
    <div className="tela">
      <Topo titulo="Exames" direita={<button className="icone-btn" onClick={() => ir('relatorio')} aria-label="Relatório para o médico" title="Relatório"><FileText size={20} /></button>} />
      <button className="btn btn-primario btn-largo" onClick={() => setForm(true)}><Camera size={18} /> Registrar exame (com foto)</button>
      {lista.length > 0 && <button className="btn btn-largo" onClick={() => ir('relatorio')}><FileText size={18} /> Gerar relatório para o médico</button>}
      {lista.length === 0 ? <Vazio>Nenhum exame registrado. Tire uma foto do resultado e anote o principal: o app junta tudo num relatório.</Vazio> : <div className="registros">{lista.map((x) => (
        <div key={x.id} className="card registro exame">
          <span className="item-icone bg-azul">🧪</span>
          <div>
            <strong>{x.nome}</strong>
            <small>{fmtData(x.data)}{x.resultado && ` · ${x.resultado}`}</small>
            {x.obs && <p>{x.obs}</p>}
            {x.fotos?.length > 0 && <div className="miniaturas">{x.fotos.map((id) => <Miniatura key={id} id={id} onClick={() => setVer(id)} />)}</div>}
          </div>
          <button className="icone-btn" onClick={() => excluir(x)} aria-label="Excluir"><Trash2 size={18} /></button>
        </div>
      ))}</div>}

      <Folha titulo="Registrar exame" aberta={form} onFechar={fechar}>
        <form className="form" onSubmit={salvar}>
          <div className="fotos-form">
            {f.fotos.map((id) => (
              <span key={id} className="foto-item"><Miniatura id={id} /><button type="button" onClick={() => tirarFoto(id)} aria-label="Remover foto"><X size={14} /></button></span>
            ))}
            <button type="button" className="foto-add" onClick={() => camera.current.click()} disabled={salvando}><Camera size={22} />{salvando ? 'Salvando…' : 'Tirar foto'}</button>
            <button type="button" className="foto-add" onClick={() => galeria.current.click()} disabled={salvando}><Plus size={22} />Da galeria</button>
            <input ref={camera} type="file" accept="image/*" capture="environment" hidden onChange={addFotos} />
            <input ref={galeria} type="file" accept="image/*" multiple hidden onChange={addFotos} />
          </div>
          <Campo rotulo="Exame">
            <input required list="exames-comuns" value={f.nome} onChange={muda('nome')} />
            <datalist id="exames-comuns">
              {['Glicemia de jejum', 'TOTG 75g (curva glicêmica)', 'Hemoglobina glicada (HbA1c)', 'Ultrassom obstétrico', 'Ultrassom morfológico', 'Hemograma', 'Urina tipo 1', 'Urocultura', 'TSH', 'Tipagem sanguínea', 'Sorologias (HIV, sífilis, hepatites)', 'Toxoplasmose', 'Cultura para estreptococo B'].map((n) => <option key={n} value={n} />)}
            </datalist>
          </Campo>
          <div className="duas-col">
            <Campo rotulo="Data"><input type="date" required value={f.data} onChange={muda('data')} /></Campo>
            <Campo rotulo="Resultado principal"><input value={f.resultado} onChange={muda('resultado')} placeholder="Ex.: 5,4%" /></Campo>
          </div>
          <Campo rotulo="Observação"><input value={f.obs} onChange={muda('obs')} placeholder="Ex.: o médico pediu repetir em 30 dias" /></Campo>
          <button className="btn btn-primario btn-largo" disabled={salvando}>Salvar</button>
        </form>
      </Folha>
      <Folha titulo="Foto do exame" aberta={!!ver} onFechar={() => setVer(null)}>
        {ver && <FotoGrande id={ver} />}
      </Folha>
    </div>
  )
}

export function Miniatura({ id, onClick }) {
  const url = useFotoUrl(id)
  return <button type="button" className="miniatura" onClick={onClick} style={url ? { backgroundImage: `url(${url})` } : undefined} aria-label="Ver foto" />
}

function FotoGrande({ id }) {
  const url = useFotoUrl(id)
  return url ? <img className="foto-grande" src={url} alt="Foto do exame" /> : <Vazio>Foto não encontrada neste aparelho. Se ela estiver no Google Drive, use Configurações → Restaurar.</Vazio>
}

function Nutricao() {
  const s = useEstado()
  return (
    <div className="tela">
      <Topo titulo="Orientações Nutricionais" />
      {ORIENTACOES.map((o) => (
        <div key={o.t} className="card">
          <strong>🍽️ {o.t}</strong>
          <p>{o.d}</p>
        </div>
      ))}
      <h2 className="titulo-secao">Orientações da minha nutricionista</h2>
      <textarea className="notas" rows="6" value={s.notas} placeholder="Anote aqui o seu plano alimentar..."
        onChange={(e) => setEstado({ notas: e.target.value })} />
      <p className="muted pequeno">As orientações acima são gerais. Siga o plano definido pela sua equipe de saúde.</p>
    </div>
  )
}

function Evolucao() {
  const s = useEstado()
  const g = gestacao(s.perfil)
  const dum = g ? parseData(s.perfil.dum) || new Date(parseData(s.perfil.dpp).getTime() - 280 * 86_400_000) : null

  // Média semanal de glicemia por semana gestacional
  const porSemana = {}
  s.glicemias.forEach((x) => {
    const k = dum ? Math.floor((x.ts - dum.getTime()) / (7 * 86_400_000)) : new Date(x.ts).toISOString().slice(0, 10)
    ;(porSemana[k] ||= []).push(x)
  })
  const linhas = Object.entries(porSemana).map(([k, l]) => ({
    k, media: Math.round(l.reduce((t, x) => t + x.valor, 0) / l.length), n: l.length,
    ok: Math.round((l.filter((x) => statusGlicemia(x.valor, x.momento).nivel === 'ok').length / l.length) * 100),
  })).sort((a, b) => (dum ? b.k - a.k : b.k.localeCompare(a.k)))
  const pesos = [...s.registros].filter((r) => r.peso).sort((a, b) => a.data.localeCompare(b.data))

  return (
    <div className="tela">
      <Topo titulo="Evolução da Gestação" />
      {g && <div className="card card-destaque"><div><small>Hoje</small><strong className="numero-grande">{g.semanas} semanas</strong><small>DPP: {fmtData(g.dpp)}</small></div></div>}
      <h2 className="titulo-secao">Peso</h2>
      <div className="card">
        <GraficoLinha unidade=" kg" pontos={pesos.map((r) => ({ x: parseData(r.data).getTime(), y: Number(r.peso), rotulo: fmtData(r.data), rotuloX: fmtData(r.data).slice(0, 5) }))} />
        {pesos.length >= 2 && <p className="muted pequeno">Ganho no período: {(pesos[pesos.length - 1].peso - pesos[0].peso).toFixed(1).replace('.', ',')} kg</p>}
      </div>
      <h2 className="titulo-secao">Glicemia por semana</h2>
      {linhas.length === 0 ? <Vazio>Sem medições ainda.</Vazio> : (
        <table className="tabela">
          <thead><tr><th>Semana</th><th>Média</th><th>Na meta</th><th>Medições</th></tr></thead>
          <tbody>{linhas.map((l) => <tr key={l.k}><td>{dum ? `${l.k}ª` : l.k}</td><td>{l.media}</td><td>{l.ok}%</td><td>{l.n}</td></tr>)}</tbody>
        </table>
      )}
    </div>
  )
}

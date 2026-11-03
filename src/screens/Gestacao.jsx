import { useState } from 'react'
import { ChevronLeft, ChevronRight, Scale, Ruler, CheckCircle2, Pencil, Trash2 } from 'lucide-react'
import { useEstado, addItem, delItem } from '../data/store'
import { CUIDADOS_TRIMESTRE } from '../data/conteudo'
import { gestacao, tamanhoBebe, fatoSemana, fmtData, hojeISO, parseData } from '../utils'
import { Topo, Abas, Folha, Campo, Vazio, GraficoLinha, ItemLista } from '../components/ui'

export default function Gestacao() {
  const s = useEstado()
  const g = gestacao(s.perfil)
  const [aba, setAba] = useState('semana')
  const [semana, setSemana] = useState(g ? Math.min(42, Math.max(4, g.semanas)) : 20)
  const [form, setForm] = useState(false)

  const tam = tamanhoBebe(semana)
  const tri = semana < 14 ? 1 : semana < 28 ? 2 : 3
  const atual = g && semana === g.semanas

  return (
    <div className="tela">
      <Topo titulo="Minha Gestação" />
      <Abas opcoes={[['semana', 'Semana a semana'], ['registros', 'Exames e registros']]} valor={aba} onChange={setAba} />

      {aba === 'semana' ? (
        <>
          {!g && <p className="aviso">Informe a DUM ou a DPP em <a href="#/mais/perfil">Meu Perfil</a> para ver a sua semana atual.</p>}
          <div className="seletor-semana">
            <button className="icone-btn" disabled={semana <= 4} onClick={() => setSemana(semana - 1)} aria-label="Semana anterior"><ChevronLeft /></button>
            <div className="centro">
              <strong className="numero-grande">{semana} semanas</strong>
              <small className="muted">{atual ? 'Você está aqui 💕' : `${tri}º trimestre`}</small>
            </div>
            <button className="icone-btn" disabled={semana >= 42} onClick={() => setSemana(semana + 1)} aria-label="Próxima semana"><ChevronRight /></button>
          </div>
          <p className="centro fato">{fatoSemana(semana)}</p>

          <div className="ilustra-bebe" aria-hidden="true">
            <span className="coracao c1">♡</span><span className="coracao c2">♡</span><span className="coracao c3">♡</span>
            <div className="bolha" style={{ '--t': `${0.55 + (semana / 42) * 0.45}` }}>👶</div>
          </div>

          <div className="card medidas">
            <div><Scale size={26} className="muted" /><span><small>Peso estimado</small><strong>{tam.peso}</strong></span></div>
            <div><Ruler size={26} className="muted" /><span><small>Comprimento</small><strong>{Math.round(tam.cm)} cm</strong></span></div>
          </div>

          <h2 className="titulo-secao">Cuidados desta fase</h2>
          <ul className="checklist">
            {CUIDADOS_TRIMESTRE[tri].map((c) => <li key={c}><CheckCircle2 size={20} className="verde" />{c}</li>)}
          </ul>
          <button className="btn btn-verde btn-largo" onClick={() => setForm(true)}><Pencil size={18} /> Registrar informações</button>
        </>
      ) : (
        <Registros s={s} onNovo={() => setForm(true)} />
      )}

      <FormRegistro aberta={form} onFechar={() => setForm(false)} />
    </div>
  )
}

function Registros({ s, onNovo }) {
  const regs = [...s.registros].sort((a, b) => b.data.localeCompare(a.data))
  const pontos = [...regs].reverse().filter((r) => r.peso).map((r) => ({
    x: parseData(r.data).getTime(), y: Number(r.peso), rotulo: fmtData(r.data), rotuloX: fmtData(r.data).slice(0, 5),
  }))
  return (
    <>
      <h2 className="titulo-secao">Evolução do peso</h2>
      <div className="card"><GraficoLinha pontos={pontos} unidade=" kg" /></div>
      <div className="linha-titulo">
        <h2 className="titulo-secao">Registros</h2>
        <button className="btn btn-pequeno" onClick={onNovo}>+ Novo</button>
      </div>
      {regs.length === 0 ? <Vazio>Nenhum registro ainda. Anote peso e pressão a cada consulta.</Vazio> : regs.map((r) => (
        <div key={r.id} className="card registro">
          <div>
            <strong>{fmtData(r.data)}</strong>
            <small>{[r.peso && `${r.peso} kg`, r.pressao && `PA ${r.pressao}`].filter(Boolean).join(' · ')}</small>
            {r.obs && <p>{r.obs}</p>}
          </div>
          <button className="icone-btn" onClick={() => confirm('Excluir este registro?') && delItem('registros', r.id)} aria-label="Excluir"><Trash2 size={18} /></button>
        </div>
      ))}
      <h2 className="titulo-secao">Exames</h2>
      <ItemLista icone="🧪" cor="lilas" titulo="Meus exames" sub={`${s.exames.length} registrado(s)`} href="#/diabetes/exames" />
    </>
  )
}

function FormRegistro({ aberta, onFechar }) {
  const [f, setF] = useState({ data: hojeISO(), peso: '', pressao: '', obs: '' })
  const muda = (k) => (e) => setF({ ...f, [k]: e.target.value })
  function salvar(e) {
    e.preventDefault()
    addItem('registros', f)
    setF({ data: hojeISO(), peso: '', pressao: '', obs: '' })
    onFechar()
  }
  return (
    <Folha titulo="Registrar informações" aberta={aberta} onFechar={onFechar}>
      <form className="form" onSubmit={salvar}>
        <Campo rotulo="Data"><input type="date" required value={f.data} onChange={muda('data')} /></Campo>
        <div className="duas-col">
          <Campo rotulo="Seu peso (kg)"><input type="number" inputMode="decimal" step="0.1" min="30" max="200" value={f.peso} onChange={muda('peso')} /></Campo>
          <Campo rotulo="Pressão"><input value={f.pressao} onChange={muda('pressao')} placeholder="12x8" /></Campo>
        </div>
        <Campo rotulo="Observações"><textarea rows="3" value={f.obs} onChange={muda('obs')} placeholder="Como você está se sentindo?" /></Campo>
        <button className="btn btn-primario btn-largo">Salvar</button>
      </form>
    </Folha>
  )
}

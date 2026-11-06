import { useState } from 'react'
import { ChevronLeft, ChevronRight, Scale, Ruler, CheckCircle2, Pencil, Trash2 } from 'lucide-react'
import { useEstado, addItem, delItem } from '../data/store'
import { CUIDADOS_TRIMESTRE } from '../data/conteudo'
import { PARTO, VIOLENCIA, TELEFONES_SAUDE } from '../data/guias'
import Feto, { frutaDaSemana } from '../components/Feto'
import { gestacao, tamanhoBebe, fatoSemana, fmtData, hojeISO, parseData } from '../utils'
import { Topo, Abas, Folha, Campo, Vazio, GraficoLinha, ItemLista } from '../components/ui'

export default function Gestacao({ sub }) {
  if (sub === 'parto') return <BomParto />
  if (sub === 'direitos') return <Direitos />
  return <Semanas />
}

function Semanas() {
  const s = useEstado()
  const g = gestacao(s.perfil)
  const [aba, setAba] = useState('semana')
  const [semana, setSemana] = useState(g ? Math.min(42, Math.max(4, g.semanas)) : 20)
  const [form, setForm] = useState(false)

  const tam = tamanhoBebe(semana)
  const tri = semana < 14 ? 1 : semana < 28 ? 2 : 3
  const atual = g && semana === g.semanas
  const fruta = frutaDaSemana(semana)

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

          <div className="ilustra-bebe">
            <span className="coracao c1" aria-hidden="true">♡</span><span className="coracao c2" aria-hidden="true">♡</span><span className="coracao c3" aria-hidden="true">♡</span>
            <Feto semana={semana} />
          </div>
          {fruta && (
            <div className="card fruta">
              <span className="fruta-emoji" aria-hidden="true">{fruta[1]}</span>
              <p>{atual ? 'Hoje seu bebê está do tamanho de' : `Com ${semana} semanas, o bebê tem o tamanho de`} <strong>{fruta[0]}</strong>!</p>
            </div>
          )}

          <div className="card medidas">
            <div><Scale size={26} className="muted" /><span><small>Peso estimado</small><strong>{tam.peso}</strong></span></div>
            <div><Ruler size={26} className="muted" /><span><small>Comprimento</small><strong>{Math.round(tam.cm)} cm</strong></span></div>
          </div>

          <h2 className="titulo-secao">Cuidados desta fase</h2>
          <ul className="checklist">
            {CUIDADOS_TRIMESTRE[tri].map((c) => <li key={c}><CheckCircle2 size={20} className="verde" />{c}</li>)}
          </ul>
          <button className="btn btn-verde btn-largo" onClick={() => setForm(true)}><Pencil size={18} /> Registrar informações</button>

          <h2 className="titulo-secao">Preparação para o parto</h2>
          <div className="lista">
            <ItemLista icone="🌸" cor="rosa" titulo="Dicas para um bom parto" sub="Plano de parto, sinais, mala e mais" href="#/gestacao/parto" />
            <ItemLista icone="🛡️" cor="lilas" titulo="Violência obstétrica" sub="Conheça seus direitos e como se proteger" href="#/gestacao/direitos" />
          </div>
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
      {regs.length === 0 ? <Vazio>Nenhum registro ainda. Anote peso e pressão a cada consulta.</Vazio> : <div className="registros">{regs.map((r) => (
        <div key={r.id} className="card registro">
          <div>
            <strong>{fmtData(r.data)}</strong>
            <small>{[r.peso && `${r.peso} kg`, r.pressao && `PA ${r.pressao}`].filter(Boolean).join(' · ')}</small>
            {r.obs && <p>{r.obs}</p>}
          </div>
          <button className="icone-btn" onClick={() => confirm('Excluir este registro?') && delItem('registros', r.id)} aria-label="Excluir"><Trash2 size={18} /></button>
        </div>
      ))}</div>}
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

function BomParto() {
  return (
    <div className="tela">
      <Topo titulo="Dicas para um bom parto" />
      <div className="card card-rosa"><p>Um parto tranquilo começa no pré-natal. Converse com sua equipe sobre cada item e leve suas dúvidas para as consultas. 💜</p></div>
      <div className="registros">
        {PARTO.map(([t, d], i) => (
          <div key={t} className="card guia-item">
            <span className="guia-num">{i + 1}</span>
            <div><strong>{t}</strong><p>{d}</p></div>
          </div>
        ))}
      </div>
      <ItemLista icone="🛡️" cor="lilas" titulo="Violência obstétrica: seus direitos" href="#/gestacao/direitos" />
    </div>
  )
}

function Direitos() {
  const Bloco = ({ titulo, itens, cor }) => (
    <div className={`card ${cor || ''}`}>
      <strong>{titulo}</strong>
      <ul className="lista-guia">{itens.map((x) => <li key={x}>{x}</li>)}</ul>
    </div>
  )
  return (
    <div className="tela">
      <Topo titulo="Violência obstétrica" />
      <div className="card card-lilas"><p>{VIOLENCIA.intro}</p></div>
      <div className="painel">
        <Bloco titulo="🚫 Exemplos" itens={VIOLENCIA.exemplos} />
        <Bloco titulo="✅ Seus direitos" itens={VIOLENCIA.direitos} cor="card-verde" />
        <Bloco titulo="🛡️ Como se proteger" itens={VIOLENCIA.protecao} />
        <Bloco titulo="📣 Onde denunciar" itens={VIOLENCIA.denunciar} cor="card-rosa" />
      </div>
      <div className="lista">
        {TELEFONES_SAUDE.filter(([, n]) => n !== '192').map(([nome, num, desc]) => (
          <ItemLista key={num} icone="📞" cor="lilas" titulo={`${nome}: ${num}`} sub={desc} href={`tel:${num.replace(/\D/g, '')}`} />
        ))}
      </div>
    </div>
  )
}

import { useEffect, useRef, useState } from 'react'
import { Settings, Trash2, Plus, Check, Phone, Share2, Cloud, CloudOff, Upload, Download, RefreshCw } from 'lucide-react'
import { useEstado, addItem, delItem, updItem, setEstado, getEstado, mesclar, substituirEstado } from '../data/store'
import { VACINAS_GESTANTE, VACINAS_BEBE, FAQ } from '../data/conteudo'
import { fmtData, hojeISO, baixarArquivo, idadeBebe } from '../utils'
import * as drive from '../data/drive'
import { Topo, ItemLista, Folha, Campo, Vazio, ir } from '../components/ui'
import { FormPerfil, Logo } from './Abertura'

export default function Mais({ sub }) {
  if (sub === 'perfil') return <Perfil />
  if (sub === 'consultas') return <Consultas />
  if (sub === 'vacinacao') return <Vacinacao />
  if (sub === 'faq') return <Perguntas />
  if (sub === 'contato') return <Contato />
  if (sub === 'sobre') return <Sobre />
  if (sub === 'backup') return <Backup />
  return <Menu />
}

function Menu() {
  return (
    <div className="tela">
      <Topo titulo="Mais para você" semVoltar
        direita={<button className="icone-btn" onClick={() => ir('mais/backup')} aria-label="Backup e configurações"><Settings size={22} /></button>} />
      <div className="lista">
        <ItemLista icone="👤" cor="lilas" titulo="Meu Perfil e Histórico" href="#/mais/perfil" />
        <ItemLista icone="📅" cor="rosa" titulo="Calendário de Consultas" href="#/mais/consultas" />
        <ItemLista icone="💉" cor="verde" titulo="Vacinação" href="#/mais/vacinacao" />
        <ItemLista icone="❓" cor="lilas" titulo="Perguntas Frequentes" href="#/mais/faq" />
        <ItemLista icone="🎧" cor="azul" titulo="Fale Conosco" href="#/mais/contato" />
        <ItemLista icone="💜" cor="rosa" titulo="Sobre o NeuroBaby" href="#/mais/sobre" />
        <ItemLista icone="☁️" cor="azul" titulo="Backup e Google Drive" href="#/mais/backup" />
      </div>
      <div className="card card-verde rodape-card">
        <p>Uma jornada única,<br />com todo o nosso cuidado. 💜</p>
      </div>
    </div>
  )
}

function Perfil() {
  const s = useEstado()
  const [salvo, setSalvo] = useState(false)
  return (
    <div className="tela">
      <Topo titulo="Meu Perfil" />
      <FormPerfil aoSalvar={() => { setSalvo(true); setTimeout(() => setSalvo(false), 2000) }} />
      {salvo && <p className="selo-grande nivel-ok">Perfil salvo!</p>}
      <h2 className="titulo-secao">Meu histórico</h2>
      <div className="resumo-linha">
        <a className="card mini" href="#/diabetes/glicemia"><small>Glicemias</small><strong>{s.glicemias.length}</strong></a>
        <a className="card mini" href="#/diabetes/exames"><small>Exames</small><strong>{s.exames.length}</strong></a>
        <a className="card mini" href="#/mais/consultas"><small>Consultas</small><strong>{s.consultas.length}</strong></a>
      </div>
    </div>
  )
}

function Consultas() {
  const s = useEstado()
  const [form, setForm] = useState(false)
  const vazio = { data: hojeISO(), hora: '', profissional: '', local: '', obs: '' }
  const [f, setF] = useState(vazio)
  const muda = (k) => (e) => setF({ ...f, [k]: e.target.value })
  const hoje = hojeISO()
  const ordenar = (l) => l.sort((a, b) => (a.data + a.hora).localeCompare(b.data + b.hora))
  const proximas = ordenar(s.consultas.filter((c) => !c.feita && c.data >= hoje))
  const passadas = ordenar(s.consultas.filter((c) => c.feita || c.data < hoje)).reverse()

  function salvar(e) {
    e.preventDefault()
    addItem('consultas', { ...f, feita: false })
    setF(vazio)
    setForm(false)
  }

  const Item = ({ c }) => (
    <div className={`card registro ${c.feita ? 'inativo' : ''}`}>
      <div className="data-bloco"><strong>{fmtData(c.data).slice(0, 2)}</strong><small>{new Date(c.data + 'T12:00').toLocaleDateString('pt-BR', { month: 'short' })}</small></div>
      <div>
        <strong>{c.profissional || 'Consulta'}</strong>
        <small>{[c.hora, c.local].filter(Boolean).join(' · ')}</small>
        {c.obs && <p>{c.obs}</p>}
      </div>
      <button className={`icone-btn ${c.feita ? 'verde' : ''}`} onClick={() => updItem('consultas', c.id, { feita: !c.feita })} aria-label="Marcar como realizada" title="Realizada"><Check size={20} /></button>
      <button className="icone-btn" onClick={() => confirm('Excluir esta consulta?') && delItem('consultas', c.id)} aria-label="Excluir"><Trash2 size={18} /></button>
    </div>
  )

  return (
    <div className="tela">
      <Topo titulo="Calendário de Consultas" />
      <button className="btn btn-primario btn-largo" onClick={() => setForm(true)}><Plus size={18} /> Agendar consulta</button>
      <h2 className="titulo-secao">Próximas</h2>
      {proximas.length === 0 ? <Vazio>Nenhuma consulta agendada.</Vazio> : proximas.map((c) => <Item key={c.id} c={c} />)}
      {passadas.length > 0 && <h2 className="titulo-secao">Anteriores</h2>}
      {passadas.map((c) => <Item key={c.id} c={c} />)}
      <Folha titulo="Agendar consulta" aberta={form} onFechar={() => setForm(false)}>
        <form className="form" onSubmit={salvar}>
          <div className="duas-col">
            <Campo rotulo="Data"><input type="date" required value={f.data} onChange={muda('data')} /></Campo>
            <Campo rotulo="Hora"><input type="time" value={f.hora} onChange={muda('hora')} /></Campo>
          </div>
          <Campo rotulo="Profissional / especialidade">
            <input list="profs" value={f.profissional} onChange={muda('profissional')} placeholder="Ex.: Obstetra" />
            <datalist id="profs">{['Obstetra', 'Endocrinologista', 'Nutricionista', 'Ultrassom', 'Pediatra', 'Enfermagem (pré-natal)'].map((p) => <option key={p} value={p} />)}</datalist>
          </Campo>
          <Campo rotulo="Local"><input value={f.local} onChange={muda('local')} /></Campo>
          <Campo rotulo="Observação"><input value={f.obs} onChange={muda('obs')} placeholder="Ex.: levar exames" /></Campo>
          <button className="btn btn-primario btn-largo">Salvar</button>
        </form>
      </Folha>
    </div>
  )
}

function Vacinacao() {
  const s = useEstado()
  const idade = idadeBebe(s.perfil.nascimentoBebe)
  function alternar(id) {
    setEstado((st) => {
      const vacinas = { ...st.vacinas }
      if (vacinas[id]) delete vacinas[id]
      else vacinas[id] = hojeISO()
      return { ...st, vacinas }
    })
  }
  const Vac = ({ id, nome, quando, devida }) => (
    <button className={`card vacina ${s.vacinas[id] ? 'feito' : devida ? 'devida' : ''}`} onClick={() => alternar(id)} aria-pressed={!!s.vacinas[id]}>
      <span className="check">{s.vacinas[id] ? '✓' : ''}</span>
      <span className="item-texto"><strong>{nome}</strong><small>{s.vacinas[id] ? `Aplicada em ${fmtData(s.vacinas[id])}` : quando}</small></span>
    </button>
  )
  return (
    <div className="tela">
      <Topo titulo="Vacinação" />
      <p className="muted pequeno">Toque para marcar como aplicada. Calendário de referência do PNI — confirme sempre na sua UBS.</p>
      <h2 className="titulo-secao">Gestante</h2>
      {VACINAS_GESTANTE.map((v) => <Vac key={v.id} {...v} />)}
      <h2 className="titulo-secao">Bebê</h2>
      {VACINAS_BEBE.map((g) => (
        <div key={g.idade}>
          <h3 className="sub-secao">{g.idade}</h3>
          {g.itens.map(([id, nome]) => <Vac key={id} id={id} nome={nome} quando={g.idade} devida={idade && idade.meses >= g.meses} />)}
        </div>
      ))}
    </div>
  )
}

function Perguntas() {
  return (
    <div className="tela">
      <Topo titulo="Perguntas Frequentes" />
      {FAQ.map(([p, r]) => (
        <details key={p} className="card faq">
          <summary>{p}</summary>
          <p>{r}</p>
        </details>
      ))}
    </div>
  )
}

function Contato() {
  async function compartilhar() {
    const dados = { title: 'NeuroBaby', text: 'Conheça o NeuroBaby — o desenvolvimento começa antes de nascer.', url: location.href.split('#')[0] }
    if (navigator.share) await navigator.share(dados).catch(() => {})
    else { await navigator.clipboard?.writeText(dados.url); alert('Link copiado!') }
  }
  return (
    <div className="tela">
      <Topo titulo="Fale Conosco" />
      <div className="card card-rosa">
        <strong>Em caso de emergência</strong>
        <p>Procure o pronto atendimento obstétrico mais próximo.</p>
      </div>
      <div className="lista">
        <ItemLista icone={<Phone size={20} />} cor="rosa" titulo="SAMU" sub="192" href="tel:192" />
        <ItemLista icone={<Phone size={20} />} cor="verde" titulo="Disque Saúde" sub="136" href="tel:136" />
        <ItemLista icone={<Share2 size={20} />} cor="lilas" titulo="Compartilhar o NeuroBaby" onClick={compartilhar} />
      </div>
    </div>
  )
}

function Sobre() {
  return (
    <div className="tela">
      <Topo titulo="Sobre o NeuroBaby" />
      <Logo pequeno />
      <div className="card">
        <p>O NeuroBaby acompanha você desde a gestação até os primeiros anos do bebê, com foco no controle do diabetes gestacional e no estímulo ao neurodesenvolvimento.</p>
        <p className="muted pequeno">As informações do app são educativas e não substituem a orientação da sua equipe de saúde.</p>
      </div>
      <p className="versao">Versão {__APP_VERSION__}</p>
    </div>
  )
}

function useDrive() {
  const [st, setSt] = useState(drive.statusDrive)
  useEffect(() => drive.onDrive(() => setSt(drive.statusDrive())), [])
  return st
}

function Backup() {
  const st = useDrive()
  const [msg, setMsg] = useState('')
  const [ocupado, setOcupado] = useState(false)
  const [cfg, setCfg] = useState(false)
  const [clientId, setClientId] = useState(st.clientId)
  const arquivo = useRef()

  async function acao(fn, ok) {
    setOcupado(true); setMsg('')
    try { await fn(); setMsg(ok) } catch (e) { setMsg(`⚠️ ${e.message}`) }
    setOcupado(false)
  }

  const restaurar = () => acao(async () => {
    const dados = await drive.baixarDoDrive()
    if (!confirm('Substituir os dados deste aparelho pelo backup do Google Drive?')) throw new Error('Restauração cancelada.')
    substituirEstado(dados)
  }, 'Dados restaurados do Google Drive!')

  function exportar() {
    baixarArquivo(`neurobaby-backup-${hojeISO()}.json`, JSON.stringify(getEstado(), null, 2), 'application/json')
  }

  async function importar(e) {
    const arq = e.target.files?.[0]
    e.target.value = ''
    if (!arq) return
    try {
      const dados = JSON.parse(await arq.text())
      setEstado((s) => mesclar(s, dados))
      setMsg('Backup importado e mesclado com os dados atuais!')
    } catch { setMsg('⚠️ Arquivo inválido.') }
  }

  return (
    <div className="tela">
      <Topo titulo="Backup e Google Drive" />
      <div className="card">
        <div className="linha-titulo">
          <strong>{st.conectado ? <><Cloud size={18} className="verde" /> Google Drive conectado</> : <><CloudOff size={18} className="muted" /> Google Drive desconectado</>}</strong>
        </div>
        <p className="muted pequeno">
          Seus dados ficam salvos neste aparelho. Com o Drive conectado, cada alteração também atualiza uma cópia
          numa pasta oculta do seu Google Drive (só o NeuroBaby acessa).
          {st.ultimoSync ? ` Última sincronização: ${new Date(st.ultimoSync).toLocaleString('pt-BR')}.` : ''}
        </p>
        {st.pendente && <p className="selo-grande nivel-atencao">Há alterações ainda não enviadas. Toque em Sincronizar.</p>}
        {!st.clientId && <p className="selo-grande nivel-atencao">Configure o ID do cliente Google abaixo para ativar o Drive.</p>}
        <div className="botoes">
          {st.conectado ? (
            <>
              <button className="btn btn-primario" disabled={ocupado} onClick={() => acao(drive.sincronizar, 'Sincronizado com o Google Drive!')}><RefreshCw size={16} /> Sincronizar</button>
              <button className="btn" disabled={ocupado} onClick={restaurar}><Download size={16} /> Restaurar</button>
              <button className="btn btn-texto" onClick={drive.desconectar}>Desconectar</button>
            </>
          ) : (
            <button className="btn btn-primario" disabled={ocupado || !st.clientId} onClick={() => acao(drive.conectar, 'Google Drive conectado e backup enviado!')}><Cloud size={16} /> Entrar com Google</button>
          )}
        </div>
      </div>

      <div className="card">
        <strong>Arquivo de backup</strong>
        <p className="muted pequeno">Exporte um arquivo para guardar ou levar para outro aparelho. Importar mescla com os dados atuais.</p>
        <div className="botoes">
          <button className="btn" onClick={exportar}><Download size={16} /> Exportar</button>
          <button className="btn" onClick={() => arquivo.current.click()}><Upload size={16} /> Importar</button>
          <input ref={arquivo} type="file" accept="application/json,.json" hidden onChange={importar} />
        </div>
      </div>

      {msg && <p className="mensagem">{msg}</p>}

      <button className="btn btn-texto" onClick={() => setCfg(true)}>Configuração avançada do Google</button>
      <Folha titulo="ID do cliente Google" aberta={cfg} onFechar={() => setCfg(false)}>
        <form className="form" onSubmit={(e) => { e.preventDefault(); drive.salvarClientId(clientId); setCfg(false) }}>
          <p className="muted pequeno">Crie no Google Cloud uma credencial OAuth do tipo “Aplicativo da Web”, com a origem onde o NeuroBaby está publicado, e ative a Google Drive API.</p>
          <Campo rotulo="Client ID"><input value={clientId} onChange={(e) => setClientId(e.target.value)} placeholder="xxxx.apps.googleusercontent.com" /></Campo>
          <button className="btn btn-primario btn-largo">Salvar</button>
        </form>
      </Folha>
      <p className="versao">NeuroBaby v{__APP_VERSION__}</p>
    </div>
  )
}

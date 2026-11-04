import { useState } from 'react'
import { Cloud } from 'lucide-react'
import { setEstado, useEstado, substituirEstado } from '../data/store'
import * as drive from '../data/drive'
import { Campo, ir } from '../components/ui'

export function Logo({ pequeno }) {
  return (
    <div className={`logo ${pequeno ? 'logo-p' : ''}`}>
      <img src="./logo-ilustracao.png" alt="Mãe abraçando o bebê" />
      <h1 className="marca"><span className="neuro">Neuro</span><span className="baby">Baby</span></h1>
      <div className="marca-traco"><span>♥</span></div>
      <p className="slogan">O desenvolvimento<br />começa antes de nascer.</p>
    </div>
  )
}

export function Splash({ aoComecar }) {
  return (
    <div className="splash">
      <Logo />
      <ul className="pilares">
        <li><span>🤰</span>Acompanhe sua gestação</li>
        <li><span>👶</span>Cuide do seu bebê</li>
        <li><span>🧠</span>Estimule o neurodesenvolvimento</li>
        <li><span>💚</span>Construa um futuro saudável</li>
      </ul>
      {aoComecar && <button className="btn btn-primario btn-largo" onClick={aoComecar}>Começar</button>}
      <div className="onda" aria-hidden="true" />
    </div>
  )
}

// Cadastro inicial (também usado em "Meu Perfil")
export function FormPerfil({ aoSalvar, textoBotao = 'Salvar' }) {
  const { perfil } = useEstado()
  const [p, setP] = useState(perfil)
  const [fase, setFase] = useState(perfil.nascimentoBebe ? 'nasceu' : 'gestante')
  const muda = (k) => (e) => setP({ ...p, [k]: e.target.value })

  function salvar(e) {
    e.preventDefault()
    const final = fase === 'gestante' ? { ...p, nascimentoBebe: '' } : p
    setEstado((s) => ({ ...s, perfil: final }))
    aoSalvar?.()
  }

  return (
    <form className="form" onSubmit={salvar}>
      <Campo rotulo="Seu nome">
        <input required value={p.nome} onChange={muda('nome')} placeholder="Como podemos te chamar?" autoComplete="given-name" />
      </Campo>
      <div className="abas">
        <button type="button" className={fase === 'gestante' ? 'ativa' : ''} onClick={() => setFase('gestante')}>Estou gestante</button>
        <button type="button" className={fase === 'nasceu' ? 'ativa' : ''} onClick={() => setFase('nasceu')}>Meu bebê nasceu</button>
      </div>
      {fase === 'gestante' ? (
        <>
          <Campo rotulo="Data da última menstruação (DUM)">
            <input type="date" value={p.dum} onChange={muda('dum')} />
          </Campo>
          <p className="dica-campo">ou, se preferir</p>
          <Campo rotulo="Data provável do parto (DPP)">
            <input type="date" value={p.dpp} onChange={muda('dpp')} />
          </Campo>
        </>
      ) : (
        <Campo rotulo="Data de nascimento do bebê">
          <input type="date" required value={p.nascimentoBebe} onChange={muda('nascimentoBebe')} />
        </Campo>
      )}
      <Campo rotulo="Nome do bebê (opcional)">
        <input value={p.nomeBebe} onChange={muda('nomeBebe')} />
      </Campo>
      <button className="btn btn-primario btn-largo">{textoBotao}</button>
    </form>
  )
}

export function BoasVindas() {
  const [passo, setPasso] = useState(0)
  if (passo === 0) return <Splash aoComecar={() => setPasso(1)} />
  return (
    <div className="tela">
      <Logo pequeno />
      <h2 className="titulo-secao centro">Vamos começar? 💜</h2>
      <FormPerfil textoBotao="Entrar no NeuroBaby" aoSalvar={() => ir('inicio')} />
      <EntrarComGoogle />
    </div>
  )
}

// Quem já usa o app (ou saiu antes) entra com o Google e recupera o backup do Drive
function EntrarComGoogle() {
  const [ocupado, setOcupado] = useState(false)
  const [msg, setMsg] = useState('')
  if (!drive.statusDrive().clientId) return null

  async function entrar() {
    setOcupado(true); setMsg('')
    try {
      const dados = await drive.entrarComBackup()
      if (dados?.perfil?.nome) { substituirEstado(dados); ir('inicio'); return }
      setMsg('Google conectado. Não achamos dados salvos nesta conta: preencha o cadastro acima para começar.')
    } catch (e) { setMsg(`⚠️ ${e.message}`) }
    setOcupado(false)
  }

  return (
    <div className="card entrar-google">
      <strong>Já usa o NeuroBaby?</strong>
      <p className="muted pequeno">Entre com a sua conta Google para recuperar os seus dados.</p>
      <button className="btn btn-largo" disabled={ocupado} onClick={entrar}><Cloud size={18} /> {ocupado ? 'Entrando…' : 'Entrar com Google'}</button>
      {msg && <p className="mensagem">{msg}</p>}
    </div>
  )
}

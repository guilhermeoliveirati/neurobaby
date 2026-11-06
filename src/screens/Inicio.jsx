import { Menu, Bell, CalendarDays, Droplet, HeartPulse, MoreHorizontal, Lightbulb, ChevronRight, Ruler } from 'lucide-react'
import { useEstado } from '../data/store'
import { DICAS } from '../data/conteudo'
import { gestacao, tamanhoBebe, fatoSemana, idadeBebe, textoIdade, fmtData, parseData, hojeISO, statusGlicemia, statusPressao } from '../utils'
import Feto, { frutaDaSemana } from '../components/Feto'
import { ir } from '../components/ui'

export default function Inicio() {
  const s = useEstado()
  const g = gestacao(s.perfil)
  const bebe = idadeBebe(s.perfil.nascimentoBebe)
  const diaDoAno = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86_400_000)
  const dica = DICAS[diaDoAno % DICAS.length]

  const hoje = hojeISO()
  const proxConsulta = s.consultas.filter((c) => !c.feita && c.data >= hoje).sort((a, b) => (a.data + a.hora).localeCompare(b.data + b.hora))[0]
  const ultGlic = [...s.glicemias].sort((a, b) => b.ts - a.ts)[0]
  const ultPress = [...s.pressoes].sort((a, b) => b.ts - a.ts)[0]
  const fruta = g ? frutaDaSemana(g.semanas) : null
  const alertas = (proxConsulta ? 1 : 0)

  return (
    <div className="tela">
      <div className="inicio-topo">
        <button className="icone-btn" onClick={() => ir('mais')} aria-label="Menu"><Menu size={24} /></button>
        <button className="icone-btn sino" onClick={() => ir('mais/consultas')} aria-label="Próximas consultas">
          <Bell size={22} />{alertas > 0 && <i />}
        </button>
      </div>
      <h1 className="ola">Olá, {s.perfil.nome || 'mamãe'}! 💜</h1>
      <p className="muted">Que bom ter você por aqui!</p>

      {bebe ? (
        <a className="card card-destaque" href="#/desenvolvimento">
          <div>
            <small>{s.perfil.nomeBebe || 'Seu bebê'} está com</small>
            <strong className="numero-grande">{textoIdade(bebe)}</strong>
            <small>Veja os marcos desta fase</small>
          </div>
          <span className="emoji-grande">👶</span>
        </a>
      ) : g ? (
        <a className="card card-destaque" href="#/gestacao">
          <div>
            <small>Sua gestação está com</small>
            <strong className="numero-grande">{g.semanas} semanas{g.dias ? <em> e {g.dias}d</em> : null}</strong>
            {fruta && <small className="fruta-texto">Hoje seu bebê está do tamanho de {fruta[0]} {fruta[1]}</small>}
            <small>{g.faltamSemanas > 0 ? `Faltam ${g.faltamSemanas} semanas para conhecer seu bebê!` : 'Seu bebê pode chegar a qualquer momento!'}</small>
          </div>
          <span className="feto-mini"><Feto semana={g.semanas} tamanho={104} compacto /></span>
        </a>
      ) : (
        <a className="card card-destaque" href="#/mais/perfil">
          <div>
            <strong>Complete seu perfil</strong>
            <small>Informe a DUM ou a data do parto para acompanhar semana a semana.</small>
          </div>
        </a>
      )}

      <div className="atalhos">
        <button onClick={() => ir('mais/consultas')}><span className="bg-verde"><CalendarDays size={22} /></span>Consultas</button>
        <button onClick={() => ir('diabetes/glicemia')}><span className="bg-rosa"><Droplet size={22} /></span>Glicemias</button>
        <button onClick={() => ir('diabetes/pressao')}><span className="bg-verde"><HeartPulse size={22} /></span>Pressão</button>
        <button onClick={() => ir('diabetes')}><span className="bg-lilas"><MoreHorizontal size={22} /></span>Mais</button>
      </div>

      <div className="painel">
        <div className="card card-lilas dica">
          <Lightbulb size={26} className="dica-ic" />
          <div>
            <strong>Dica de hoje 💡</strong>
            <p>{dica}</p>
          </div>
        </div>

        {(ultGlic || ultPress || proxConsulta) && (
          <div className="resumo-linha">
            {ultGlic && (
              <a className={`card mini nivel-${statusGlicemia(ultGlic.valor, ultGlic.momento).nivel}`} href="#/diabetes/glicemia">
                <small>Última glicemia</small>
                <strong>{ultGlic.valor} <em>mg/dL</em></strong>
              </a>
            )}
            {ultPress && (
              <a className={`card mini nivel-${statusPressao(ultPress.sis, ultPress.dia).nivel}`} href="#/diabetes/pressao">
                <small>Última pressão</small>
                <strong>{ultPress.sis}x{ultPress.dia}</strong>
              </a>
            )}
            {proxConsulta && (
              <a className="card mini" href="#/mais/consultas">
                <small>Próxima consulta</small>
                <strong>{fmtData(proxConsulta.data).slice(0, 5)} <em>{proxConsulta.hora}</em></strong>
              </a>
            )}
          </div>
        )}

        {!bebe && g && (
          <a className="card card-info" href="#/gestacao">
            <Ruler size={26} className="muted" />
            <div>
              <strong>Desenvolvimento do bebê</strong>
              <p>Seu bebê agora mede cerca de {Math.round(tamanhoBebe(g.semanas).cm)} cm e pesa aproximadamente {tamanhoBebe(g.semanas).peso}! {fatoSemana(g.semanas)}</p>
              {parseData(g.dpp) && <small className="muted">Data provável do parto: {fmtData(g.dpp)}</small>}
            </div>
            <ChevronRight size={20} className="muted" />
          </a>
        )}
      </div>
    </div>
  )
}

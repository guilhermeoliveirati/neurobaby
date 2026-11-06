// Lembretes, antecedentes familiares e busca de atendimento (convênio ou SUS)
import { useState } from 'react'
import { Plus, Trash2, MapPin, Phone, Search, MessageCircle, X } from 'lucide-react'
import { useEstado, setEstado, novoId } from '../data/store'
import { LEMBRETES, ANTECEDENTES, ESPECIALIDADES, CONVENIOS, PROGRAMAS_SUS, TELEFONES_SAUDE } from '../data/guias'
import { gestacao, parseData } from '../utils'
import { eventosLembrete } from '../agenda'
import { Topo, ItemLista, Campo, Abas } from '../components/ui'
import { BotoesAgenda } from '../components/Agenda'

/* ---------------- Lembretes ---------------- */
export function Lembretes() {
  const s = useEstado()
  const g = gestacao(s.perfil)
  // Lembretes valem até 6 semanas depois da data provável do parto (se informada)
  const ate = g ? new Date(parseData(g.dpp).getTime() + 42 * 86_400_000) : null
  return (
    <div className="tela">
      <Topo titulo="Lembretes" />
      <div className="card card-lilas">
        <p>Escolha os horários e toque em <strong>Agenda do celular</strong>. O lembrete fica salvo na agenda e toca todos os dias, mesmo com o app fechado.</p>
        <p className="muted pequeno">No iPhone, confirme em “Adicionar tudo”. No Android, use “Google Agenda” (um toque por horário) ou abra o arquivo baixado.</p>
      </div>
      <div className="registros">
        {LEMBRETES.map((l) => <CartaoLembrete key={l.tipo} l={l} ate={ate} salvo={s.lembretes.find((x) => x.tipo === l.tipo)} />)}
      </div>
      {ate && <p className="muted pequeno centro">Os lembretes param sozinhos em {ate.toLocaleDateString('pt-BR')} (6 semanas após a data provável do parto).</p>}
    </div>
  )
}

function CartaoLembrete({ l, ate, salvo }) {
  const [horarios, setHorarios] = useState(salvo?.horarios || l.horarios)
  const [novo, setNovo] = useState('')
  const ordenar = (h) => [...new Set(h)].sort()
  function registrar() {
    // Guarda quais horários foram para a agenda, para mostrar na próxima vez
    setEstado((st) => ({ ...st, lembretes: [...st.lembretes.filter((x) => x.tipo !== l.tipo), { id: novoId(), tipo: l.tipo, horarios, em: Date.now() }] }))
  }
  return (
    <div className="card lembrete">
      <div className="linha-titulo">
        <strong><span className="lembrete-emoji">{l.emoji}</span> {l.titulo}</strong>
      </div>
      <div className="horarios">
        {horarios.map((h) => (
          <span key={h} className="horario">{h}<button onClick={() => setHorarios(horarios.filter((x) => x !== h))} aria-label={`Remover ${h}`}><X size={12} /></button></span>
        ))}
        <span className="horario novo">
          <input type="time" value={novo} onChange={(e) => setNovo(e.target.value)} aria-label="Novo horário" />
          <button disabled={!novo} onClick={() => { setHorarios(ordenar([...horarios, novo])); setNovo('') }} aria-label="Adicionar horário"><Plus size={14} /></button>
        </span>
      </div>
      {horarios.length > 0 && (
        <div onClickCapture={registrar}>
          <BotoesAgenda nome={`lembrete-${l.tipo}`} eventos={eventosLembrete(l, horarios, ate)} pequeno />
        </div>
      )}
      {salvo && <small className="muted">✓ Enviado para a agenda em {new Date(salvo.em).toLocaleDateString('pt-BR')} ({salvo.horarios.join(', ')})</small>}
    </div>
  )
}

/* ---------------- Antecedentes familiares ---------------- */
export function Antecedentes() {
  const s = useEstado()
  const { respostas, outras } = s.antecedentes
  const [nova, setNova] = useState({ nome: '', quem: '' })
  const total = ANTECEDENTES.reduce((t, g) => t + g.itens.length, 0)
  const respondidas = Object.keys(respostas).length

  function responder(id, campos) {
    setEstado((st) => {
      const atual = { eu: false, familia: false, quem: '', ...(st.antecedentes.respostas[id] || {}), ...campos }
      return { ...st, antecedentes: { ...st.antecedentes, respostas: { ...st.antecedentes.respostas, [id]: atual } } }
    })
  }
  function addOutra(e) {
    e.preventDefault()
    setEstado((st) => ({ ...st, antecedentes: { ...st.antecedentes, outras: [...st.antecedentes.outras, { id: novoId(), ...nova }] } }))
    setNova({ nome: '', quem: '' })
  }
  function delOutra(id) {
    setEstado((st) => ({ ...st, antecedentes: { ...st.antecedentes, outras: st.antecedentes.outras.filter((x) => x.id !== id) } }))
  }

  return (
    <div className="tela">
      <Topo titulo="Meus antecedentes" />
      <div className="card card-lilas">
        <p>Responda para cada doença se <strong>você</strong> ou <strong>alguém da família</strong> (pais, irmãos, avós, pai do bebê e a família dele) tem ou teve. Essas informações ajudam a equipe de saúde a cuidar de você e do bebê.</p>
        <span className="barra"><i style={{ width: `${(respondidas / total) * 100}%` }} /></span>
        <small className="muted">{respondidas} de {total} perguntas respondidas</small>
      </div>
      {ANTECEDENTES.map((g) => (
        <div key={g.grupo} className="grupo-antecedentes">
          <h2 className="titulo-secao">{g.grupo}</h2>
          <div className="registros">
            {g.itens.map(([id, nome]) => {
              const r = respostas[id]
              const nao = r && !r.eu && !r.familia
              return (
                <div key={id} className={`card pergunta ${r?.eu || r?.familia ? 'sim' : ''}`}>
                  <strong>Você ou alguém da família tem {nome.toLowerCase()}?</strong>
                  <div className="opcoes">
                    <button className={r?.eu ? 'ativo' : ''} onClick={() => responder(id, { eu: !r?.eu })}>Eu</button>
                    <button className={r?.familia ? 'ativo' : ''} onClick={() => responder(id, { familia: !r?.familia })}>Família</button>
                    <button className={nao ? 'ativo nao' : ''} onClick={() => responder(id, { eu: false, familia: false, quem: '' })}>Não</button>
                  </div>
                  {r?.familia && <input className="quem" value={r.quem} onChange={(e) => responder(id, { quem: e.target.value })} placeholder="Quem? Ex.: minha mãe, avô do bebê" />}
                </div>
              )
            })}
          </div>
        </div>
      ))}

      <h2 className="titulo-secao">Mais alguma?</h2>
      <div className="card">
        <strong>Tem alguma doença que exista na família que queira inserir na sua ficha?</strong>
        <form className="form" onSubmit={addOutra}>
          <div className="duas-col">
            <Campo rotulo="Doença"><input required value={nova.nome} onChange={(e) => setNova({ ...nova, nome: e.target.value })} placeholder="Ex.: fibrose cística" /></Campo>
            <Campo rotulo="Quem tem"><input value={nova.quem} onChange={(e) => setNova({ ...nova, quem: e.target.value })} placeholder="Ex.: tia materna" /></Campo>
          </div>
          <button className="btn"><Plus size={16} /> Adicionar à ficha</button>
        </form>
        {outras.length > 0 && (
          <ul className="outras">
            {outras.map((o) => <li key={o.id}><span><strong>{o.nome}</strong>{o.quem && ` · ${o.quem}`}</span><button className="icone-btn" onClick={() => delOutra(o.id)} aria-label="Excluir"><Trash2 size={16} /></button></li>)}
          </ul>
        )}
      </div>
      <p className="muted pequeno centro">Essas respostas entram no relatório para o médico.</p>
    </div>
  )
}

/* ---------------- Encontrar atendimento ---------------- */
const mapa = (q) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`
const google = (q) => `https://www.google.com/search?q=${encodeURIComponent(q)}`

export function Atendimento() {
  const s = useEstado()
  const p = s.perfil
  const [plano, setPlano] = useState(p.plano || 'sus')
  const [esp, setEsp] = useState('Obstetra')
  const salvarPerfil = (campos) => setEstado((st) => ({ ...st, perfil: { ...st.perfil, ...campos } }))
  const ondeEstou = p.cidade ? ` em ${p.cidade}` : ' perto de mim'

  return (
    <div className="tela">
      <Topo titulo="Encontrar atendimento" />
      <Abas opcoes={[['sus', 'SUS'], ['convenio', 'Convênio']]} valor={plano} onChange={(v) => { setPlano(v); salvarPerfil({ plano: v }) }} />

      <Campo rotulo="Sua cidade (opcional, ajuda na busca)">
        <input value={p.cidade} onChange={(e) => salvarPerfil({ cidade: e.target.value })} placeholder="Ex.: Campinas - SP" />
      </Campo>

      {plano === 'convenio' && (
        <>
          <Campo rotulo="Seu convênio">
            <input list="convenios" value={p.convenio} onChange={(e) => salvarPerfil({ convenio: e.target.value })} placeholder="Ex.: Unimed" />
            <datalist id="convenios">{CONVENIOS.map((c) => <option key={c} value={c} />)}</datalist>
          </Campo>
          <Campo rotulo="Especialidade de que precisa">
            <select value={esp} onChange={(e) => setEsp(e.target.value)}>{ESPECIALIDADES.map((x) => <option key={x}>{x}</option>)}</select>
          </Campo>
          <div className="lista">
            <ItemLista icone={<MapPin size={20} />} cor="rosa" titulo={`${esp} ${p.convenio || 'do convênio'} mais perto`} sub="Abre o mapa com os locais próximos" href={mapa(`${esp} ${p.convenio}${ondeEstou}`)} />
            <ItemLista icone={<Search size={20} />} cor="lilas" titulo={`Guia médico ${p.convenio || 'do convênio'}`} sub="Confirme no guia oficial se o local atende o seu plano" href={google(`guia médico ${p.convenio} ${esp}${p.cidade ? ' ' + p.cidade : ''}`)} />
            <ItemLista icone={<MapPin size={20} />} cor="verde" titulo="Maternidades do convênio" href={mapa(`maternidade ${p.convenio}${ondeEstou}`)} />
            <ItemLista icone={<MapPin size={20} />} cor="azul" titulo="Pronto-socorro obstétrico" href={mapa(`pronto socorro obstétrico ${p.convenio}${ondeEstou}`)} />
          </div>
          <p className="muted pequeno">Antes de ir, ligue e confirme se o local atende o seu plano e a especialidade. Problemas com o convênio: ANS 0800 701 9656.</p>
        </>
      )}

      {plano === 'sus' && (
        <>
          <div className="lista">
            <ItemLista icone={<MapPin size={20} />} cor="verde" titulo="UBS / Posto de saúde mais perto" sub="Pré-natal, vacinas e exames" href={mapa(`UBS posto de saúde${ondeEstou}`)} />
            <ItemLista icone={<MapPin size={20} />} cor="rosa" titulo="Maternidade do SUS" href={mapa(`maternidade SUS${ondeEstou}`)} />
            <ItemLista icone={<MapPin size={20} />} cor="lilas" titulo="Banco de Leite Humano" href={mapa(`banco de leite humano${ondeEstou}`)} />
            <ItemLista icone={<MapPin size={20} />} cor="azul" titulo="CAPS (saúde mental)" href={mapa(`CAPS${ondeEstou}`)} />
          </div>

          <h2 className="titulo-secao">Secretaria de Saúde</h2>
          <div className="card">
            <p>Muitas cidades têm WhatsApp para gestantes e mães no puerpério. Busque o da sua cidade e salve aqui para falar com um toque.</p>
            <div className="botoes">
              <a className="btn btn-pequeno" href={google(`WhatsApp secretaria de saúde gestante puérpera ${p.cidade || ''}`)} target="_blank" rel="noopener noreferrer"><Search size={14} /> Buscar canais da minha cidade</a>
            </div>
            <Campo rotulo="WhatsApp da secretaria ou da sua UBS">
              <input type="tel" inputMode="tel" value={p.whatsSaude} onChange={(e) => salvarPerfil({ whatsSaude: e.target.value })} placeholder="(11) 99999-9999" />
            </Campo>
            {p.whatsSaude.replace(/\D/g, '').length >= 10 && (
              <a className="btn btn-verde btn-largo" href={`https://wa.me/55${p.whatsSaude.replace(/\D/g, '').replace(/^55/, '')}`} target="_blank" rel="noopener noreferrer"><MessageCircle size={18} /> Abrir conversa no WhatsApp</a>
            )}
          </div>

          <h2 className="titulo-secao">Programas do SUS</h2>
          <div className="registros">
            {PROGRAMAS_SUS.map(([t, d]) => <div key={t} className="card"><strong>{t}</strong><p className="pequeno">{d}</p></div>)}
          </div>
        </>
      )}

      <h2 className="titulo-secao">Telefones úteis</h2>
      <div className="lista">
        {TELEFONES_SAUDE.map(([nome, num, desc]) => <ItemLista key={num} icone={<Phone size={18} />} cor="rosa" titulo={`${nome}: ${num}`} sub={desc} href={`tel:${num.replace(/\D/g, '')}`} />)}
      </div>
    </div>
  )
}


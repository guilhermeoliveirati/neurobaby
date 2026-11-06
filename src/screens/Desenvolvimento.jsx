import { useState } from 'react'
import { Star, Heart, Music, ExternalLink, AlertTriangle } from 'lucide-react'
import { useEstado, setEstado } from '../data/store'
import { FAIXAS, MARCOS, ATIVIDADES } from '../data/conteudo'
import { MUSICAS, DICAS_MUSICA } from '../data/guias'
import { idadeBebe, textoIdade, faixaDaIdade, gestacao, hojeISO, fmtData } from '../utils'
import { Topo, Abas, Folha, ir } from '../components/ui'

// Marcos ainda não marcados que merecem uma pergunta à mãe:
// a faixa já começou para o bebê e quase todos os outros já foram marcados (ou a faixa já passou)
export function marcosPendentes(s, faixa, idade) {
  if (!idade || idade.meses < faixa.de) return []
  const lista = MARCOS[faixa.id].map((m, i) => ({ id: `${faixa.id}_${i}`, nome: m[0], emoji: m[1], porque: m[2] }))
  const faltam = lista.filter((m) => !s.marcos[m.id])
  const feitos = lista.length - faltam.length
  const passou = idade.meses >= faixa.ate
  if (!faltam.length || (!passou && (feitos === 0 || faltam.length > 2))) return []
  return faltam
}

function marcar(id, feito) {
  setEstado((st) => {
    const marcos = { ...st.marcos }
    const respostasMarcos = { ...st.respostasMarcos }
    if (feito) { marcos[id] = hojeISO(); delete respostasMarcos[id] } else delete marcos[id]
    return { ...st, marcos, respostasMarcos }
  })
}
function responderNao(id) {
  setEstado((st) => ({ ...st, respostasMarcos: { ...st.respostasMarcos, [id]: hojeISO() } }))
}

export default function Desenvolvimento() {
  const s = useEstado()
  const idade = idadeBebe(s.perfil.nascimentoBebe)
  const g = gestacao(s.perfil)
  const [aba, setAba] = useState('marcos')
  const [faixaId, setFaixaId] = useState((idade ? faixaDaIdade(idade.meses) : FAIXAS[0]).id)
  const [aberto, setAberto] = useState(null) // marco com a explicação aberta
  const [pergunta, setPergunta] = useState(null) // alerta de marco não selecionado
  const faixa = FAIXAS.find((f) => f.id === faixaId)
  const pendentes = marcosPendentes(s, faixa, idade)
  const semResposta = pendentes.filter((m) => !s.respostasMarcos[m.id])
  const comNao = pendentes.filter((m) => s.respostasMarcos[m.id])

  function alternar(m, feito) {
    marcar(m.id, feito)
    setAberto(null)
    if (!feito) return
    // Depois de marcar, confere se ficou algum quadrado sem selecionar nesta fase
    const depois = marcosPendentes({ ...s, marcos: { ...s.marcos, [m.id]: hojeISO() } }, faixa, idade)
      .filter((x) => !s.respostasMarcos[x.id] && x.id !== m.id)
    if (depois.length) setTimeout(() => setPergunta({ ...depois[0], etapa: 'pergunta' }), 350)
  }

  const nomeBebe = s.perfil.nomeBebe || 'seu bebê'

  return (
    <div className="tela">
      <Topo titulo="Desenvolvimento Infantil" icone={<span>🧠</span>} />

      <div className="card bebe-card">
        <div className="bebe-foto" aria-hidden="true">👶</div>
        <div>
          {idade ? (
            <>
              <p>{s.perfil.nomeBebe || 'Seu bebê'} está com</p>
              <strong className="numero-grande lilas">{textoIdade(idade)}</strong>
              <small className="muted">Vamos acompanhar esse momento tão especial?</small>
            </>
          ) : (
            <>
              <p>{g ? `Faltam ${g.faltamSemanas} semanas! 💕` : 'Prepare-se para essa jornada'}</p>
              <small className="muted">Conheça os marcos do desenvolvimento. Quando o bebê nascer, informe a data em <a href="#/mais/perfil">Meu Perfil</a>.</small>
            </>
          )}
        </div>
      </div>

      {aba !== 'musicas' && (
        <div className="chips rolagem">
          {FAIXAS.map((f) => (
            <button key={f.id} className={f.id === faixaId ? 'ativo' : ''} onClick={() => setFaixaId(f.id)}>{f.nome}</button>
          ))}
        </div>
      )}

      <Abas opcoes={[['marcos', 'Marcos'], ['atividades', 'Atividades'], ['musicas', 'Músicas'], ['resumo', 'Resumo']]} valor={aba} onChange={setAba} />

      {aba === 'marcos' && (
        <>
          <p className="muted pequeno centro">Toque em um quadrado para saber por que ele é importante e marcar o que o bebê já faz.</p>
          {comNao.map((m) => (
            <div key={m.id} className="card alerta-marco perigo">
              <AlertTriangle size={22} />
              <div>
                <strong>Procure um especialista</strong>
                <p>Você informou que {nomeBebe} ainda não faz: “{m.nome}”. Converse com o pediatra ou procure um neuropediatra para uma avaliação.</p>
                <div className="botoes">
                  <button className="btn btn-pequeno" onClick={() => ir('mais/atendimento')}>Encontrar atendimento</button>
                  <button className="btn btn-pequeno btn-texto" onClick={() => marcar(m.id, true)}>Já começou a fazer</button>
                </div>
              </div>
            </div>
          ))}
          {semResposta.length > 0 && (
            <button className="card alerta-marco" onClick={() => setPergunta({ ...semResposta[0], etapa: 'pergunta' })}>
              <AlertTriangle size={22} />
              <div><strong>{semResposta.length === 1 ? 'Ficou 1 marco sem selecionar' : `Ficaram ${semResposta.length} marcos sem selecionar`}</strong><p>Toque para responder.</p></div>
            </button>
          )}
          <div className="grade-marcos">
            {MARCOS[faixaId].map(([nome, emoji, porque], i) => {
              const id = `${faixaId}_${i}`
              const feito = s.marcos[id]
              return (
                <button key={id} className={`marco ${feito ? 'feito' : ''} ${s.respostasMarcos[id] && !feito ? 'nao' : ''}`}
                  onClick={() => setAberto({ id, nome, emoji, porque })} aria-pressed={!!feito}>
                  <span className="marco-emoji">{emoji}</span>
                  <span>{nome}</span>
                  {feito && <small>✓ {fmtData(feito).slice(0, 5)}</small>}
                </button>
              )
            })}
          </div>
        </>
      )}

      {aba === 'atividades' && (
        <ul className="lista-atividades">
          {ATIVIDADES[faixaId].map((a) => <li key={a} className="card"><Heart size={18} className="rosa" />{a}</li>)}
        </ul>
      )}

      {aba === 'musicas' && <Musicas />}

      {aba === 'resumo' && (
        <div className="lista">
          {FAIXAS.map((f) => {
            const total = MARCOS[f.id].length
            const feitos = MARCOS[f.id].filter((_, i) => s.marcos[`${f.id}_${i}`]).length
            return (
              <button key={f.id} className="card progresso" onClick={() => { setFaixaId(f.id); setAba('marcos') }}>
                <span>{f.nome}</span>
                <span className="barra"><i style={{ width: `${(feitos / total) * 100}%` }} /></span>
                <small>{feitos}/{total}</small>
              </button>
            )
          })}
          <p className="muted pequeno">Cada criança tem seu ritmo. Se notar atrasos importantes, converse com o pediatra.</p>
        </div>
      )}

      {aba !== 'musicas' && (
        <div className="card card-lilas dica">
          <Star size={22} className="amarelo" />
          <div>
            <strong>Dica NeuroBaby</strong>
            <p>Estimule seu bebê com brincadeiras simples, como mostrar objetos coloridos! Fase atual: {faixa.nome}.</p>
          </div>
        </div>
      )}

      {/* Explicação do marco */}
      <Folha titulo={aberto?.nome || ''} aberta={!!aberto} onFechar={() => setAberto(null)}>
        {aberto && (
          <div className="form">
            <div className="marco-explica">
              <span className="marco-emoji-grande">{aberto.emoji}</span>
              <div><strong>Por que é importante?</strong><p>{aberto.porque}</p></div>
            </div>
            {s.marcos[aberto.id] ? (
              <>
                <p className="selo-grande nivel-ok">✓ Marcado em {fmtData(s.marcos[aberto.id])}</p>
                <button className="btn btn-largo" onClick={() => alternar(aberto, false)}>Desmarcar</button>
              </>
            ) : (
              <button className="btn btn-verde btn-largo" onClick={() => alternar(aberto, true)}>✓ {s.perfil.nomeBebe || 'O bebê'} já faz isso</button>
            )}
            <p className="muted pequeno centro">Faixa de referência: {faixa.nome}. Cada criança tem seu ritmo.</p>
          </div>
        )}
      </Folha>

      {/* Alerta: marco que ficou sem selecionar */}
      <Folha titulo={pergunta?.etapa === 'especialista' ? 'Atenção' : 'Ficou um sem selecionar'} aberta={!!pergunta} onFechar={() => setPergunta(null)}>
        {pergunta && (pergunta.etapa === 'pergunta' ? (
          <div className="form centro">
            <span className="marco-emoji-grande">{pergunta.emoji}</span>
            <p className="pergunta-marco">{nomeBebe[0].toUpperCase() + nomeBebe.slice(1)} já faz isso: <strong>“{pergunta.nome}”</strong>?</p>
            <p className="muted">Você não selecionou essa opção.</p>
            <button className="btn btn-verde btn-largo" onClick={() => { marcar(pergunta.id, true); setPergunta(null) }}>Sim, já faz</button>
            <button className="btn btn-largo" onClick={() => { responderNao(pergunta.id); setPergunta({ ...pergunta, etapa: 'especialista' }) }}>Não, ainda não</button>
          </div>
        ) : (
          <div className="form centro">
            <span className="alerta-icone"><AlertTriangle size={36} /></span>
            <p className="pergunta-marco"><strong>Você deve procurar um especialista.</strong></p>
            <p>Leve essa observação (“{pergunta.nome}”) ao pediatra ou a um neuropediatra. Uma avaliação cedo faz diferença no desenvolvimento.</p>
            <button className="btn btn-primario btn-largo" onClick={() => { setPergunta(null); ir('mais/atendimento') }}>Encontrar atendimento</button>
            <button className="btn btn-texto btn-largo" onClick={() => setPergunta(null)}>Entendi</button>
          </div>
        ))}
      </Folha>
    </div>
  )
}

function Musicas() {
  const busca = (t) => `https://www.youtube.com/results?search_query=${encodeURIComponent(t)}`
  return (
    <>
      <div className="card card-lilas">
        <strong><Music size={18} className="lilas" /> Como usar a música</strong>
        <ul className="lista-guia">{DICAS_MUSICA.map((d) => <li key={d}>{d}</li>)}</ul>
      </div>
      <div className="painel">
        {MUSICAS.map((g) => (
          <div key={g.grupo} className="card">
            <strong>{g.grupo}</strong>
            <p className="muted pequeno">{g.dica}</p>
            <ul className="musicas">
              {g.itens.map((m) => (
                <li key={m}><a href={busca(m)} target="_blank" rel="noopener noreferrer">🎵 {m} <ExternalLink size={14} className="muted" /></a></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="muted pequeno centro">Toque em uma música para ouvir no YouTube.</p>
    </>
  )
}

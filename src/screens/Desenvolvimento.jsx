import { useState } from 'react'
import { Star, Heart } from 'lucide-react'
import { useEstado, setEstado } from '../data/store'
import { FAIXAS, MARCOS, ATIVIDADES } from '../data/conteudo'
import { idadeBebe, textoIdade, faixaDaIdade, gestacao, hojeISO, fmtData } from '../utils'
import { Topo, Abas } from '../components/ui'

export default function Desenvolvimento() {
  const s = useEstado()
  const idade = idadeBebe(s.perfil.nascimentoBebe)
  const g = gestacao(s.perfil)
  const [aba, setAba] = useState('marcos')
  const [faixaId, setFaixaId] = useState((idade ? faixaDaIdade(idade.meses) : FAIXAS[0]).id)
  const faixa = FAIXAS.find((f) => f.id === faixaId)

  function alternar(id) {
    setEstado((st) => {
      const marcos = { ...st.marcos }
      if (marcos[id]) delete marcos[id]
      else marcos[id] = hojeISO()
      return { ...st, marcos }
    })
  }

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

      <div className="chips rolagem">
        {FAIXAS.map((f) => (
          <button key={f.id} className={f.id === faixaId ? 'ativo' : ''} onClick={() => setFaixaId(f.id)}>{f.nome}</button>
        ))}
      </div>

      <Abas opcoes={[['marcos', 'Marcos da fase'], ['atividades', 'Atividades'], ['resumo', 'Resumo']]} valor={aba} onChange={setAba} />

      {aba === 'marcos' && (
        <>
          <p className="muted pequeno centro">Toque para marcar o que o bebê já faz.</p>
          <div className="grade-marcos">
            {MARCOS[faixaId].map(([nome, emoji], i) => {
              const id = `${faixaId}_${i}`
              const feito = s.marcos[id]
              return (
                <button key={id} className={`marco ${feito ? 'feito' : ''}`} onClick={() => alternar(id)} aria-pressed={!!feito}>
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

      <div className="card card-lilas dica">
        <Star size={22} className="amarelo" />
        <div>
          <strong>Dica NeuroBaby</strong>
          <p>Estimule seu bebê com brincadeiras simples, como mostrar objetos coloridos! Fase atual: {faixa.nome}.</p>
        </div>
      </div>
    </div>
  )
}

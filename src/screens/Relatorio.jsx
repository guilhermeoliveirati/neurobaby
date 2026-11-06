// Relatório para levar ao médico: junta perfil, antecedentes, glicemia, pressão, medicações e exames com fotos.
// "Salvar em PDF" usa a impressão do navegador (no celular: Imprimir → Salvar como PDF / Compartilhar).
import { Printer, ChevronLeft } from 'lucide-react'
import { useEstado } from '../data/store'
import { ANTECEDENTES } from '../data/guias'
import { gestacao, fmtData, fmtDataHora, statusGlicemia, statusPressao, momento, idadeBebe, textoIdade } from '../utils'
import { useFotoUrl } from '../data/fotos'
import { voltar } from '../components/ui'

const DIA = 86_400_000

export default function Relatorio() {
  const s = useEstado()
  const p = s.perfil
  const g = gestacao(p)
  const bebe = idadeBebe(p.nascimentoBebe)
  const desde = Date.now() - 30 * DIA
  const glic = s.glicemias.filter((x) => x.ts >= desde).sort((a, b) => b.ts - a.ts)
  const press = s.pressoes.filter((x) => x.ts >= desde).sort((a, b) => b.ts - a.ts)
  const exames = [...s.exames].sort((a, b) => b.data.localeCompare(a.data))
  const meds = s.medicacoes.filter((m) => m.ativo !== false)
  const pesos = [...s.registros].filter((r) => r.peso).sort((a, b) => b.data.localeCompare(a.data))
  const nomes = Object.fromEntries(ANTECEDENTES.flatMap((gr) => gr.itens))
  const antec = Object.entries(s.antecedentes.respostas).filter(([, r]) => r.eu || r.familia)
  const media = (l, k) => Math.round(l.reduce((t, x) => t + x[k], 0) / l.length)

  // Glicemia por momento (últimos 30 dias)
  const porMomento = {}
  glic.forEach((x) => (porMomento[x.momento] ||= []).push(x))

  return (
    <div className="relatorio">
      <div className="relatorio-acoes nao-imprimir">
        <button className="btn" onClick={() => voltar('mais')}><ChevronLeft size={18} /> Voltar</button>
        <button className="btn btn-primario" onClick={() => window.print()}><Printer size={18} /> Salvar em PDF / Imprimir</button>
      </div>
      <p className="muted pequeno nao-imprimir">No celular, toque em “Salvar em PDF” e escolha “Salvar como PDF” ou “Compartilhar” para mandar ao médico.</p>

      <header className="rel-cabecalho">
        <div>
          <h1>Relatório de acompanhamento</h1>
          <p>Gerado pelo NeuroBaby em {new Date().toLocaleDateString('pt-BR')}</p>
        </div>
        <img src="./logo-ilustracao.png" alt="" />
      </header>

      <section>
        <h2>Paciente</h2>
        <dl className="rel-dados">
          <div><dt>Nome</dt><dd>{p.nome}</dd></div>
          {g && <div><dt>Idade gestacional</dt><dd>{g.semanas} semanas e {g.dias} dias</dd></div>}
          {g && <div><dt>Data provável do parto</dt><dd>{fmtData(g.dpp)}</dd></div>}
          {p.dum && <div><dt>DUM</dt><dd>{fmtData(p.dum)}</dd></div>}
          {bebe && <div><dt>Bebê</dt><dd>{p.nomeBebe || 'Bebê'}, {textoIdade(bebe)} (nasc. {fmtData(p.nascimentoBebe)})</dd></div>}
          <div><dt>Atendimento</dt><dd>{p.plano === 'convenio' ? `Convênio ${p.convenio}` : 'SUS'}</dd></div>
        </dl>
      </section>

      <section>
        <h2>Antecedentes pessoais e familiares</h2>
        {antec.length === 0 && s.antecedentes.outras.length === 0 ? <p className="muted">Nenhum antecedente informado.</p> : (
          <ul className="rel-lista">
            {antec.map(([id, r]) => (
              <li key={id}><strong>{nomes[id] || id}</strong>: {[r.eu && 'a própria paciente', r.familia && `família${r.quem ? ` (${r.quem})` : ''}`].filter(Boolean).join(' e ')}</li>
            ))}
            {s.antecedentes.outras.map((o) => <li key={o.id}><strong>{o.nome}</strong>{o.quem && `: ${o.quem}`}</li>)}
          </ul>
        )}
      </section>

      {meds.length > 0 && (
        <section>
          <h2>Medicações em uso</h2>
          <ul className="rel-lista">{meds.map((m) => <li key={m.id}><strong>{m.nome}</strong> {[m.dose, m.horario].filter(Boolean).join(' · ')}</li>)}</ul>
        </section>
      )}

      <section>
        <h2>Glicemia — últimos 30 dias</h2>
        {glic.length === 0 ? <p className="muted">Sem medições no período.</p> : (
          <>
            <p>{glic.length} medições · média {media(glic, 'valor')} mg/dL · {Math.round((glic.filter((x) => statusGlicemia(x.valor, x.momento).nivel === 'ok').length / glic.length) * 100)}% na meta</p>
            <table className="rel-tabela">
              <thead><tr><th>Momento</th><th>Meta</th><th>Medições</th><th>Média</th><th>Maior</th></tr></thead>
              <tbody>{Object.entries(porMomento).map(([m, l]) => (
                <tr key={m}><td>{momento(m).nome}</td><td>&lt; {momento(m).meta}</td><td>{l.length}</td><td>{media(l, 'valor')}</td><td>{Math.max(...l.map((x) => x.valor))}</td></tr>
              ))}</tbody>
            </table>
          </>
        )}
      </section>

      <section>
        <h2>Pressão arterial — últimos 30 dias</h2>
        {press.length === 0 ? <p className="muted">Sem aferições no período.</p> : (
          <>
            <p>{press.length} aferições · média {media(press, 'sis')} x {media(press, 'dia')} mmHg · maior {Math.max(...press.map((x) => x.sis))} x {Math.max(...press.map((x) => x.dia))}</p>
            <table className="rel-tabela">
              <thead><tr><th>Data</th><th>Pressão</th><th>Pulso</th><th>Situação</th></tr></thead>
              <tbody>{press.slice(0, 15).map((x) => (
                <tr key={x.id}><td>{fmtDataHora(x.ts)}</td><td>{x.sis} x {x.dia}</td><td>{x.pulso || '—'}</td><td>{statusPressao(x.sis, x.dia).texto}</td></tr>
              ))}</tbody>
            </table>
          </>
        )}
      </section>

      {pesos.length > 0 && (
        <section>
          <h2>Peso</h2>
          <p>{pesos.slice(0, 6).map((r) => `${fmtData(r.data)}: ${r.peso} kg${r.pressao ? ` (PA ${r.pressao})` : ''}`).join(' · ')}</p>
        </section>
      )}

      <section>
        <h2>Exames</h2>
        {exames.length === 0 ? <p className="muted">Nenhum exame registrado.</p> : (
          <table className="rel-tabela">
            <thead><tr><th>Data</th><th>Exame</th><th>Resultado</th><th>Observação</th></tr></thead>
            <tbody>{exames.map((x) => <tr key={x.id}><td>{fmtData(x.data)}</td><td>{x.nome}</td><td>{x.resultado || '—'}</td><td>{x.obs || ''}</td></tr>)}</tbody>
          </table>
        )}
      </section>

      {exames.some((x) => x.fotos?.length) && (
        <section className="rel-fotos">
          <h2>Fotos dos exames</h2>
          {exames.filter((x) => x.fotos?.length).map((x) => x.fotos.map((id, k) => (
            <figure key={id}>
              <FotoRel id={id} />
              <figcaption>{x.nome} — {fmtData(x.data)}{x.fotos.length > 1 ? ` (${k + 1}/${x.fotos.length})` : ''}</figcaption>
            </figure>
          )))}
        </section>
      )}

      <footer className="rel-rodape">Informações registradas pela própria paciente no app NeuroBaby. Não substituem os laudos originais.</footer>
    </div>
  )
}

function FotoRel({ id }) {
  const url = useFotoUrl(id)
  return url ? <img src={url} alt="Foto do exame" /> : <p className="muted">Foto não disponível neste aparelho.</p>
}

import { CalendarPlus } from 'lucide-react'
import { adicionarNaAgenda, linkGoogleAgenda } from '../agenda'

// Botões para levar um ou mais eventos para a agenda do celular
export function BotoesAgenda({ eventos, nome = 'neurobaby', pequeno }) {
  const cls = `btn ${pequeno ? 'btn-pequeno' : ''}`
  return (
    <div className="botoes-agenda">
      <button type="button" className={cls} onClick={() => adicionarNaAgenda(nome, eventos)}>
        <CalendarPlus size={16} /> Agenda do celular
      </button>
      {eventos.length === 1 ? (
        <a className={cls} href={linkGoogleAgenda(eventos[0])} target="_blank" rel="noopener noreferrer">Google Agenda</a>
      ) : eventos.map((e, i) => (
        <a key={i} className={`${cls} btn-pequeno`} href={linkGoogleAgenda(e)} target="_blank" rel="noopener noreferrer">
          Google {String(e.inicio.getHours()).padStart(2, '0')}:{String(e.inicio.getMinutes()).padStart(2, '0')}
        </a>
      ))}
    </div>
  )
}

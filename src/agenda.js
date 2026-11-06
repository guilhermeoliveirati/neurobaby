// Leva consultas, exames e lembretes para a agenda do celular.
// - Arquivo .ics: abre o "Adicionar ao calendário" no iPhone e funciona em Samsung, Outlook etc.
// - Link do Google Agenda: o caminho mais simples no Android.
import { baixarArquivo } from './utils'

const pad = (n) => String(n).padStart(2, '0')
// Data/hora "flutuante" (sem fuso): a agenda usa o fuso do próprio celular
const fmt = (d) => `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`
const esc = (t = '') => String(t).replace(/\\/g, '\\\\').replace(/[,;]/g, (c) => `\\${c}`).replace(/\n/g, '\\n')

export function dataHora(dataISO, hora = '08:00') {
  const [a, m, d] = dataISO.split('-').map(Number)
  const [h, mi] = (hora || '08:00').split(':').map(Number)
  return new Date(a, m - 1, d, h, mi)
}

// evento: { titulo, inicio: Date, duracaoMin, descricao, local, rrule, alarmes: [minutos antes] }
function vevento(e, i) {
  const fim = new Date(e.inicio.getTime() + (e.duracaoMin ?? 30) * 60000)
  const linhas = [
    'BEGIN:VEVENT',
    `UID:neurobaby-${Date.now()}-${i}-${Math.random().toString(36).slice(2, 8)}@neurobaby`,
    `DTSTAMP:${fmt(new Date())}`,
    `DTSTART:${fmt(e.inicio)}`,
    `DTEND:${fmt(fim)}`,
    `SUMMARY:${esc(e.titulo)}`,
  ]
  if (e.descricao) linhas.push(`DESCRIPTION:${esc(e.descricao)}`)
  if (e.local) linhas.push(`LOCATION:${esc(e.local)}`)
  if (e.rrule) linhas.push(`RRULE:${e.rrule}`)
  for (const min of e.alarmes ?? [0]) {
    linhas.push('BEGIN:VALARM', 'ACTION:DISPLAY', `DESCRIPTION:${esc(e.titulo)}`, `TRIGGER:-PT${min}M`, 'END:VALARM')
  }
  linhas.push('END:VEVENT')
  return linhas
}

export function gerarIcs(eventos) {
  return ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//NeuroBaby//PT-BR', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH',
    ...eventos.flatMap(vevento), 'END:VCALENDAR'].join('\r\n')
}

const ehIOS = () => /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)

export function adicionarNaAgenda(nomeArquivo, eventos) {
  const ics = gerarIcs(eventos)
  // No iPhone, abrir o calendário direto mostra a tela "Adicionar todos" do app Calendário
  if (ehIOS()) window.location.href = `data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}`
  else baixarArquivo(`${nomeArquivo}.ics`, ics, 'text/calendar')
}

export function linkGoogleAgenda(e) {
  const fim = new Date(e.inicio.getTime() + (e.duracaoMin ?? 30) * 60000)
  const p = new URLSearchParams({ action: 'TEMPLATE', text: e.titulo, dates: `${fmt(e.inicio)}/${fmt(fim)}` })
  if (e.descricao) p.set('details', e.descricao)
  if (e.local) p.set('location', e.local)
  if (e.rrule) p.set('recur', `RRULE:${e.rrule}`)
  return `https://calendar.google.com/calendar/render?${p}`
}

// Eventos prontos
export function eventoConsulta(c) {
  const exame = c.tipo === 'exame'
  return {
    titulo: `${exame ? 'Exame' : 'Consulta'}: ${c.profissional || (exame ? 'exame' : 'consulta')}`,
    inicio: dataHora(c.data, c.hora || '08:00'),
    duracaoMin: 60,
    local: c.local,
    descricao: [c.obs, 'Lembrete do NeuroBaby. Leve sua caderneta e seus exames.'].filter(Boolean).join('\n'),
    alarmes: [24 * 60, 120],
  }
}

export function eventosLembrete(l, horarios, ate) {
  const hoje = new Date()
  const iso = `${hoje.getFullYear()}-${pad(hoje.getMonth() + 1)}-${pad(hoje.getDate())}`
  const until = ate ? `;UNTIL=${fmt(ate).slice(0, 8)}T235900` : ''
  return horarios.map((h) => ({
    titulo: `${l.emoji} ${l.titulo}`,
    inicio: dataHora(iso, h),
    duracaoMin: 10,
    descricao: 'Lembrete do NeuroBaby. Abra o app para registrar.',
    rrule: `FREQ=DAILY${until}`,
    alarmes: [0],
  }))
}

// Ilustração do bebê no útero que muda com a semana da gestação:
// embrião curvado com "cauda" no começo, braços e pernas surgindo entre 6 e 12 semanas,
// proporções mudando (cabeça grande no início) e o bebê ocupando cada vez mais o útero.
import { FRUTAS } from '../data/guias'

const lim = (v, a, b) => Math.min(b, Math.max(a, v))

export function frutaDaSemana(semana) {
  const s = lim(Math.floor(semana), 4, 42)
  return FRUTAS[s] || null
}

export default function Feto({ semana, tamanho = 220, compacto = false }) {
  const w = lim(semana, 4, 42)
  const escala = 0.42 + 0.82 * ((w - 4) / 38)
  const membros = lim((w - 6) / 6, 0, 1)
  const embriao = w < 9
  const cabeca = w < 10 ? 27 : w < 16 ? 24 : w < 24 ? 22 : 21
  const gordo = 1 + 0.14 * lim((w - 22) / 18, 0, 1)
  const pele = embriao ? '#f4b7b9' : '#f8cdb8'
  const contorno = embriao ? '#e2939b' : '#dfa48d'
  const id = `f${Math.round(w)}${compacto ? 'c' : ''}`
  const membro = (cx, cy, rx, ry, rot) => <ellipse cx={cx} cy={cy} rx={rx} ry={ry} transform={`rotate(${rot} ${cx} ${cy})`} />

  return (
    <svg viewBox="0 0 200 200" width={tamanho} height={tamanho} className={`feto-svg ${compacto ? 'compacto' : ''}`} role="img"
      aria-label={`Ilustração do bebê com ${Math.floor(w)} semanas`}>
      <defs>
        <radialGradient id={`utero-${id}`} cx="45%" cy="40%" r="65%">
          <stop offset="0%" stopColor="#fff3f2" />
          <stop offset="62%" stopColor="#fbd5da" />
          <stop offset="100%" stopColor="#f1a8b7" />
        </radialGradient>
        <radialGradient id={`pele-${id}`} cx="35%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#fff4ee" />
          <stop offset="100%" stopColor={pele} />
        </radialGradient>
      </defs>
      <circle cx="100" cy="100" r="96" fill={`url(#utero-${id})`} />
      <circle cx="100" cy="100" r="88" fill="none" stroke="#fff" strokeOpacity=".55" strokeWidth="2" />
      {/* placenta */}
      <ellipse cx="164" cy="56" rx="24" ry="13" transform="rotate(50 164 56)" fill="#e88aa0" opacity=".5" />

      <g transform={`translate(100 102) scale(${escala})`} strokeLinejoin="round">
        {/* cordão umbilical: da barriga até a placenta */}
        <path d={`M-10 22 C 10 ${70 / escala - 40}, ${60 / escala} ${10 / escala}, ${62 / escala} ${-44 / escala}`}
          fill="none" stroke="#d98aa0" strokeWidth={4 / Math.max(escala, 0.7)} strokeLinecap="round" opacity=".8" />

        <g fill={`url(#pele-${id})`} stroke={contorno} strokeWidth={1.3 / escala}>
          {/* cauda do embrião */}
          {embriao && <path d="M10 40 C 22 52, 8 64, -4 56 C 2 56, 12 50, 4 44 Z" />}

          {/* tronco em forma de feijão (costas curvas) */}
          <g transform={`translate(6 18) scale(${gordo}) translate(-6 -18)`}>
            <path d={embriao
              ? 'M8 -12 C 30 -4, 30 30, 16 44 C 6 52, -10 46, -12 34 C -16 18, -12 0, -4 -8 Z'
              : 'M10 -14 C 36 -4, 40 32, 22 46 C 10 56, -10 52, -16 38 C -21 22, -18 0, -8 -10 Z'} />
          </g>

          {/* perna dobrada: coxa para a frente, canela voltando, pezinho */}
          {membros > 0 && (
            <g opacity={lim(membros * 1.5, 0, 1)}>
              {membro(-2, 32, 6 + 17 * membros, 6 + 4 * (gordo - 1) * 7, -22)}
              {membro(-14, 42, 4 + 12 * membros, 4.5 + 3 * (gordo - 1) * 7, 55)}
              {membro(-4 + 4 * (1 - membros), 52, 3 + 6 * membros, 3 + 1.5 * membros, -8)}
            </g>
          )}

          {/* braço de cima (atrás da cabeça) */}
          {membros > 0 && <g opacity={lim(membros * 1.5, 0, 1)}>{membro(-3, 2, 4 + 9 * membros, 4 + 2 * membros, 62)}</g>}

          {/* cabeça */}
          <circle cx="-6" cy={-14 - cabeca} r={cabeca} />

          {/* antebraço e mãozinha perto do rosto */}
          {membros > 0 && (
            <g opacity={lim(membros * 1.5, 0, 1)}>
              {membro(-14, -6, 4 + 9 * membros, 3.5 + 2 * membros, -58)}
              <circle cx={-19 - 3 * membros} cy={-13 - 3 * membros} r={2.5 + 2.5 * membros} />
            </g>
          )}
        </g>

        {/* rosto */}
        <g fill="none" stroke={contorno} strokeLinecap="round" strokeWidth={1.4 / escala}>
          {embriao ? (
            <circle cx={-18} cy={-14 - cabeca} r="2.6" fill="#b46a76" stroke="none" opacity=".6" />
          ) : (
            <>
              <path d={`M-21 ${-17 - cabeca} q 4 3.5 8 0`} />
              <path d={`M-29.5 ${-9 - cabeca} q -2.5 2 0 4.5`} />
              <path d={`M4 ${-20 - cabeca} a 4.5 5.5 0 1 1 0.5 9`} />
              <circle cx={-18} cy={-8 - cabeca} r="3.6" fill="#f3a3a3" stroke="none" opacity={0.35 + 0.35 * (gordo - 1) * 7} />
            </>
          )}
          {/* cabelinho no fim da gestação */}
          {w >= 30 && (
            <g stroke="#c0937a" opacity={lim((w - 29) / 6, 0, 1)}>
              <path d={`M-14 ${-14 - 2 * cabeca + 2} q 4 -4 9 -1`} />
              <path d={`M-5 ${-14 - 2 * cabeca + 1} q 5 -3 9 1`} />
              <path d={`M4 ${-14 - 2 * cabeca + 4} q 4 -1 6 3`} />
            </g>
          )}
        </g>
      </g>
    </svg>
  )
}

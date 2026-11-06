// Passo a passo de uso: completo no primeiro acesso e "Novidades" quando o app ganha funções novas.
import { useState } from 'react'
import { createPortal } from 'react-dom'
import { setEstado } from '../data/store'
import { ir } from './ui'

const VERSAO_TOUR = '1.5.0'

const COMPLETO = [
  { emoji: '💜', titulo: 'Bem-vinda ao NeuroBaby!', texto: 'Vamos mostrar rapidinho como usar o app. Você pode pular e rever depois em Configurações.' },
  { emoji: '🏠', titulo: 'Início', texto: 'Mostra em que semana você está, a dica do dia, sua última glicemia e a próxima consulta. Os atalhos levam direto para os registros.' },
  { emoji: '🤰', titulo: 'Minha Jornada', texto: 'Veja como o bebê está a cada semana, com a ilustração e o tamanho comparado a uma fruta. Registre seu peso e encontre dicas para o parto.', rota: 'gestacao' },
  { emoji: '🩸', titulo: 'Glicemia e pressão', texto: 'Na Caderneta, toque em "Nova medição" ou "Nova aferição". O app avisa se o valor está fora da meta e mostra os gráficos.', rota: 'diabetes' },
  { emoji: '📸', titulo: 'Exames com foto', texto: 'Tire uma foto do resultado do exame. O app guarda e monta um relatório em PDF para levar ao médico.', rota: 'diabetes/exames' },
  { emoji: '⏰', titulo: 'Lembretes e consultas', texto: 'Mande lembretes ("está na hora de aferir a pressão") e suas consultas para a agenda do celular. Eles tocam mesmo com o app fechado.', rota: 'mais/lembretes' },
  { emoji: '🧠', titulo: 'Desenvolvimento', texto: 'Toque nos quadrados para saber por que cada marco é importante e marcar o que o bebê já faz. Veja também músicas para o bebê.', rota: 'desenvolvimento' },
  { emoji: '📍', titulo: 'Atendimento e antecedentes', texto: 'Encontre atendimento do seu convênio ou do SUS perto de você e preencha seus antecedentes familiares.', rota: 'mais' },
  { emoji: '☁️', titulo: 'Seus dados seguros', texto: 'Conecte o Google Drive em Configurações para ter uma cópia de segurança. Pronto, é só começar!', rota: 'mais/backup' },
]

const NOVIDADES = [
  { emoji: '✨', titulo: 'Novidades no NeuroBaby!', texto: 'O app ganhou várias funções novas. Veja em poucos passos como usar cada uma.' },
  { emoji: '🍊', titulo: 'Bebê semana a semana', texto: 'Em Minha Jornada, a ilustração do bebê agora muda a cada semana e mostra o tamanho comparado a uma fruta.', rota: 'gestacao' },
  { emoji: '🩺', titulo: 'Pressão arterial', texto: 'Na Caderneta, toque em "Pressão Arterial" e em "Nova aferição". Digite a máxima e a mínima (ex.: 120 x 80).', rota: 'diabetes/pressao' },
  { emoji: '⏰', titulo: 'Lembretes na agenda', texto: 'Em Perfil → Lembretes, escolha os horários e toque em "Agenda do celular". Consultas e exames agendados também podem ir para a agenda.', rota: 'mais/lembretes' },
  { emoji: '📸', titulo: 'Foto do exame e relatório', texto: 'Em Exames, toque em "Registrar exame (com foto)". Depois, "Gerar relatório" monta um PDF para o médico.', rota: 'diabetes/exames' },
  { emoji: '🧠', titulo: 'Marcos explicados e músicas', texto: 'No Desenvolvimento, toque em um quadrado para ver por que ele é importante. Se ficar algum sem marcar, o app pergunta. Veja também a aba Músicas.', rota: 'desenvolvimento' },
  { emoji: '🧬', titulo: 'Antecedentes familiares', texto: 'Em Perfil → Meus antecedentes, responda o questionário sobre doenças na família.', rota: 'mais/antecedentes' },
  { emoji: '📍', titulo: 'Convênio ou SUS', texto: 'Em Perfil → Encontrar atendimento, veja locais do seu convênio ou postos do SUS mais perto, e os programas do SUS.', rota: 'mais/atendimento' },
  { emoji: '🌸', titulo: 'Parto e seus direitos', texto: 'Em Minha Jornada: dicas para um bom parto e como se proteger da violência obstétrica.', rota: 'gestacao/parto' },
]

export const precisaTour = (s) => s.tutorialVisto !== VERSAO_TOUR

export default function Tour({ estado }) {
  const passos = estado.tutorialVisto === 'novo' ? COMPLETO : NOVIDADES
  const [i, setI] = useState(0)
  const p = passos[i]
  const ultimo = i === passos.length - 1
  const fechar = () => setEstado({ tutorialVisto: VERSAO_TOUR })

  return createPortal(
    <div className="tour-fundo">
      <div className="tour" role="dialog" aria-modal="true" aria-label={p.titulo}>
        <button className="tour-pular" onClick={fechar}>Pular</button>
        <span className="tour-emoji" aria-hidden="true">{p.emoji}</span>
        <h2>{p.titulo}</h2>
        <p>{p.texto}</p>
        <div className="tour-pontos" aria-hidden="true">{passos.map((_, k) => <i key={k} className={k === i ? 'ativo' : ''} />)}</div>
        <div className="tour-botoes">
          {i > 0 && <button className="btn" onClick={() => { setI(i - 1); ir(passos[i - 1].rota || 'inicio') }}>Voltar</button>}
          <button className="btn btn-primario" onClick={() => {
            if (ultimo) { fechar(); ir('inicio') } else { setI(i + 1); if (passos[i + 1].rota) ir(passos[i + 1].rota) }
          }}>{ultimo ? 'Começar' : 'Próximo'}</button>
        </div>
      </div>
    </div>,
    document.body
  )
}

import { useEffect, useState } from 'react'
import { useEstado } from './data/store'
import './data/drive'
import { useRota, Navegacao } from './components/ui'
import { Splash, BoasVindas } from './screens/Abertura'
import Inicio from './screens/Inicio'
import Gestacao from './screens/Gestacao'
import Diabetes from './screens/Diabetes'
import Desenvolvimento from './screens/Desenvolvimento'
import Mais from './screens/Mais'

const ABA_DA_ROTA = { inicio: 'inicio', diabetes: 'inicio', gestacao: 'gestacao', desenvolvimento: 'desenvolvimento', mais: 'mais' }

export default function App() {
  const { perfil } = useEstado()
  const [rota, sub] = useRota()
  const pagina = ABA_DA_ROTA[rota] ? rota : 'inicio'
  const [abrindo, setAbrindo] = useState(!rota)

  // Splash rápida ao abrir o app (como em app nativo)
  useEffect(() => {
    if (!abrindo) return
    const t = setTimeout(() => setAbrindo(false), 1400)
    return () => clearTimeout(t)
  }, [abrindo])

  if (!perfil.nome) return <div className="app"><BoasVindas /></div>
  if (abrindo) return <div className="app"><Splash /></div>

  const telas = {
    inicio: <Inicio />,
    gestacao: <Gestacao />,
    diabetes: <Diabetes sub={sub} />,
    desenvolvimento: <Desenvolvimento />,
    mais: <Mais sub={sub} />,
  }

  return (
    <div className="app com-nav">
      <main key={`${pagina}/${sub || ''}`}>{telas[pagina]}</main>
      <Navegacao atual={ABA_DA_ROTA[pagina]} />
    </div>
  )
}

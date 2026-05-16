import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import MiComponente from './componentes/MiComponente.jsx'
import Tarjeta from './componentes/Tarjeta.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Tarjeta
      imagen="hor"
      nombre="Hormiga"
      region="México"
      texto="Es el Mejor Jugador de México"
    />
    
    <Tarjeta
      imagen="mi"
      nombre="Hormiga"
      region="México"
      texto="Es el Mejor Jugador de México"
    />

    <Tarjeta
      imagen="ga"
      nombre="Hormiga"
      region="México"
      texto="Es el Mejor Jugador de México"
    />
  </StrictMode>,
)

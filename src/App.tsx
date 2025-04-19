import { useState } from 'react'
import './App.css'
import TesouroIndividual from './TesouroIndividual'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <TesouroIndividual />
    </>
  )
}

export default App

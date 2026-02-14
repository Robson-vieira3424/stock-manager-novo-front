
import './App.css'
import { ContextProvider } from './contexts/AuthContext'

import Routers from './routes/route'
function App() {
  return (
      <ContextProvider>
        <Routers />
      </ContextProvider>
  )
}


export default App

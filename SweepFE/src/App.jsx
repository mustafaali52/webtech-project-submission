import { BrowserRouter as Router } from 'react-router-dom'
import AuthInitializer from './components/AuthInitializer'
import AppContent from './components/AppContent'

function App() {
  return (
    <AuthInitializer>
      <Router>
        <AppContent />
      </Router>
    </AuthInitializer>
  )
}

export default App

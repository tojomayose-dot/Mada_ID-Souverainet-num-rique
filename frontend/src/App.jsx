import Sidebar from './components/Sidebar'
import DashboardHome from './pages/DashboardHome'

function App() {
  return (
    <div style={{ display: 'flex', height: '100vh' }}>

      {/*  La barre à gauche */}
      <Sidebar />

      {/*  Le contenu à droite */}
      <main style={{
        flex: 1,
        padding: '2rem',
        overflowY: 'auto'
      }}>
        <DashboardHome />
      </main>

    </div>
  )
}

export default App
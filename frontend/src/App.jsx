import { useState } from 'react'
import Sidebar from './components/Sidebar'
import DashboardHome from './pages/DashboardHome'
import CitoyensPage from './pages/CitoyensPage'
import InstitutionsPage from './pages/InstitutionsPage'
import CertificatsPage from './pages/CertificatsPage'

function App() {
  const [pageCourante, setPageCourante] = useState('dashboard')

  return (
    <div style={{ display: 'flex', height: '100vh' }}>

      {/*  La barre à gauche */}
      <Sidebar
        pageCourante={pageCourante}
        changerPage={setPageCourante}
      />

      {/*  Le contenu à droite */}
      <main style={{
        flex: 1,
        padding: '2rem',
        overflowY: 'auto'
      }}>
        {pageCourante === 'dashboard' && <DashboardHome />}
        {pageCourante === 'citoyens' && <CitoyensPage />}
        {pageCourante === 'institutions' && <InstitutionsPage />}
        {pageCourante === 'certificats' && <CertificatsPage />}
      </main>

    </div>
  )
}

export default App
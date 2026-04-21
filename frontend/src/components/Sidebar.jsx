function Sidebar({ pageCourante, changerPage }) {
  return (
    <div style={{
      width: '220px',
      minHeight: '100vh',
      backgroundColor: '#0A1628',
      padding: '1.5rem 1rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    }}>

      {/* 🏷️ Logo */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '2rem'
      }}>
        <div style={{
          width: '32px',
          height: '32px',
          backgroundColor: '#378ADD',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: '500',
          fontSize: '14px'
        }}>M</div>
        <span style={{
          color: 'white',
          fontWeight: '500',
          fontSize: '16px'
        }}>MADA-ID</span>
      </div>

      {/* 🔗 Liens de navigation */}
      <NavItem
        label="Dashboard"
        actif={pageCourante === 'dashboard'}
        onClick={() => changerPage('dashboard')}
      />
      <NavItem
        label="Citoyens"
        actif={pageCourante === 'citoyens'}
        onClick={() => changerPage('citoyens')}
      />
      <NavItem
        label="Institutions"
        actif={pageCourante === 'institutions'}
        onClick={() => changerPage('institutions')}
      />
      <NavItem
        label="Certificats"
        actif={pageCourante === 'certificats'}
        onClick={() => changerPage('certificats')}
      />

    </div>
  )
}

function NavItem({ label, actif, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        padding: '10px 14px',
        borderRadius: '8px',
        backgroundColor: actif ? '#378ADD' : 'transparent',
        color: actif ? 'white' : '#8BACD0',
        cursor: 'pointer',
        fontWeight: actif ? '500' : '400',
        fontSize: '14px',
      }}>
      {label}
    </div>
  )
}

export default Sidebar
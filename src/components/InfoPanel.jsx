function InfoPanel({ building, onClose }) {
  if (!building) return null

  return (
    <div onClick={onClose} style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(0,0,0,0.7)',
      zIndex: 1000
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        background: 'rgba(10, 10, 31, 0.95)',
        border: '2px solid ' + building.color,
        borderRadius: '16px',
        padding: '30px',
        minWidth: '300px',
        color: 'white',
        fontFamily: 'monospace',
        boxShadow: `0 0 40px ${building.color}80`
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            fontSize: '36px', 
            fontWeight: 'bold',
            color: building.color,
            marginBottom: '10px'
          }}>
            {building.name}
          </div>
          <div style={{ fontSize: '24px', marginBottom: '20px' }}>
            {building.value}
          </div>
          <div style={{ 
            fontSize: '12px', 
            opacity: 0.6,
            marginTop: '20px'
          }}>
            Click anywhere to close
          </div>
        </div>
      </div>
    </div>
  )
}

export default InfoPanel

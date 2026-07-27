import { Suspense, useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import DataCity from './components/DataCity'
import InfoPanel from './components/InfoPanel'
import Particles from './components/Particles'
import './App.css'

function TimeBasedLighting() {
  const [timeOfDay, setTimeOfDay] = useState('day')

  useEffect(() => {
    const updateTime = () => {
      const hour = new Date().getHours()
      if (hour >= 6 && hour < 18) {
        setTimeOfDay('day')
      } else if (hour >= 18 && hour < 20) {
        setTimeOfDay('dusk')
      } else {
        setTimeOfDay('night')
      }
    }
    
    updateTime()
    const interval = setInterval(updateTime, 60000)
    return () => clearInterval(interval)
  }, [])

  const lighting = {
    day: { ambient: 0.6, directional: 1.2, fog: 40 },
    dusk: { ambient: 0.4, directional: 0.8, fog: 35 },
    night: { ambient: 0.3, directional: 0.6, fog: 30 }
  }

  const current = lighting[timeOfDay]

  return (
    <>
      <ambientLight intensity={current.ambient} />
      <directionalLight position={[10, 20, 10]} intensity={current.directional} castShadow />
      <fog attach="fog" args={['#0a0a1f', 30, current.fog]} />
    </>
  )
}

function App() {
  const [selectedBuilding, setSelectedBuilding] = useState(null)
  const [useLiveData, setUseLiveData] = useState(false)

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000' }}>
      <Canvas camera={{ position: [25, 20, 25], fov: 60 }}>
        <color attach="background" args={['#0a0a1f']} />
        
        <TimeBasedLighting />
        
        <pointLight position={[-15, 8, -15]} intensity={0.8} color="#f7931a" />
        <pointLight position={[15, 8, -15]} intensity={0.8} color="#4078c0" />
        <pointLight position={[-15, 8, 15]} intensity={0.8} color="#4a9eff" />
        <pointLight position={[15, 8, 15]} intensity={0.8} color="#00ff88" />
        
        <Suspense fallback={null}>
          <Stars radius={100} depth={50} count={5000} factor={4} fade speed={1} />
          <Particles count={800} />
          <DataCity onBuildingClick={setSelectedBuilding} useLiveData={useLiveData} />
        </Suspense>
        
        <OrbitControls 
          enableDamping 
          dampingFactor={0.05}
          minDistance={10}
          maxDistance={60}
          maxPolarAngle={Math.PI / 2.2}
        />
      </Canvas>
      
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        color: 'white',
        fontFamily: 'monospace',
        textShadow: '0 0 10px rgba(0,0,0,0.8)',
        pointerEvents: 'none'
      }}>
        <h1 style={{ 
          margin: 0, 
          fontSize: '42px', 
          fontWeight: 'bold', 
          letterSpacing: '3px',
          background: 'linear-gradient(90deg, #00ffff, #ff00ff)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          DATA CITY
        </h1>
        <p style={{ margin: '8px 0 0 0', opacity: 0.8, fontSize: '14px' }}>
          Real-time data visualization in 3D
        </p>
      </div>

      <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        pointerEvents: 'auto'
      }}>
        <button
          onClick={() => setUseLiveData(!useLiveData)}
          style={{
            background: useLiveData ? 'rgba(0, 255, 136, 0.2)' : 'rgba(255, 255, 255, 0.1)',
            border: useLiveData ? '2px solid #00ff88' : '2px solid rgba(255, 255, 255, 0.3)',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '8px',
            fontFamily: 'monospace',
            fontSize: '12px',
            cursor: 'pointer',
            transition: 'all 0.3s'
          }}
        >
          {useLiveData ? '● LIVE DATA' : '○ DEMO DATA'}
        </button>
      </div>

      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '20px',
        color: 'white',
        fontFamily: 'monospace',
        fontSize: '12px',
        opacity: 0.6,
        pointerEvents: 'none',
        background: 'rgba(0,0,0,0.5)',
        padding: '10px 15px',
        borderRadius: '8px'
      }}>
        <div>Drag to rotate • Scroll to zoom • Click buildings</div>
        <div style={{ marginTop: '5px' }}>
          <span style={{ color: '#f7931a' }}>■</span> Crypto &nbsp;
          <span style={{ color: '#4078c0' }}>■</span> GitHub &nbsp;
          <span style={{ color: '#4a9eff' }}>■</span> Weather &nbsp;
          <span style={{ color: '#00ff88' }}>■</span> Stocks
        </div>
      </div>

      <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        color: 'white',
        fontFamily: 'monospace',
        fontSize: '11px',
        opacity: 0.5,
        pointerEvents: 'none',
        textAlign: 'right',
        marginTop: '50px'
      }}>
        <div>3D Websites Hackathon</div>
        <div>by Brian</div>
      </div>

      <InfoPanel building={selectedBuilding} onClose={() => setSelectedBuilding(null)} />
    </div>
  )
}

export default App

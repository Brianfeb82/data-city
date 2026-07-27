import { Suspense, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import DataCity from './components/DataCity'
import InfoPanel from './components/InfoPanel'
import Particles from './components/Particles'
import './App.css'

function App() {
  const [selectedBuilding, setSelectedBuilding] = useState(null)

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000' }}>
      <Canvas camera={{ position: [25, 20, 25], fov: 60 }}>
        <color attach="background" args={['#0a0a1f']} />
        <fog attach="fog" args={['#0a0a1f', 30, 70]} />
        
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 20, 10]} intensity={1} castShadow />
        <pointLight position={[-15, 8, -15]} intensity={0.8} color="#f7931a" />
        <pointLight position={[15, 8, -15]} intensity={0.8} color="#4078c0" />
        <pointLight position={[-15, 8, 15]} intensity={0.8} color="#4a9eff" />
        <pointLight position={[15, 8, 15]} intensity={0.8} color="#00ff88" />
        
        <Suspense fallback={null}>
          <Stars radius={100} depth={50} count={5000} factor={4} fade speed={1} />
          <Particles count={800} />
          <DataCity onBuildingClick={setSelectedBuilding} />
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
        <div>🖱️ Drag to rotate • Scroll to zoom • Click buildings</div>
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
        textAlign: 'right'
      }}>
        <div>3D Websites Hackathon</div>
        <div>by Brian</div>
      </div>

      <InfoPanel building={selectedBuilding} onClose={() => setSelectedBuilding(null)} />
    </div>
  )
}

export default App

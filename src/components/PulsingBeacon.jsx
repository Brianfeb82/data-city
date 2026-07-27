import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

function PulsingBeacon() {
  const sphereRef = useRef()
  const cylinderRef = useRef()

  useFrame((state) => {
    if (sphereRef.current) {
      const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.5 + 1
      sphereRef.current.scale.set(pulse, pulse, pulse)
      sphereRef.current.material.emissiveIntensity = pulse * 3
    }
    
    if (cylinderRef.current) {
      cylinderRef.current.rotation.y = state.clock.elapsedTime * 0.5
    }
  })

  return (
    <group>
      <mesh ref={cylinderRef} position={[0, 4, 0]}>
        <cylinderGeometry args={[0.2, 0.3, 8, 8]} />
        <meshStandardMaterial
          color="#00ffff"
          emissive="#00ffff"
          emissiveIntensity={2}
          metalness={1}
          roughness={0.1}
        />
      </mesh>
      
      <mesh ref={sphereRef} position={[0, 8, 0]}>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshStandardMaterial
          color="#00ffff"
          emissive="#00ffff"
          emissiveIntensity={3}
          toneMapped={false}
        />
      </mesh>
      
      <pointLight position={[0, 8, 0]} intensity={2} color="#00ffff" distance={20} />
    </group>
  )
}

export default PulsingBeacon

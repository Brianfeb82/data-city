import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'

function Building({ position, height, color, name, value, onClick }) {
  const meshRef = useRef()
  
  const handleClick = (e) => {
    e.stopPropagation()
    if (onClick) {
      onClick({ name, value, color, height, position })
    }
  }

  useFrame((state) => {
    if (meshRef.current) {
      const breathe = Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.02 + 1
      meshRef.current.scale.y = breathe
      
      // Pulsing glow
      if (meshRef.current.material) {
        const pulse = Math.sin(state.clock.elapsedTime * 3) * 0.2 + 0.5
        meshRef.current.material.emissiveIntensity = pulse
      }
    }
  })

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        castShadow
        onClick={handleClick}
        onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = 'pointer' }}
        onPointerOut={() => { document.body.style.cursor = 'default' }}
      >
        <boxGeometry args={[1.2, height, 1.2]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.3}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      <mesh position={[0, height / 2 + 0.1, 0]}>
        <boxGeometry args={[1.3, 0.2, 1.3]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1}
        />
      </mesh>

      <Text
        position={[0, height / 2 + 0.6, 0]}
        fontSize={0.25}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {name}
      </Text>
      
      <Text
        position={[0, height / 2 + 0.3, 0]}
        fontSize={0.15}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {value}
      </Text>

      {/* Light beam */}
      {height > 4 && (
        <mesh position={[0, height / 2, 0]}>
          <cylinderGeometry args={[0.02, 0.02, height, 8]} />
          <meshBasicMaterial color={color} transparent opacity={0.3} />
        </mesh>
      )}
    </group>
  )
}

export default Building

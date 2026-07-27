import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'

function Building({ position, height, color, name, value, onClick }) {
  const meshRef = useRef()
  const accentRef = useRef()
  
  const handleClick = (e) => {
    e.stopPropagation()
    if (onClick) {
      onClick({ name, value, color, height, position })
    }
  }

  useFrame((state) => {
    if (meshRef.current) {
      const breathe = Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.01 + 1
      meshRef.current.scale.y = breathe
      
      if (meshRef.current.material) {
        const pulse = Math.sin(state.clock.elapsedTime * 3) * 0.1 + 0.3
        meshRef.current.material.emissiveIntensity = pulse
      }
    }
    
    if (accentRef.current) {
      accentRef.current.rotation.y = state.clock.elapsedTime * 0.5
    }
  })

  return (
    <group position={position}>
      {/* Main brutalist tower */}
      <mesh
        ref={meshRef}
        castShadow
        onClick={handleClick}
        onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = 'pointer' }}
        onPointerOut={() => { document.body.style.cursor = 'default' }}
      >
        <boxGeometry args={[1.4, height, 1.4]} />
        <meshStandardMaterial
          color="#2a2a2a"
          emissive={color}
          emissiveIntensity={0.3}
          metalness={0.1}
          roughness={0.9}
        />
      </mesh>

      {/* Concrete ledges */}
      {[0.3, 0.6, 0.9].map((ratio, i) => (
        <mesh key={i} position={[0, (height * ratio) - height/2, 0]}>
          <boxGeometry args={[1.6, 0.1, 1.6]} />
          <meshStandardMaterial
            color="#1a1a1a"
            roughness={1}
            metalness={0}
          />
        </mesh>
      ))}

      {/* Top accent */}
      <mesh ref={accentRef} position={[0, height / 2 + 0.15, 0]}>
        <boxGeometry args={[1.5, 0.3, 1.5]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.8}
          metalness={0.3}
          roughness={0.7}
        />
      </mesh>

      {/* Corner pillars */}
      {[
        [0.7, 0, 0.7],
        [-0.7, 0, 0.7],
        [0.7, 0, -0.7],
        [-0.7, 0, -0.7]
      ].map((pos, i) => (
        <mesh key={i} position={pos}>
          <boxGeometry args={[0.15, height, 0.15]} />
          <meshStandardMaterial
            color="#0a0a0a"
            roughness={0.95}
            metalness={0.05}
          />
        </mesh>
      ))}

      <Text
        position={[0, height / 2 + 0.7, 0]}
        fontSize={0.25}
        color="white"
        anchorX="center"
        anchorY="middle"
        frustumCulled={false}
      >
        {name}
      </Text>
      
      <Text
        position={[0, height / 2 + 0.4, 0]}
        fontSize={0.15}
        color={color}
        anchorX="center"
        anchorY="middle"
        frustumCulled={false}
      >
        {value}
      </Text>

      {/* Vertical light strip */}
      {height > 4 && (
        <mesh position={[0, 0, 0.71]}>
          <boxGeometry args={[0.1, height, 0.05]} />
          <meshBasicMaterial color={color} transparent opacity={0.6} />
        </mesh>
      )}
    </group>
  )
}

export default Building

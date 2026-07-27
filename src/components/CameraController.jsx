import { useRef, useEffect } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const districtPositions = {
  crypto: { position: [-15, 20, -15], target: [-15, 0, -15] },
  github: { position: [15, 20, -15], target: [15, 0, -15] },
  weather: { position: [-15, 20, 15], target: [-15, 0, 15] },
  stocks: { position: [15, 20, 15], target: [15, 0, 15] },
  overview: { position: [30, 25, 30], target: [0, 0, 0] }
}

function CameraController() {
  const { camera, controls } = useThree()
  const targetPosition = useRef(null)
  const targetLookAt = useRef(null)

  const flyToDistrict = (districtKey) => {
    const district = districtPositions[districtKey]
    if (district) {
      targetPosition.current = new THREE.Vector3(...district.position)
      targetLookAt.current = new THREE.Vector3(...district.target)
    }
  }

  useEffect(() => {
    const handleKeyPress = (e) => {
      // Number keys for districts
      if (e.key === '1') flyToDistrict('crypto')
      else if (e.key === '2') flyToDistrict('github')
      else if (e.key === '3') flyToDistrict('weather')
      else if (e.key === '4') flyToDistrict('stocks')
      else if (e.key === '0' || e.key === 'h') flyToDistrict('overview')
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [])

  useFrame(() => {
    if (targetPosition.current && targetLookAt.current) {
      // Smooth camera movement
      camera.position.lerp(targetPosition.current, 0.05)
      
      // Smooth target movement for OrbitControls
      if (controls && controls.target) {
        controls.target.lerp(targetLookAt.current, 0.05)
      }

      // Stop animation when close enough
      if (camera.position.distanceTo(targetPosition.current) < 0.1) {
        targetPosition.current = null
        targetLookAt.current = null
      }
    }
  })

  return null
}

export default CameraController

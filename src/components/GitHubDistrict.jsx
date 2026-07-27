import { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import Building from './Building'

function GitHubDistrict({ offset = [0, 0], onBuildingClick }) {
  const [buildings, setBuildings] = useState([])
  const groupRef = useRef()

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch trending repos
        const response = await fetch(
          'https://api.github.com/search/repositories?q=stars:>10000&sort=stars&order=desc&per_page=12'
        )
        const data = await response.json()
        
        if (data.items) {
          const buildingData = data.items.map((repo, index) => {
            const stars = repo.stargazers_count
            const height = Math.log10(stars) * 2
            
            const gridSize = 3
            const x = (index % gridSize) * 3 - (gridSize * 1.5) + offset[0]
            const z = Math.floor(index / gridSize) * 3 - (gridSize * 1.5) + offset[1]
            
            return {
              id: repo.id,
              name: repo.name.substring(0, 10),
              position: [x, height / 2, z],
              height: height,
              color: '#4078c0',
              change: repo.open_issues_count / 10,
              price: stars,
              marketCap: repo.forks_count,
              label: `⭐ ${(stars / 1000).toFixed(1)}k`
            }
          })
          
          setBuildings(buildingData)
        }
      } catch (error) {
        console.error('Error fetching GitHub data:', error)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 60000)
    return () => clearInterval(interval)
  }, [offset])

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.15) * 0.03
    }
  })

  return (
    <group ref={groupRef}>
      {buildings.map((building) => (
        <Building key={building.id} {...building} district="github" onClick={onBuildingClick} />
      ))}
    </group>
  )
}

export default GitHubDistrict

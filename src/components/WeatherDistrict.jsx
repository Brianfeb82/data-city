import { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import Building from './Building'

function WeatherDistrict({ offset = [0, 0], onBuildingClick }) {
  const [buildings, setBuildings] = useState([])
  const groupRef = useRef()

  // Major cities with coordinates
  const cities = [
    { name: 'Tokyo', lat: 35.6762, lon: 139.6503 },
    { name: 'Delhi', lat: 28.7041, lon: 77.1025 },
    { name: 'Shanghai', lat: 31.2304, lon: 121.4737 },
    { name: 'São Paulo', lat: -23.5505, lon: -46.6333 },
    { name: 'Mumbai', lat: 19.0760, lon: 72.8777 },
    { name: 'Cairo', lat: 30.0444, lon: 31.2357 },
    { name: 'Beijing', lat: 39.9042, lon: 116.4074 },
    { name: 'Dhaka', lat: 23.8103, lon: 90.4125 },
    { name: 'Mexico City', lat: 19.4326, lon: -99.1332 },
    { name: 'Osaka', lat: 34.6937, lon: 135.5023 },
    { name: 'NYC', lat: 40.7128, lon: -74.0060 },
    { name: 'Istanbul', lat: 41.0082, lon: 28.9784 },
  ]

  useEffect(() => {
    const fetchData = async () => {
      try {
        const buildingData = await Promise.all(
          cities.map(async (city, index) => {
            try {
              const response = await fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current_weather=true`
              )
              const data = await response.json()
              
              const temp = data.current_weather?.temperature || 20
              const windSpeed = data.current_weather?.windspeed || 0
              
              // Height based on temperature (normalized to 0-40°C range)
              const height = Math.max(1, (temp + 20) / 10)
              
              const gridSize = 3
              const x = (index % gridSize) * 3 - (gridSize * 1.5) + offset[0]
              const z = Math.floor(index / gridSize) * 3 - (gridSize * 1.5) + offset[1]
              
              // Color based on temperature
              let color = '#4a9eff' // cold
              if (temp > 25) color = '#ff4a4a' // hot
              else if (temp > 15) color = '#ffa500' // warm
              
              return {
                id: city.name,
                name: city.name,
                position: [x, height / 2, z],
                height: height,
                color: color,
                change: windSpeed / 5,
                price: temp,
                marketCap: windSpeed,
                label: `${temp}°C`
              }
            } catch (error) {
              console.error(`Error fetching weather for ${city.name}:`, error)
              return null
            }
          })
        )
        
        setBuildings(buildingData.filter(b => b !== null))
      } catch (error) {
        console.error('Error fetching weather data:', error)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 300000) // 5 min
    return () => clearInterval(interval)
  }, [offset])

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.12) * 0.04
    }
  })

  return (
    <group ref={groupRef}>
      {buildings.map((building) => (
        <Building key={building.id} {...building} district="weather" onClick={onBuildingClick} />
      ))}
    </group>
  )
}

export default WeatherDistrict

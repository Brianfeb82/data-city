import { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import Building from './Building'

function StockDistrict({ offset = [0, 0], onBuildingClick }) {
  const [buildings, setBuildings] = useState([])
  const groupRef = useRef()

  // Major stock symbols
  const stocks = [
    { symbol: 'AAPL', name: 'Apple' },
    { symbol: 'MSFT', name: 'Microsoft' },
    { symbol: 'GOOGL', name: 'Google' },
    { symbol: 'AMZN', name: 'Amazon' },
    { symbol: 'NVDA', name: 'Nvidia' },
    { symbol: 'TSLA', name: 'Tesla' },
    { symbol: 'META', name: 'Meta' },
    { symbol: 'BRK.B', name: 'Berkshire' },
    { symbol: 'JPM', name: 'JPMorgan' },
    { symbol: 'V', name: 'Visa' },
    { symbol: 'WMT', name: 'Walmart' },
    { symbol: 'MA', name: 'Mastercard' },
  ]

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Generate realistic-looking demo data since we need API keys for real stock data
        const buildingData = stocks.map((stock, index) => {
          // Simulate prices and changes
          const basePrice = 100 + Math.random() * 400
          const change = (Math.random() - 0.5) * 10
          const marketCap = basePrice * (Math.random() * 2 + 1) * 1e9
          
          const height = Math.log10(marketCap) / 2
          
          const gridSize = 3
          const x = (index % gridSize) * 3 - (gridSize * 1.5) + offset[0]
          const z = Math.floor(index / gridSize) * 3 - (gridSize * 1.5) + offset[1]
          
          // Color based on sector
          const colors = ['#00ff88', '#00ddff', '#ff6b6b', '#ffd93d', '#6bcf7f', '#a78bfa']
          const color = colors[index % colors.length]
          
          return {
            id: stock.symbol,
            name: stock.symbol,
            position: [x, height / 2, z],
            height: height,
            color: color,
            change: change,
            price: basePrice,
            marketCap: marketCap,
            label: `$${basePrice.toFixed(2)}`
          }
        })
        
        setBuildings(buildingData)
      } catch (error) {
        console.error('Error generating stock data:', error)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 45000) // Update every 45s for animation
    return () => clearInterval(interval)
  }, [offset])

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.18) * 0.025
    }
  })

  return (
    <group ref={groupRef}>
      {buildings.map((building) => (
        <Building key={building.id} {...building} district="stocks" onClick={onBuildingClick} />
      ))}
    </group>
  )
}

export default StockDistrict

import { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import Building from './Building'
import PulsingBeacon from './PulsingBeacon'

// Demo data - no API calls
const cryptoData = [
  { name: 'BTC', value: '$45K', height: 6, color: '#f7931a' },
  { name: 'ETH', value: '$2.5K', height: 5, color: '#627eea' },
  { name: 'BNB', value: '$320', height: 4, color: '#f3ba2f' },
  { name: 'SOL', value: '$98', height: 4.5, color: '#14f195' },
  { name: 'XRP', value: '$0.52', height: 3.5, color: '#23292f' },
  { name: 'ADA', value: '$0.45', height: 3, color: '#0033ad' },
  { name: 'DOGE', value: '$0.08', height: 2.5, color: '#c2a633' },
  { name: 'DOT', value: '$6.2', height: 3.5, color: '#e6007a' },
  { name: 'MATIC', value: '$0.72', height: 3, color: '#8247e5' },
]

const githubData = [
  { name: 'React', value: '220K⭐', height: 5.5, color: '#61dafb' },
  { name: 'Vue', value: '207K⭐', height: 5.4, color: '#42b883' },
  { name: 'Next.js', value: '120K⭐', height: 5, color: '#000000' },
  { name: 'Vite', value: '65K⭐', height: 4.5, color: '#646cff' },
  { name: 'Angular', value: '95K⭐', height: 4.8, color: '#dd0031' },
  { name: 'Svelte', value: '76K⭐', height: 4.6, color: '#ff3e00' },
  { name: 'Nuxt', value: '51K⭐', height: 4.2, color: '#00dc82' },
  { name: 'Remix', value: '28K⭐', height: 3.8, color: '#121212' },
  { name: 'Astro', value: '43K⭐', height: 4, color: '#ff5d01' },
]

const weatherData = [
  { name: 'Tokyo', value: '18°C', height: 3.8, color: '#4a9eff' },
  { name: 'NYC', value: '12°C', height: 3.2, color: '#4a9eff' },
  { name: 'London', value: '8°C', height: 2.8, color: '#6ba3ff' },
  { name: 'Dubai', value: '32°C', height: 5.2, color: '#ff4a4a' },
  { name: 'Sydney', value: '22°C', height: 4.2, color: '#ffa500' },
  { name: 'Mumbai', value: '28°C', height: 4.8, color: '#ff6b4a' },
  { name: 'Paris', value: '10°C', height: 3, color: '#6ba3ff' },
  { name: 'Rio', value: '26°C', height: 4.6, color: '#ff8c4a' },
  { name: 'Moscow', value: '-2°C', height: 2, color: '#a3c9ff' },
]

const stockData = [
  { name: 'AAPL', value: '$178', height: 5.5, color: '#00ff88' },
  { name: 'MSFT', value: '$420', height: 6, color: '#00ddff' },
  { name: 'GOOGL', value: '$142', height: 5.2, color: '#ff6b6b' },
  { name: 'TSLA', value: '$245', height: 4.8, color: '#ffd93d' },
  { name: 'NVDA', value: '$875', height: 6.5, color: '#a78bfa' },
  { name: 'META', value: '$485', height: 5.8, color: '#6bcf7f' },
  { name: 'AMZN', value: '$178', height: 5.5, color: '#ff9f40' },
  { name: 'NFLX', value: '$612', height: 5.6, color: '#e50914' },
  { name: 'JPM', value: '$198', height: 5, color: '#0070ba' },
]

function District({ data, offset, label, labelColor, onBuildingClick, useLiveData, dataType }) {
  const gridSize = 3
  const ringRef = useRef()
  const [liveData, setLiveData] = useState(data)

  useEffect(() => {
    if (!useLiveData || dataType !== 'crypto') {
      setLiveData(data)
      return
    }

    const fetchLiveData = async () => {
      try {
        const symbols = ['bitcoin', 'ethereum', 'binancecoin', 'solana', 'ripple', 'cardano', 'dogecoin', 'polkadot', 'matic-network']
        const response = await fetch(`https://api.coincap.io/v2/assets?ids=${symbols.join(',')}`)
        const result = await response.json()
        
        if (result.data) {
          const updated = result.data.map((crypto, index) => {
            const price = parseFloat(crypto.priceUsd)
            const marketCap = parseFloat(crypto.marketCapUsd)
            const height = Math.log10(marketCap) / 2
            
            return {
              name: crypto.symbol,
              value: price > 1000 ? `$${(price/1000).toFixed(1)}K` : `$${price.toFixed(2)}`,
              height: height,
              color: data[index]?.color || '#ffffff'
            }
          })
          setLiveData(updated)
        }
      } catch (error) {
        console.error('Failed to fetch live data:', error)
      }
    }

    fetchLiveData()
    const interval = setInterval(fetchLiveData, 30000)
    return () => clearInterval(interval)
  }, [useLiveData, dataType, data])

  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.z = state.clock.elapsedTime * 0.5
    }
  })

  return (
    <group>
      <Text
        position={[offset[0], 7, offset[1] - 6]}
        fontSize={1}
        color={labelColor}
        anchorX="center"
        anchorY="middle"
      >
        {label}
      </Text>
      
      {/* District boundary ring */}
      <mesh ref={ringRef} position={[offset[0], 0.1, offset[1]]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[6, 0.05, 16, 64]} />
        <meshBasicMaterial color={labelColor} transparent opacity={0.4} />
      </mesh>
      
      {liveData.map((item, index) => {
        const x = (index % gridSize) * 2.5 - 2.5 + offset[0]
        const z = Math.floor(index / gridSize) * 2.5 - 2.5 + offset[1]
        
        return (
          <Building
            key={item.name}
            position={[x, item.height / 2, z]}
            height={item.height}
            color={item.color}
            name={item.name}
            value={item.value}
            onClick={onBuildingClick}
          />
        )
      })}
    </group>
  )
}

function DataCity({ onBuildingClick, useLiveData }) {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial color="#0a0a1f" metalness={0.8} roughness={0.2} />
      </mesh>

      <gridHelper args={[60, 60, '#1a1a3f', '#0f0f2f']} />

      <District 
        data={cryptoData} 
        offset={[-10, -10]} 
        label="CRYPTO" 
        labelColor="#f7931a"
        onBuildingClick={onBuildingClick}
        useLiveData={useLiveData}
        dataType="crypto"
      />
      
      <District 
        data={githubData} 
        offset={[10, -10]} 
        label="GITHUB" 
        labelColor="#4078c0"
        onBuildingClick={onBuildingClick}
      />
      
      <District 
        data={weatherData} 
        offset={[-10, 10]} 
        label="WEATHER" 
        labelColor="#4a9eff"
        onBuildingClick={onBuildingClick}
      />
      
      <District 
        data={stockData} 
        offset={[10, 10]} 
        label="STOCKS" 
        labelColor="#00ff88"
        onBuildingClick={onBuildingClick}
      />

      <PulsingBeacon />
    </group>
  )
}

export default DataCity

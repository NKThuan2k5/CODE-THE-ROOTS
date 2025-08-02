import React, { useState, useEffect } from 'react'

const MapView = ({ stations, onStationClick }) => {
  const [playerPosition, setPlayerPosition] = useState({ x: 50, y: 50 })
  const [deviceMotion, setDeviceMotion] = useState({ x: 0, y: 0, z: 0 })
  const [deviceOrientation, setDeviceOrientation] = useState({ alpha: 0, beta: 0, gamma: 0 })
  const [motionPermission, setMotionPermission] = useState(false)
  const [orientationPermission, setOrientationPermission] = useState(false)
  const [nearbyStations, setNearbyStations] = useState([])
  const [mapImage, setMapImage] = useState('')

  // Fallback map image if import fails
  useEffect(() => {
    try {
      import('../image/bieu do.jpg').then(module => {
        setMapImage(module.default)
      }).catch(() => {
        // Use placeholder if image fails to load
        setMapImage('https://via.placeholder.com/800x600/1a1a1a/ffd700?text=Địa+Đạo+Phú+Thọ+Hòa')
      })
    } catch (error) {
      console.log('Map image error:', error)
      setMapImage('https://via.placeholder.com/800x600/1a1a1a/ffd700?text=Địa+Đạo+Phú+Thọ+Hòa')
    }
  }, [])

  useEffect(() => {
    // Request device motion and orientation permissions
    const requestPermissions = async () => {
      try {
        // Request device motion permission
        if (window.DeviceMotionEvent && 'requestPermission' in window.DeviceMotionEvent) {
          const motionPermission = await window.DeviceMotionEvent.requestPermission()
          setMotionPermission(motionPermission === 'granted')
        } else {
          setMotionPermission(true) // Fallback for browsers that don't require permission
        }

        // Request device orientation permission
        if (window.DeviceOrientationEvent && 'requestPermission' in window.DeviceOrientationEvent) {
          const orientationPermission = await window.DeviceOrientationEvent.requestPermission()
          setOrientationPermission(orientationPermission === 'granted')
        } else {
          setOrientationPermission(true) // Fallback for browsers that don't require permission
        }
      } catch (error) {
        console.log('Permission request failed:', error)
        setMotionPermission(false)
        setOrientationPermission(false)
      }
    }

    requestPermissions()
  }, [])

  useEffect(() => {
    let motionHandler = null
    let orientationHandler = null

    if (motionPermission) {
      // Handle device motion (acceleration) - for quick movements
      motionHandler = (event) => {
        try {
          const { accelerationIncludingGravity } = event
          if (accelerationIncludingGravity) {
            const { x, y, z } = accelerationIncludingGravity
            setDeviceMotion({ x: x || 0, y: y || 0, z: z || 0 })
            
            // Use acceleration for quick movements/shaking
            const acceleration = Math.sqrt((x || 0) ** 2 + (y || 0) ** 2 + (z || 0) ** 2)
            if (acceleration > 15) { // Threshold for significant movement
              setPlayerPosition(prev => {
                const sensitivity = 2.0
                const newX = Math.max(0, Math.min(100, prev.x + (x || 0) * sensitivity))
                const newY = Math.max(0, Math.min(100, prev.y + (y || 0) * sensitivity))
                return { x: newX, y: newY }
              })
            }
          }
        } catch (error) {
          console.log('Motion handler error:', error)
        }
      }

      window.addEventListener('devicemotion', motionHandler)
    }

    if (orientationPermission) {
      // Handle device orientation (rotation) - primary movement control
      orientationHandler = (event) => {
        try {
          const { alpha, beta, gamma } = event
          setDeviceOrientation({ alpha: alpha || 0, beta: beta || 0, gamma: gamma || 0 })
          
          // Use orientation for smooth player movement
          setPlayerPosition(prev => {
            const sensitivity = 0.8
            
            // Gamma controls horizontal movement (left/right tilt)
            const gammaMovement = (gamma || 0) * sensitivity
            const newX = Math.max(0, Math.min(100, prev.x + gammaMovement))
            
            // Beta controls vertical movement (forward/backward tilt)
            const betaMovement = (beta || 0) * sensitivity
            const newY = Math.max(0, Math.min(100, prev.y + betaMovement))
            
            // Alpha can be used for rotation or additional movement
            const alphaMovement = (alpha || 0) * 0.3
            
            return { 
              x: newX + alphaMovement, 
              y: newY 
            }
          })
        } catch (error) {
          console.log('Orientation handler error:', error)
        }
      }

      window.addEventListener('deviceorientation', orientationHandler)
    }

    return () => {
      if (motionHandler) {
        window.removeEventListener('devicemotion', motionHandler)
      }
      if (orientationHandler) {
        window.removeEventListener('deviceorientation', orientationHandler)
      }
    }
  }, [motionPermission, orientationPermission])

  useEffect(() => {
    // Check for nearby stations based on player position
    const nearby = stations.filter(station => {
      try {
        const distance = Math.sqrt(
          Math.pow(station.position.x - playerPosition.x, 2) +
          Math.pow(station.position.y - playerPosition.y, 2)
        )
        return distance < 15 // Within 15 units
      } catch (error) {
        console.log('Distance calculation error:', error)
        return false
      }
    })
    setNearbyStations(nearby)
  }, [playerPosition, stations])

  const handleManualMove = (direction) => {
    try {
      const moveAmount = 5
      setPlayerPosition(prev => {
        switch (direction) {
          case 'up':
            return { ...prev, y: Math.max(0, prev.y - moveAmount) }
          case 'down':
            return { ...prev, y: Math.min(100, prev.y + moveAmount) }
          case 'left':
            return { ...prev, x: Math.max(0, prev.x - moveAmount) }
          case 'right':
            return { ...prev, x: Math.min(100, prev.x + moveAmount) }
          default:
            return prev
        }
      })
    } catch (error) {
      console.log('Manual move error:', error)
    }
  }

  return (
    <div className="map-container" style={{
      position: 'relative',
      width: '100%',
      height: '100vh',
      background: 'linear-gradient(135deg, #000428 0%, #004e92 100%)',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {/* Map Background */}
      {mapImage && (
        <img
          src={mapImage}
          alt="Bản đồ địa đạo Phú Thọ Hòa"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 1
          }}
          onError={(e) => {
            console.log('Map image failed to load')
            e.target.src = 'https://via.placeholder.com/800x600/1a1a1a/ffd700?text=Địa+Đạo+Phú+Thọ+Hòa'
          }}
        />
      )}

      {/* Progress Indicator */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        background: 'rgba(0,0,0,0.8)',
        color: '#ffd700',
        padding: '0.5rem 1rem',
        borderRadius: '10px',
        fontSize: '0.9rem',
        fontWeight: 'bold',
        zIndex: 10
      }}>
        💎 {stations.length}/7 Điểm Khám Phá
      </div>

      {/* Player Icon */}
      <div style={{
        position: 'absolute',
        left: `${playerPosition.x}%`,
        top: `${playerPosition.y}%`,
        transform: 'translate(-50%, -50%)',
        fontSize: '2rem',
        zIndex: 15,
        filter: 'drop-shadow(0 0 10px rgba(255, 215, 0, 0.8))',
        animation: 'playerPulse 2s ease-in-out infinite'
      }}>
        👤
      </div>

      {/* Station Buttons */}
      {stations.map((station) => {
        const isNearby = nearbyStations.some(nearby => nearby.id === station.id)
        return (
          <button
            key={station.id}
            onClick={() => onStationClick(station)}
            style={{
              position: 'absolute',
              left: `${station.position.x}%`,
              top: `${station.position.y}%`,
              transform: 'translate(-50%, -50%)',
              background: isNearby ? 'rgba(255, 215, 0, 0.9)' : 'rgba(218, 37, 29, 0.9)',
              color: '#fff',
              border: '3px solid #ffd700',
              borderRadius: '50%',
              width: '60px',
              height: '60px',
              fontSize: '1.5rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: isNearby ? '0 0 30px rgba(255, 215, 0, 0.8)' : '0 0 20px rgba(218, 37, 29, 0.6)',
              animation: isNearby ? 'stationPulse 2s infinite' : 'none',
              zIndex: 5,
              transition: 'all 0.3s ease'
            }}
          >
            {station.icon}
          </button>
        )
      })}

      {/* Player Position Indicator */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '20px',
        background: 'rgba(0,0,0,0.8)',
        color: '#ffd700',
        padding: '0.5rem',
        borderRadius: '5px',
        fontSize: '0.8rem'
      }}>
        📍 Vị trí: ({Math.round(playerPosition.x)}, {Math.round(playerPosition.y)})
      </div>

      {/* Motion Status */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        right: '20px',
        background: 'rgba(0,0,0,0.8)',
        color: motionPermission ? '#00ff00' : '#ff4444',
        padding: '0.5rem',
        borderRadius: '5px',
        fontSize: '0.8rem'
      }}>
        📱 {motionPermission ? 'Motion Active' : 'Motion Disabled'}
      </div>

      {/* Nearby Stations Count */}
      <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        background: 'rgba(0,0,0,0.8)',
        color: '#ffd700',
        padding: '0.5rem',
        borderRadius: '5px',
        fontSize: '0.8rem'
      }}>
        🎯 Hiện vật gần: {nearbyStations.length}
      </div>

      {/* Manual Controls (Fallback) */}
      {!motionPermission && (
        <div style={{
          position: 'absolute',
          bottom: '80px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '10px',
          zIndex: 10
        }}>
          <button
            onClick={() => handleManualMove('up')}
            style={{
              background: '#ffd700',
              color: '#000',
              border: 'none',
              padding: '10px',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '1.2rem'
            }}
          >
            ⬆️
          </button>
          <button
            onClick={() => handleManualMove('left')}
            style={{
              background: '#ffd700',
              color: '#000',
              border: 'none',
              padding: '10px',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '1.2rem'
            }}
          >
            ⬅️
          </button>
          <button
            onClick={() => handleManualMove('right')}
            style={{
              background: '#ffd700',
              color: '#000',
              border: 'none',
              padding: '10px',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '1.2rem'
            }}
          >
            ➡️
          </button>
          <button
            onClick={() => handleManualMove('down')}
            style={{
              background: '#ffd700',
              color: '#000',
              border: 'none',
              padding: '10px',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '1.2rem'
            }}
          >
            ⬇️
          </button>
        </div>
      )}

      {/* Instructions */}
      <div style={{
        position: 'absolute',
        bottom: '140px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'rgba(0,0,0,0.8)',
        color: '#ffd700',
        padding: '1rem',
        borderRadius: '10px',
        textAlign: 'center',
        fontSize: '0.9rem',
        maxWidth: '400px'
      }}>
        <p style={{ margin: '0 0 0.5rem 0' }}>
          🎮 Hướng dẫn di chuyển:
        </p>
        {motionPermission ? (
          <>
            <p style={{ margin: '0.2rem 0', fontSize: '0.8rem' }}>
              • Di chuyển thiết bị để điều khiển icon 👤
            </p>
            <p style={{ margin: '0.2rem 0', fontSize: '0.8rem' }}>
              • Nghiêng thiết bị để di chuyển mượt mà
            </p>
            <p style={{ margin: '0.2rem 0', fontSize: '0.8rem' }}>
              • Lắc thiết bị để di chuyển nhanh
            </p>
          </>
        ) : (
          <>
            <p style={{ margin: '0.2rem 0', fontSize: '0.8rem' }}>
              • Sử dụng nút mũi tên để di chuyển icon 👤
            </p>
            <p style={{ margin: '0.2rem 0', fontSize: '0.8rem' }}>
              • Cho phép quyền truy cập motion để trải nghiệm tốt hơn
            </p>
          </>
        )}
        <p style={{ margin: '0.2rem 0', fontSize: '0.8rem' }}>
          • Click vào hiện vật để thu thập
        </p>
        <p style={{ margin: '0.2rem 0', fontSize: '0.8rem' }}>
          • Hiện vật sáng lên khi icon 👤 đến gần
        </p>
      </div>

      {/* CODE THE ROOTS Watermark */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        right: '20px',
        color: 'rgba(255, 215, 0, 0.6)',
        fontSize: '0.8rem',
        fontWeight: 'bold',
        zIndex: 5
      }}>
        CODE THE ROOTS
      </div>
    </div>
  )
}

export default MapView 
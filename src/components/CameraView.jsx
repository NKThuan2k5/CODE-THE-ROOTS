import React, { useState, useEffect, useRef } from 'react'

const CameraView = ({ onStationFound, onClose, stations }) => {
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [currentLocation, setCurrentLocation] = useState({ x: 50, y: 50 })
  const [nearbyStations, setNearbyStations] = useState([])
  const [selectedStation, setSelectedStation] = useState(null)
  const [isCollecting, setIsCollecting] = useState(false)
  const [deviceMotion, setDeviceMotion] = useState({ x: 0, y: 0, z: 0 })
  const [deviceOrientation, setDeviceOrientation] = useState({ alpha: 0, beta: 0, gamma: 0 })
  const [motionPermission, setMotionPermission] = useState(false)
  const [orientationPermission, setOrientationPermission] = useState(false)
  const [cameraStream, setCameraStream] = useState(null)
  const [cameraError, setCameraError] = useState(null)
  const [arMode, setArMode] = useState(true)
  const [arItems, setArItems] = useState([])
  const videoRef = useRef(null)

  // AR Item configurations
  const arItemConfigs = {
    'PT1': { 
      model: '🗺️', 
      scale: 1.5, 
      rotation: 0, 
      animation: 'float',
      color: '#ffd700',
      glow: true,
      name: 'Bản Đồ Bí Mật'
    },
    'PT2': { 
      model: '🔫', 
      scale: 1.2, 
      rotation: 45, 
      animation: 'pulse',
      color: '#da251d',
      glow: true,
      name: 'Súng Trường Cổ'
    },
    'PT3': { 
      model: '📡', 
      scale: 1.8, 
      rotation: 90, 
      animation: 'spin',
      color: '#00ff00',
      glow: true,
      name: 'Đài Liên Lạc'
    },
    'PT4': { 
      model: '🏥', 
      scale: 1.3, 
      rotation: 180, 
      animation: 'bounce',
      color: '#ff6b6b',
      glow: true,
      name: 'Bộ Dụng Cụ Y Tế'
    },
    'PT5': { 
      model: '🍳', 
      scale: 1.0, 
      rotation: 270, 
      animation: 'shake',
      color: '#ffa500',
      glow: true,
      name: 'Nồi Đồng Truyền Thống'
    },
    'PT6': { 
      model: '🛏️', 
      scale: 1.4, 
      rotation: 135, 
      animation: 'wave',
      color: '#8b4513',
      glow: true,
      name: 'Chiếu Cỏ Dân Gian'
    },
    'PT7': { 
      model: '🏛️', 
      scale: 1.6, 
      rotation: 225, 
      animation: 'orbit',
      color: '#4169e1',
      glow: true,
      name: 'Bàn Họp Truyền Thống'
    }
  }

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
    // Start real camera
    const startCamera = async () => {
      try {
        const constraints = {
          video: {
            facingMode: 'environment', // Use back camera
            width: { ideal: 1920 },
            height: { ideal: 1080 }
          },
          audio: false
        }

        const stream = await navigator.mediaDevices.getUserMedia(constraints)
        setCameraStream(stream)
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          videoRef.current.play()
        }
        
        setIsCameraActive(true)
        console.log('📷 Real camera activated')
      } catch (error) {
        console.error('Camera error:', error)
        setCameraError(error.message)
        setIsCameraActive(false)
      }
    }

    startCamera()

    // Cleanup camera on unmount
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop())
      }
    }
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
              setCurrentLocation(prev => {
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
          
          // Use orientation for smooth camera movement
          setCurrentLocation(prev => {
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
    // Check for nearby stations and create AR items
    try {
      const nearby = stations.filter(station => {
        const distance = Math.sqrt(
          Math.pow(station.position.x - currentLocation.x, 2) +
          Math.pow(station.position.y - currentLocation.y, 2)
        )
        return distance < 15 // Within 15 units
      })
      setNearbyStations(nearby)

      // Create AR items for nearby stations
      const newArItems = nearby.map(station => ({
        id: station.id,
        name: station.name,
        item: station.item,
        icon: station.icon,
        position: {
          x: station.position.x,
          y: station.position.y,
          z: Math.random() * 10 + 5 // Random depth for 3D effect
        },
        config: arItemConfigs[station.id] || arItemConfigs['PT1'],
        discovered: false,
        pulse: false
      }))
      setArItems(newArItems)
    } catch (error) {
      console.log('AR items creation error:', error)
    }
  }, [currentLocation, stations])

  const handleStationClick = (station) => {
    try {
      setSelectedStation(station)
      setIsCollecting(true)
      
      // Simulate collection process with AR effects
      setTimeout(() => {
        onStationFound(station)
        setIsCollecting(false)
        setSelectedStation(null)
        
        // Remove AR item after collection
        setArItems(prev => prev.filter(item => item.id !== station.id))
      }, 2000)
    } catch (error) {
      console.log('Station click error:', error)
    }
  }

  const handleManualMove = (direction) => {
    try {
      const moveAmount = 5
      setCurrentLocation(prev => {
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

  const switchCamera = async () => {
    try {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop())
      }
      
      const constraints = {
        video: {
          facingMode: videoRef.current?.srcObject?.getVideoTracks()[0]?.getSettings()?.facingMode === 'user' ? 'environment' : 'user'
        },
        audio: false
      }

      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      setCameraStream(stream)
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (error) {
      console.error('Camera switch error:', error)
    }
  }

  const toggleArMode = () => {
    setArMode(!arMode)
  }

  // AR Animation styles
  const getArAnimationStyle = (config) => {
    try {
      const baseStyle = {
        fontSize: `${config.scale * 2}rem`,
        color: config.color,
        textShadow: config.glow ? `0 0 20px ${config.color}` : 'none',
        transform: `rotate(${config.rotation}deg)`,
        transition: 'all 0.3s ease'
      }

      switch (config.animation) {
        case 'float':
          return { ...baseStyle, animation: 'arFloat 3s ease-in-out infinite' }
        case 'pulse':
          return { ...baseStyle, animation: 'arPulse 2s ease-in-out infinite' }
        case 'spin':
          return { ...baseStyle, animation: 'arSpin 4s linear infinite' }
        case 'bounce':
          return { ...baseStyle, animation: 'arBounce 1.5s ease-in-out infinite' }
        case 'shake':
          return { ...baseStyle, animation: 'arShake 0.5s ease-in-out infinite' }
        case 'wave':
          return { ...baseStyle, animation: 'arWave 2s ease-in-out infinite' }
        case 'orbit':
          return { ...baseStyle, animation: 'arOrbit 6s linear infinite' }
        default:
          return baseStyle
      }
    } catch (error) {
      console.log('Animation style error:', error)
      return { fontSize: '2rem', color: '#ffd700' }
    }
  }

  return (
    <div className="camera-view" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: '#000',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {/* AR Animations CSS */}
      <style jsx>{`
        @keyframes arFloat {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(0deg); }
        }
        @keyframes arPulse {
          0%, 100% { transform: scale(1) rotate(45deg); }
          50% { transform: scale(1.2) rotate(45deg); }
        }
        @keyframes arSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes arBounce {
          0%, 100% { transform: translateY(0px) rotate(180deg); }
          50% { transform: translateY(-15px) rotate(180deg); }
        }
        @keyframes arShake {
          0%, 100% { transform: translateX(0px) rotate(270deg); }
          25% { transform: translateX(-5px) rotate(270deg); }
          75% { transform: translateX(5px) rotate(270deg); }
        }
        @keyframes arWave {
          0%, 100% { transform: rotate(135deg); }
          50% { transform: rotate(145deg); }
        }
        @keyframes arOrbit {
          0% { transform: rotate(0deg) translateX(10px) rotate(0deg); }
          100% { transform: rotate(360deg) translateX(10px) rotate(-360deg); }
        }
      `}</style>

      {/* Camera Header */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        background: 'rgba(0,0,0,0.8)',
        color: '#fff',
        padding: '1rem',
        textAlign: 'center',
        zIndex: 1001
      }}>
        <h2 style={{ margin: 0, color: '#ffd700' }}>
          📷 CODE THE ROOTS - AR Khám Phá Lịch Sử
        </h2>
        <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem' }}>
          🎯 Di chuyển thiết bị để tìm hiện vật lịch sử AR
        </p>
      </div>

      {/* Real Camera Feed */}
      <div style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Video Element */}
        <video
          ref={videoRef}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: 'scaleX(-1)' // Mirror effect
          }}
          autoPlay
          playsInline
          muted
        />

        {/* AR Overlay */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: 'none'
        }}>
          {/* Crosshair */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '60px',
            height: '60px',
            border: '2px solid #ffd700',
            borderRadius: '50%',
            zIndex: 10,
            pointerEvents: 'none'
          }}>
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '4px',
              height: '4px',
              background: '#ffd700',
              borderRadius: '50%'
            }} />
          </div>

          {/* AR Items (3D Historical artifacts) */}
          {arItems.map((arItem) => (
            <div
              key={arItem.id}
              style={{
                position: 'absolute',
                left: `${arItem.position.x}%`,
                top: `${arItem.position.y}%`,
                transform: 'translate(-50%, -50%)',
                cursor: 'pointer',
                zIndex: 20,
                pointerEvents: 'auto',
                filter: 'drop-shadow(0 0 10px rgba(255, 215, 0, 0.5))'
              }}
              onClick={() => handleStationClick(arItem)}
            >
              {/* 3D AR Historical Item */}
              <div style={{
                ...getArAnimationStyle(arItem.config),
                background: 'rgba(0,0,0,0.8)',
                borderRadius: '50%',
                width: '80px',
                height: '80px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: `3px solid ${arItem.config.color}`,
                boxShadow: `0 0 30px ${arItem.config.color}`,
                backdropFilter: 'blur(5px)'
              }}>
                {arItem.icon}
              </div>
              
              {/* Historical Item Name */}
              <div style={{
                position: 'absolute',
                top: '100%',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'rgba(0,0,0,0.9)',
                color: arItem.config.color,
                padding: '0.3rem 0.6rem',
                borderRadius: '5px',
                fontSize: '0.7rem',
                fontWeight: 'bold',
                whiteSpace: 'nowrap',
                textAlign: 'center',
                marginTop: '5px'
              }}>
                {arItem.config.name}
              </div>

              {/* Collection Indicator */}
              <div style={{
                position: 'absolute',
                top: '-10px',
                right: '-10px',
                background: '#ffd700',
                color: '#000',
                borderRadius: '50%',
                width: '20px',
                height: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.6rem',
                fontWeight: 'bold',
                animation: 'arPulse 1s ease-in-out infinite'
              }}>
                ⭐
              </div>
            </div>
          ))}

          {/* AR Mode Indicator */}
          <div style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(0,0,0,0.8)',
            color: arMode ? '#00ff00' : '#ff4444',
            padding: '0.5rem',
            borderRadius: '5px',
            fontSize: '0.8rem'
          }}>
            🎮 {arMode ? 'AR Mode ON' : 'AR Mode OFF'}
          </div>

          {/* Location Indicator */}
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
            📍 Vị trí: ({Math.round(currentLocation.x)}, {Math.round(currentLocation.y)})
          </div>

          {/* AR Items Count */}
          <div style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            background: 'rgba(0,0,0,0.8)',
            color: '#ffd700',
            padding: '0.5rem',
            borderRadius: '5px',
            fontSize: '0.8rem'
          }}>
            🎯 Hiện vật lịch sử: {arItems.length}
          </div>

          {/* Camera Status */}
          <div style={{
            position: 'absolute',
            top: '60px',
            left: '20px',
            background: 'rgba(0,0,0,0.8)',
            color: isCameraActive ? '#00ff00' : '#ff4444',
            padding: '0.5rem',
            borderRadius: '5px',
            fontSize: '0.8rem'
          }}>
            📱 {isCameraActive ? 'Camera Active' : 'Camera Error'}
          </div>

          {/* Motion Status */}
          <div style={{
            position: 'absolute',
            top: '100px',
            left: '20px',
            background: 'rgba(0,0,0,0.8)',
            color: motionPermission ? '#00ff00' : '#ff4444',
            padding: '0.5rem',
            borderRadius: '5px',
            fontSize: '0.8rem'
          }}>
            📱 {motionPermission ? 'Motion Active' : 'Motion Disabled'}
          </div>
        </div>
      </div>

      {/* Camera Controls */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '10px',
        zIndex: 1001
      }}>
        <button
          onClick={switchCamera}
          style={{
            background: '#ffd700',
            color: '#000',
            border: 'none',
            padding: '10px',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: 'bold'
          }}
        >
          🔄 Đổi Camera
        </button>
        <button
          onClick={toggleArMode}
          style={{
            background: arMode ? '#00ff00' : '#ff4444',
            color: '#000',
            border: 'none',
            padding: '10px',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: 'bold'
          }}
        >
          🎮 {arMode ? 'AR ON' : 'AR OFF'}
        </button>
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
          zIndex: 1001
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

      {/* Collection Modal */}
      {selectedStation && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'rgba(0,0,0,0.95)',
          border: '3px solid #ffd700',
          borderRadius: '15px',
          padding: '2rem',
          textAlign: 'center',
          zIndex: 1002,
          minWidth: '300px'
        }}>
          <h3 style={{ color: '#ffd700', marginBottom: '1rem' }}>
            🎯 {selectedStation.name}
          </h3>
          <div style={{ 
            fontSize: '3rem', 
            marginBottom: '1rem',
            animation: 'arPulse 1s ease-in-out infinite'
          }}>
            {selectedStation.icon}
          </div>
          <p style={{ color: '#fff', marginBottom: '1rem' }}>
            {selectedStation.item}
          </p>
          {isCollecting ? (
            <div style={{ color: '#ffd700' }}>
              🔄 Đang thu thập hiện vật lịch sử...
            </div>
          ) : (
            <div style={{ color: '#ffd700' }}>
              ✅ Đã thu thập thành công!
            </div>
          )}
        </div>
      )}

      {/* Camera Error Message */}
      {cameraError && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'rgba(255, 0, 0, 0.9)',
          color: '#fff',
          padding: '2rem',
          borderRadius: '15px',
          textAlign: 'center',
          zIndex: 1002,
          maxWidth: '400px'
        }}>
          <h3 style={{ marginBottom: '1rem' }}>📷 Lỗi Camera</h3>
          <p style={{ marginBottom: '1rem' }}>{cameraError}</p>
          <p style={{ fontSize: '0.9rem' }}>
            Vui lòng cho phép quyền truy cập camera và thử lại
          </p>
        </div>
      )}

      {/* Close Button */}
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          background: '#da251d',
          color: '#fff',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '1rem',
          zIndex: 1001
        }}
      >
        ❌ Thoát AR
      </button>

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
        zIndex: 1001
      }}>
        <p style={{ margin: '0 0 0.5rem 0' }}>
          🎮 Hướng dẫn khám phá hiện vật lịch sử:
        </p>
        {motionPermission ? (
          <>
            <p style={{ margin: '0.2rem 0', fontSize: '0.8rem' }}>
              • Di chuyển thiết bị để tìm hiện vật lịch sử AR
            </p>
            <p style={{ margin: '0.2rem 0', fontSize: '0.8rem' }}>
              • Hiện vật sẽ xuất hiện với hiệu ứng 3D
            </p>
            <p style={{ margin: '0.2rem 0', fontSize: '0.8rem' }}>
              • Click vào hiện vật để thu thập và nghe câu chuyện
            </p>
          </>
        ) : (
          <>
            <p style={{ margin: '0.2rem 0', fontSize: '0.8rem' }}>
              • Sử dụng nút mũi tên để di chuyển camera
            </p>
            <p style={{ margin: '0.2rem 0', fontSize: '0.8rem' }}>
              • Cho phép quyền truy cập motion để trải nghiệm AR thực tế
            </p>
          </>
        )}
        <p style={{ margin: '0.2rem 0', fontSize: '0.8rem' }}>
          • Hiện vật AR có hiệu ứng 3D và animation
        </p>
        <p style={{ margin: '0.2rem 0', fontSize: '0.8rem' }}>
          • Mỗi hiện vật có câu chuyện lịch sử riêng
        </p>
      </div>
    </div>
  )
}

export default CameraView 
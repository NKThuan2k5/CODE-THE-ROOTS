import React, { useState, useEffect } from 'react'
import MapView from './components/MapView'
import Inventory from './components/Inventory'
import CollectionModal from './components/CollectionModal'
import QRCodeModal from './components/QRCodeModal'
import CameraView from './components/CameraView'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('map')
  const [collectedItems, setCollectedItems] = useState([])
  const [sessionStations, setSessionStations] = useState([])
  const [selectedStation, setSelectedStation] = useState(null)
  const [showCollectionModal, setShowCollectionModal] = useState(false)
  const [showQRModal, setShowQRModal] = useState(false)
  const [showCameraView, setShowCameraView] = useState(false)

  // All stations data
  const allStations = [
    { id: 'PT1', name: 'CỔNG ĐỊA ĐẠO PHÚ THỌ HÒA', item: 'Bản Đồ Bí Mật', icon: '🗺️', position: { x: 50, y: 95 }, nftImage: 'G4' },
    { id: 'PT2', name: 'KHU TRƯNG BÀY VŨ KHÍ', item: 'Súng Trường Cổ', icon: '🔫', position: { x: 25, y: 75 }, nftImage: 'G5' },
    { id: 'PT3', name: 'HẦM CHỈ HUY', item: 'Đài Liên Lạc', icon: '📡', position: { x: 75, y: 25 }, nftImage: 'G6' },
    { id: 'PT4', name: 'HẦM Y TẾ', item: 'Bộ Dụng Cụ Y Tế', icon: '🏥', position: { x: 50, y: 50 }, nftImage: 'G7' },
    { id: 'PT5', name: 'HẦM BẾP', item: 'Nồi Đồng Truyền Thống', icon: '🍳', position: { x: 80, y: 60 }, nftImage: 'G8' },
    { id: 'PT6', name: 'HẦM NGỦ', item: 'Chiếu Cỏ Dân Gian', icon: '🛏️', position: { x: 20, y: 40 }, nftImage: 'G9' },
    { id: 'PT7', name: 'KHU VỰC HỌP', item: 'Bàn Họp Truyền Thống', icon: '🏛️', position: { x: 40, y: 30 }, nftImage: 'G10' }
  ]

  useEffect(() => {
    // Load collected items from localStorage
    const savedItems = localStorage.getItem('codeTheRootsCollectedItems')
    if (savedItems) {
      setCollectedItems(JSON.parse(savedItems))
    }

    // Check if user has visited before
    const hasVisited = localStorage.getItem('codeTheRootsHasVisited')
    if (!hasVisited) {
      // First time visit - select 3 random stations
      const shuffled = [...allStations].sort(() => 0.5 - Math.random())
      setSessionStations(shuffled.slice(0, 3))
      localStorage.setItem('codeTheRootsHasVisited', 'true')
    } else {
      // Return visit - select 3 random stations
      const shuffled = [...allStations].sort(() => 0.5 - Math.random())
      setSessionStations(shuffled.slice(0, 3))
    }
  }, [])

  useEffect(() => {
    // Save collected items to localStorage
    localStorage.setItem('codeTheRootsCollectedItems', JSON.stringify(collectedItems))
  }, [collectedItems])

  const handleStationClick = (station) => {
    setSelectedStation(station)
    setShowCollectionModal(true)
  }

  const handleCollectItem = () => {
    if (selectedStation && !collectedItems.find(item => item.id === selectedStation.id)) {
      setCollectedItems(prev => [...prev, { ...selectedStation, nftImage: selectedStation.nftImage }])
    }
    setShowCollectionModal(false)
    setSelectedStation(null)
  }

  const handleConfirmCollection = () => {
    handleCollectItem()
  }

  const handleCloseModal = () => {
    setShowCollectionModal(false)
    setSelectedStation(null)
  }

  const handleCameraStationFound = (station) => {
    if (!collectedItems.find(item => item.id === station.id)) {
      setCollectedItems(prev => [...prev, { ...station, nftImage: station.nftImage }])
    }
  }

  return (
    <div className="app">
      {/* App Header */}
      <div className="app-header">
        <div className="vietnamese-gradient">
          <h1>🌟 CODE THE ROOTS 🌟</h1>
          <p>Địa Đạo Phú Thọ Hòa - Kết Nối Quá Khứ Với Tương Lai</p>
        </div>
      </div>

      {/* App Navigation */}
      <div className="app-nav">
        <button 
          className="nav-button"
          onClick={() => setCurrentPage('map')}
          style={{ background: currentPage === 'map' ? '#ffd700' : '#da251d' }}
        >
          🗺️ Bản Đồ
        </button>
        <button 
          className="nav-button"
          onClick={() => setCurrentPage('inventory')}
          style={{ background: currentPage === 'inventory' ? '#ffd700' : '#da251d' }}
        >
          💎 Bộ Sưu Tập ({collectedItems.length}/7)
        </button>
        <button 
          className="nav-button"
          onClick={() => setShowQRModal(true)}
          style={{ background: '#ffd700' }}
        >
          📱 QR Code
        </button>
        <button 
          className="nav-button"
          onClick={() => setShowCameraView(true)}
          style={{ background: '#ffd700' }}
        >
          📷 Camera AR
        </button>
      </div>

      {/* App Main Content */}
      <div className="app-main">
        {currentPage === 'map' && (
          <MapView 
            stations={sessionStations} 
            onStationClick={handleStationClick}
          />
        )}
        
        {currentPage === 'inventory' && (
          <Inventory 
            collectedItems={collectedItems}
            allStations={allStations}
          />
        )}
      </div>

      {/* Floating QR Code Button */}
      <button
        onClick={() => setShowQRModal(true)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          background: 'linear-gradient(45deg, #ffd700, #ffed4e)',
          color: '#000',
          border: 'none',
          borderRadius: '50%',
          width: '70px',
          height: '70px',
          cursor: 'pointer',
          fontSize: '2rem',
          boxShadow: '0 8px 25px rgba(255, 215, 0, 0.4)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s ease',
          animation: 'qrPulse 2s ease-in-out infinite'
        }}
        onMouseOver={(e) => {
          e.target.style.transform = 'scale(1.1)'
          e.target.style.boxShadow = '0 12px 35px rgba(255, 215, 0, 0.6)'
        }}
        onMouseOut={(e) => {
          e.target.style.transform = 'scale(1)'
          e.target.style.boxShadow = '0 8px 25px rgba(255, 215, 0, 0.4)'
        }}
        title="📱 QR Code - Quét để truy cập"
      >
        📱
      </button>

      {/* Collection Modal */}
      {showCollectionModal && selectedStation && (
        <CollectionModal
          station={selectedStation}
          onCollect={handleConfirmCollection}
          onClose={handleCloseModal}
        />
      )}

      {/* QR Code Modal */}
      {showQRModal && (
        <QRCodeModal 
          isOpen={showQRModal}
          onClose={() => setShowQRModal(false)} 
        />
      )}

      {/* Camera View */}
      {showCameraView && (
        <CameraView
          stations={sessionStations}
          onStationFound={handleCameraStationFound}
          onClose={() => setShowCameraView(false)}
        />
      )}

      {/* App Footer */}
      <div className="app-footer">
        <div className="vietnamese-pattern">
          <p>🏛️ CODE THE ROOTS - Bảo Tồn Di Sản Văn Hóa Việt Nam 🏛️</p>
          <p>🎮 Khám phá lịch sử qua công nghệ AR/VR hiện đại</p>
        </div>
      </div>
    </div>
  )
}

export default App 
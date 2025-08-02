import React, { useState, useEffect } from 'react'
import QRCode from 'qrcode'

const QRCodeModal = ({ isOpen, onClose }) => {
  const [currentURL, setCurrentURL] = useState('')
  const [qrDataUrl, setQrDataUrl] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [qrError, setQrError] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const generateQR = async () => {
      try {
        // Get current URL
        const url = window.location.href
        setCurrentURL(url)
        
        // Generate QR code with better settings
        const qrDataUrl = await QRCode.toDataURL(url, {
          width: 300, // Larger QR code
          margin: 4,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          },
          errorCorrectionLevel: 'H' // High error correction
        })
        
        setQrDataUrl(qrDataUrl)
        setIsLoading(false)
        setQrError(false)
        console.log('✅ QR Code generated successfully')
      } catch (error) {
        console.error('❌ QR Code Generation Error:', error)
        setQrError(true)
        setIsLoading(false)
      }
    }

    if (isOpen) {
      generateQR()
    }
  }, [isOpen])

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentURL)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Copy failed:', error)
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = currentURL
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleOpenInNewTab = () => {
    window.open(currentURL, '_blank')
  }

  if (!isOpen) return null

  return (
    <div className="qr-modal" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0, 0, 0, 0.9)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      backdropFilter: 'blur(5px)'
    }}>
      <div className="qr-modal-content" style={{
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
        padding: '2.5rem',
        borderRadius: '20px',
        maxWidth: '600px',
        width: '95%',
        textAlign: 'center',
        border: '3px solid #ffd700',
        boxShadow: '0 25px 50px rgba(0,0,0,0.7)',
        position: 'relative'
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '15px',
            right: '15px',
            background: '#da251d',
            color: '#fff',
            border: 'none',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            cursor: 'pointer',
            fontSize: '1.2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          ✕
        </button>

        <h2 style={{ 
          color: '#ffd700', 
          marginBottom: '1.5rem', 
          textAlign: 'center',
          fontSize: '1.5rem',
          fontWeight: 'bold'
        }}>
          📱 CODE THE ROOTS - QR Code Truy Cập
        </h2>
        
        {isLoading ? (
          <div style={{ 
            padding: '3rem', 
            color: '#ffd700',
            fontSize: '1.2rem'
          }}>
            <div style={{ marginBottom: '1rem' }}>🔄</div>
            Đang tạo QR Code...
          </div>
        ) : qrError ? (
          <div style={{ 
            padding: '2rem', 
            color: '#ff4444',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>❌</div>
            <h3 style={{ marginBottom: '1rem' }}>Lỗi tạo QR Code</h3>
            <p style={{ fontSize: '0.9rem', color: '#ccc', marginBottom: '1.5rem' }}>
              Vui lòng sử dụng link trực tiếp bên dưới
            </p>
            <div style={{ 
              padding: '1rem', 
              background: 'rgba(255, 68, 68, 0.1)', 
              borderRadius: '10px',
              border: '1px solid #ff4444'
            }}>
              <p style={{ color: '#ffd700', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                🔗 Link trực tiếp:
              </p>
              <a 
                href={currentURL} 
                style={{ 
                  color: '#ffd700', 
                  wordBreak: 'break-all',
                  textDecoration: 'underline'
                }}
                target="_blank"
                rel="noopener noreferrer"
              >
                {currentURL}
              </a>
            </div>
          </div>
        ) : (
          <>
            {/* QR Code Display */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              marginBottom: '2rem' 
            }}>
              <div style={{ 
                background: 'white', 
                padding: '25px', 
                borderRadius: '15px', 
                boxShadow: '0 15px 35px rgba(0,0,0,0.4)',
                border: '3px solid #ffd700',
                position: 'relative'
              }}>
                <img 
                  src={qrDataUrl} 
                  alt="QR Code" 
                  style={{ 
                    width: '250px', 
                    height: '250px',
                    display: 'block'
                  }}
                />
                {/* QR Code Label */}
                <div style={{
                  position: 'absolute',
                  bottom: '-10px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: '#ffd700',
                  color: '#000',
                  padding: '0.3rem 1rem',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  fontWeight: 'bold'
                }}>
                  CODE THE ROOTS
                </div>
              </div>
            </div>
            
            {/* Instructions */}
            <div style={{ 
              textAlign: 'center', 
              marginBottom: '2rem', 
              padding: '1.5rem', 
              background: 'rgba(255, 215, 0, 0.1)', 
              borderRadius: '15px', 
              border: '2px solid #ffd700' 
            }}>
              <p style={{ 
                color: '#ffd700', 
                marginBottom: '1rem', 
                fontWeight: 'bold',
                fontSize: '1.1rem'
              }}>
                🎮 Hướng Dẫn Sử Dụng:
              </p>
              <ul style={{ 
                textAlign: 'left', 
                color: '#ccc', 
                fontSize: '1rem', 
                lineHeight: '1.6', 
                margin: '0', 
                paddingLeft: '2rem' 
              }}>
                <li style={{ marginBottom: '0.5rem' }}>📱 Mở camera trên điện thoại</li>
                <li style={{ marginBottom: '0.5rem' }}>🔍 Scan QR code này</li>
                <li style={{ marginBottom: '0.5rem' }}>🌐 Truy cập ứng dụng CODE THE ROOTS</li>
                <li style={{ marginBottom: '0.5rem' }}>🏛️ Khám phá Địa Đạo Phú Thọ Hòa!</li>
                <li style={{ marginBottom: '0.5rem' }}>🎯 Thu thập hiện vật lịch sử</li>
                <li style={{ marginBottom: '0.5rem' }}>📖 Nghe câu chuyện lịch sử</li>
              </ul>
            </div>
            
            {/* Direct Link */}
            <div style={{ 
              fontSize: '0.9rem', 
              color: '#ccc', 
              textAlign: 'center', 
              marginBottom: '2rem',
              padding: '1rem',
              background: 'rgba(0,0,0,0.3)',
              borderRadius: '10px'
            }}>
              <p style={{ margin: '0 0 0.5rem 0', color: '#ffd700', fontWeight: 'bold' }}>
                🔗 Link trực tiếp:
              </p>
              <div style={{ 
                padding: '0.8rem',
                background: 'rgba(255, 215, 0, 0.1)',
                borderRadius: '8px',
                wordBreak: 'break-all',
                fontSize: '0.8rem',
                border: '1px solid #ffd700'
              }}>
                <a 
                  href={currentURL} 
                  style={{ 
                    color: '#ffd700',
                    textDecoration: 'underline'
                  }}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {currentURL}
                </a>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              <button 
                onClick={handleCopyLink}
                style={{ 
                  background: copied ? '#00ff00' : '#00cc00', 
                  color: '#000', 
                  border: 'none', 
                  padding: '0.8rem 1.5rem', 
                  borderRadius: '8px', 
                  cursor: 'pointer', 
                  fontWeight: 'bold', 
                  fontSize: '1rem',
                  transition: 'all 0.3s ease'
                }}
              >
                {copied ? '✅ Đã Copy!' : '📋 Copy Link'}
              </button>
              
              <button 
                onClick={handleOpenInNewTab}
                style={{ 
                  background: '#4169e1', 
                  color: '#fff', 
                  border: 'none', 
                  padding: '0.8rem 1.5rem', 
                  borderRadius: '8px', 
                  cursor: 'pointer', 
                  fontWeight: 'bold', 
                  fontSize: '1rem',
                  transition: 'all 0.3s ease'
                }}
              >
                🌐 Mở Trong Tab Mới
              </button>
            </div>

            {/* Additional Info */}
            <div style={{
              marginTop: '1.5rem',
              padding: '1rem',
              background: 'rgba(255, 215, 0, 0.05)',
              borderRadius: '10px',
              border: '1px solid rgba(255, 215, 0, 0.3)'
            }}>
              <p style={{ 
                margin: '0', 
                color: '#ccc', 
                fontSize: '0.9rem',
                lineHeight: '1.4'
              }}>
                💡 <strong>Mẹo:</strong> QR code này có thể được scan bởi bất kỳ ứng dụng camera nào trên điện thoại. 
                Sau khi scan, bạn sẽ được chuyển đến ứng dụng CODE THE ROOTS để bắt đầu khám phá!
              </p>
            </div>
          </>
        )}
        
        <button 
          onClick={onClose} 
          style={{ 
            background: '#ffd700', 
            color: '#1a1a1a', 
            border: 'none', 
            padding: '1rem 2rem', 
            borderRadius: '10px', 
            cursor: 'pointer', 
            fontWeight: 'bold', 
            fontSize: '1.1rem',
            marginTop: '1.5rem',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => {
            e.target.style.background = '#ffed4e'
            e.target.style.transform = 'scale(1.05)'
          }}
          onMouseOut={(e) => {
            e.target.style.background = '#ffd700'
            e.target.style.transform = 'scale(1)'
          }}
        >
          ✅ Đã Hiểu
        </button>
      </div>
    </div>
  )
}

export default QRCodeModal 
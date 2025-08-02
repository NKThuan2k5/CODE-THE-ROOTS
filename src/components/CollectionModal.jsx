import React, { useState, useEffect } from 'react'

const CollectionModal = ({ station, onCollect, onClose }) => {
  const [isCollecting, setIsCollecting] = useState(false)
  const [showVoiceGuide, setShowVoiceGuide] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [speech, setSpeech] = useState(null)
  const [currentStory, setCurrentStory] = useState('')
  const [speechAvailable, setSpeechAvailable] = useState(false)

  // NFT Image mapping
  const getNFTImage = (nftCode) => {
    const nftImages = {
      'G4': 'https://via.placeholder.com/300x200/da251d/ffffff?text=G4+-+Bản+Đồ+Bí+Mật',
      'G5': 'https://via.placeholder.com/300x200/ffd700/000000?text=G5+-+Súng+Trường+Cổ',
      'G6': 'https://via.placeholder.com/300x200/da251d/ffffff?text=G6+-+Đài+Liên+Lạc',
      'G7': 'https://via.placeholder.com/300x200/ffd700/000000?text=G7+-+Bộ+Dụng+Cụ+Y+Tế',
      'G8': 'https://via.placeholder.com/300x200/da251d/ffffff?text=G8+-+Nồi+Đồng+Truyền+Thống',
      'G9': 'https://via.placeholder.com/300x200/ffd700/000000?text=G9+-+Chiếu+Cỏ+Dân+Gian',
      'G10': 'https://via.placeholder.com/300x200/da251d/ffffff?text=G10+-+Bàn+Họp+Truyền+Thống'
    }
    return nftImages[nftCode] || nftImages['G4']
  }

  useEffect(() => {
    // Initialize speech synthesis with proper error handling
    if ('speechSynthesis' in window) {
      const speechSynthesis = window.speechSynthesis
      setSpeech(speechSynthesis)
      setSpeechAvailable(true)
      
      // Wait for voices to load
      const loadVoices = () => {
        const voices = speechSynthesis.getVoices()
        if (voices.length > 0) {
          console.log('Voices loaded:', voices.length)
          console.log('Available voices:', voices.map(v => `${v.name} (${v.lang}) - ${v.gender || 'unknown'}`))
          setSpeechAvailable(true)
        }
      }
      
      speechSynthesis.onvoiceschanged = loadVoices
      loadVoices() // Try immediately
    } else {
      setSpeechAvailable(false)
      console.log('Speech synthesis not supported')
    }

    // Get story immediately
    const story = getHistoricalStory(station.name, station.item)
    setCurrentStory(story)

    // Simulate voice guide
    const timer = setTimeout(() => {
      setShowVoiceGuide(true)
      if (speechAvailable) {
        startHistoricalStory()
      }
    }, 1000)

    return () => clearTimeout(timer)
  }, [station, speechAvailable])

  const startHistoricalStory = () => {
    if (!speech || !speechAvailable) {
      console.log('Speech synthesis not available')
      return
    }

    // Stop any current speech
    speech.cancel()

    const story = getHistoricalStory(station.name, station.item)
    setCurrentStory(story)
    
    const utterance = new SpeechSynthesisUtterance(story)
    
    // Configure voice with STRONG preference for female voices
    const voices = speech.getVoices()
    console.log('Available voices:', voices.map(v => `${v.name} (${v.lang}) - ${v.gender || 'unknown'}`))
    
    // STRICT female voice selection - NO MALE VOICES
    let selectedVoice = null
    
    // 1. Vietnamese female voices (highest priority)
    selectedVoice = voices.find(voice => 
      (voice.lang.includes('vi') || voice.lang.includes('VN') || voice.lang.includes('Vietnamese')) &&
      (voice.name.toLowerCase().includes('female') || voice.name.toLowerCase().includes('nữ') || voice.gender === 'female')
    )
    
    // 2. Vietnamese voices with female names
    if (!selectedVoice) {
      selectedVoice = voices.find(voice => 
        (voice.lang.includes('vi') || voice.lang.includes('VN') || voice.lang.includes('Vietnamese')) &&
        (voice.name.toLowerCase().includes('girl') || voice.name.toLowerCase().includes('woman') || voice.name.toLowerCase().includes('lady') || voice.name.toLowerCase().includes('samantha') || voice.name.toLowerCase().includes('victoria'))
      )
    }
    
    // 3. English female voices (high priority)
    if (!selectedVoice) {
      selectedVoice = voices.find(voice => 
        voice.lang.includes('en') && 
        (voice.name.toLowerCase().includes('female') || voice.gender === 'female' || voice.name.toLowerCase().includes('woman') || voice.name.toLowerCase().includes('girl'))
      )
    }
    
    // 4. English voices with female names
    if (!selectedVoice) {
      selectedVoice = voices.find(voice => 
        voice.lang.includes('en') && 
        (voice.name.toLowerCase().includes('samantha') || voice.name.toLowerCase().includes('victoria') || voice.name.toLowerCase().includes('karen') || voice.name.toLowerCase().includes('alex') || voice.name.toLowerCase().includes('lisa') || voice.name.toLowerCase().includes('sarah'))
      )
    }
    
    // 5. Any voice with female characteristics
    if (!selectedVoice) {
      selectedVoice = voices.find(voice => 
        voice.name.toLowerCase().includes('female') || voice.gender === 'female' || voice.name.toLowerCase().includes('woman') || voice.name.toLowerCase().includes('girl') || voice.name.toLowerCase().includes('lady')
      )
    }
    
    // 6. If still no female voice, try to find any voice that's NOT male
    if (!selectedVoice) {
      selectedVoice = voices.find(voice => 
        !voice.name.toLowerCase().includes('male') && 
        !voice.name.toLowerCase().includes('david') && 
        !voice.name.toLowerCase().includes('john') && 
        !voice.name.toLowerCase().includes('mike') && 
        !voice.name.toLowerCase().includes('tom') && 
        !voice.name.toLowerCase().includes('james') &&
        voice.gender !== 'male'
      )
    }
    
    // 7. Last resort - use first non-male voice
    if (!selectedVoice && voices.length > 0) {
      selectedVoice = voices.find(voice => voice.gender !== 'male') || voices[0]
      console.log('⚠️ No female voice found, using fallback voice')
    }
    
    if (selectedVoice) {
      utterance.voice = selectedVoice
      console.log('🎯 Selected voice:', selectedVoice.name, selectedVoice.lang, selectedVoice.gender)
      
      // Check if it's actually a female voice
      const isFemale = selectedVoice.gender === 'female' || 
                      selectedVoice.name.toLowerCase().includes('female') ||
                      selectedVoice.name.toLowerCase().includes('woman') ||
                      selectedVoice.name.toLowerCase().includes('girl') ||
                      selectedVoice.name.toLowerCase().includes('samantha') ||
                      selectedVoice.name.toLowerCase().includes('victoria') ||
                      selectedVoice.name.toLowerCase().includes('karen') ||
                      selectedVoice.name.toLowerCase().includes('alex') ||
                      selectedVoice.name.toLowerCase().includes('lisa') ||
                      selectedVoice.name.toLowerCase().includes('sarah')
      
      if (!isFemale) {
        console.log('⚠️ WARNING: Selected voice may not be female!')
      } else {
        console.log('✅ Confirmed female voice selected')
      }
    } else {
      console.log('❌ No voice selected!')
    }

    // Set language and properties for better female voice
    utterance.lang = selectedVoice?.lang || 'en-US'
    utterance.rate = 0.85  // Slightly slower for clarity
    utterance.pitch = 1.4  // Even higher pitch for more feminine voice
    utterance.volume = 1.0

    // Event handlers
    utterance.onstart = () => {
      console.log('Speech started with selected voice')
      setIsSpeaking(true)
    }
    
    utterance.onend = () => {
      console.log('Speech ended')
      setIsSpeaking(false)
    }
    
    utterance.onerror = (event) => {
      console.error('Speech error:', event.error)
      setIsSpeaking(false)
    }

    // Start speaking
    try {
      speech.speak(utterance)
      console.log('Voice synthesis initiated with selected voice')
    } catch (error) {
      console.error('Speech synthesis failed:', error)
      setIsSpeaking(false)
    }
  }

  const stopStory = () => {
    if (speech) {
      speech.cancel()
      setIsSpeaking(false)
      console.log('Speech stopped')
    }
  }

  const getHistoricalStory = (stationName, itemName) => {
    const stories = {
      'CỔNG ĐỊA ĐẠO PHÚ THỌ HÒA': `Xin chào! Tôi là hướng dẫn viên của bạn. Chào mừng bạn đến với Cổng Địa Đạo Phú Thọ Hòa! Đây là một trong những di tích lịch sử quan trọng nhất của Việt Nam, nơi ghi dấu những năm tháng kháng chiến oanh liệt. Địa đạo Phú Thọ Hòa được xây dựng từ những năm 1940, là nơi ẩn náu và hoạt động của các chiến sĩ cách mạng. Bản đồ bí mật mà bạn khám phá được chứa đựng toàn bộ hệ thống đường hầm phức tạp này, thể hiện sự thông minh và sáng tạo của người Việt Nam trong cuộc đấu tranh giành độc lập.`,
      
      'KHU TRƯNG BÀY VŨ KHÍ': `Tại Khu Trưng Bày Vũ Khí, bạn sẽ được chiêm ngưỡng những hiện vật quý giá từ thời kỳ kháng chiến. Súng trường cổ mà bạn tìm thấy không chỉ là vũ khí mà còn là chứng tích lịch sử, thể hiện tinh thần bất khuất của dân tộc Việt Nam. Trong những năm tháng gian khổ, những vũ khí này đã được sử dụng để bảo vệ quê hương, đất nước. Mỗi vết tích trên súng đều kể lại một câu chuyện về lòng dũng cảm và tinh thần yêu nước.`,
      
      'HẦM CHỈ HUY': `Hầm Chỉ Huy là trung tâm điều hành của toàn bộ hệ thống địa đạo Phú Thọ Hòa. Từ đây, các chiến sĩ đã đưa ra những quyết định quan trọng trong cuộc kháng chiến. Đài liên lạc mà bạn khám phá được là công cụ truyền tin quan trọng, giúp kết nối các đơn vị và truyền đạt thông tin chiến lược. Trong điều kiện thiếu thốn, những thiết bị này đã đóng vai trò then chốt trong việc phối hợp hành động và giành thắng lợi.`,
      
      'HẦM Y TẾ': `Hầm Y Tế là nơi chăm sóc sức khỏe cho các chiến sĩ và đồng bào trong thời kỳ kháng chiến. Bộ dụng cụ y tế mà bạn tìm thấy thể hiện sự quan tâm đến tính mạng con người, ngay cả trong hoàn cảnh khó khăn nhất. Những dụng cụ y tế đơn giản này đã cứu sống vô số người, thể hiện tinh thần nhân đạo và sự đoàn kết của dân tộc Việt Nam.`,
      
      'HẦM BẾP': `Hầm Bếp là nơi chuẩn bị thức ăn cho các chiến sĩ và đồng bào. Nồi đồng truyền thống mà bạn khám phá được không chỉ là dụng cụ nấu ăn mà còn là biểu tượng của văn hóa ẩm thực Việt Nam. Trong những năm tháng gian khổ, những chiếc nồi này đã nấu ra những bữa ăn đơn giản nhưng ấm áp tình đồng bào, nuôi dưỡng tinh thần chiến đấu.`,
      
      'HẦM NGỦ': `Hầm Ngủ là nơi nghỉ ngơi của các chiến sĩ sau những giờ chiến đấu căng thẳng. Chiếu cỏ dân gian mà bạn tìm thấy thể hiện sự giản dị và gần gũi với thiên nhiên của người Việt Nam. Trong điều kiện khó khăn, những chiếc chiếu này đã tạo ra không gian nghỉ ngơi ấm cúng, giúp các chiến sĩ hồi phục sức lực để tiếp tục cuộc đấu tranh.`,

      'KHU VỰC HỌP': `Khu Vực Họp là nơi các chiến sĩ và lãnh đạo họp bàn chiến lược. Bàn họp truyền thống mà bạn khám phá được là nơi diễn ra những cuộc thảo luận quan trọng về chiến lược kháng chiến. Trong không gian đơn giản này, những quyết định lịch sử đã được đưa ra, thể hiện tinh thần đoàn kết và sự sáng suốt của lãnh đạo cách mạng.`
    }
    
    return stories[stationName] || `Xin chào! Tôi là hướng dẫn viên của bạn. Chào mừng bạn đến với ${stationName}! Đây là một địa điểm lịch sử quan trọng trong hệ thống địa đạo Phú Thọ Hòa. ${itemName} mà bạn khám phá được là hiện vật quý giá, chứa đựng những câu chuyện về lòng dũng cảm và tinh thần bất khuất của nhân dân Việt Nam trong thời kỳ kháng chiến.`
  }

  const getItemDescription = (itemName, stationName) => {
    const descriptions = {
      'Bản Đồ Bí Mật': `Bản đồ bí mật từ ${stationName} - tiết lộ hệ thống đường hầm phức tạp của Địa Đạo Phú Thọ Hòa.`,
      'Súng Trường Cổ': `Súng trường cổ từ ${stationName} - vũ khí lịch sử được sử dụng trong cuộc kháng chiến chống ngoại xâm.`,
      'Đài Liên Lạc': `Đài liên lạc từ ${stationName} - thiết bị truyền tin quan trọng trong hệ thống chỉ huy.`,
      'Bộ Dụng Cụ Y Tế': `Bộ dụng cụ y tế từ ${stationName} - chứng tích về sự quan tâm đến sức khỏe con người.`,
      'Nồi Đồng Truyền Thống': `Nồi đồng truyền thống từ ${stationName} - dụng cụ nấu ăn thể hiện văn hóa ẩm thực Việt Nam.`,
      'Chiếu Cỏ Dân Gian': `Chiếu cỏ dân gian từ ${stationName} - vật dụng sinh hoạt thể hiện sự giản dị của người Việt.`,
      'Bàn Họp Truyền Thống': `Bàn họp truyền thống từ ${stationName} - nơi diễn ra những cuộc thảo luận chiến lược quan trọng.`
    }
    return descriptions[itemName] || `Một hiện vật bí ẩn từ ${stationName} thuộc hệ thống Địa Đạo Phú Thọ Hòa.`
  }

  const handleCollect = () => {
    stopStory()
    setIsCollecting(true)
    // Simulate collection animation
    setTimeout(() => {
      onCollect()
    }, 1500)
  }

  return (
    <div className="collection-modal">
      <div className="modal-content">
        {/* CODE THE ROOTS Header */}
        <div style={{
          background: 'linear-gradient(135deg, #da251d 0%, #ffd700 50%, #da251d 100%)',
          color: '#fff',
          padding: '1rem',
          borderRadius: '15px 15px 0 0',
          textAlign: 'center',
          fontWeight: 'bold',
          fontSize: '1.2rem',
          borderBottom: '2px solid #ffd700',
          textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
        }}>
          🌟 CODE THE ROOTS 🌟
        </div>

        <h2 style={{ color: '#ffd700', marginBottom: '1rem', textAlign: 'center' }}>
          🎯 {station.name}
        </h2>

        {/* NFT Image Display */}
        <div style={{
          textAlign: 'center',
          marginBottom: '1rem',
          padding: '1rem',
          background: 'rgba(255, 215, 0, 0.1)',
          borderRadius: '10px',
          border: '2px solid #ffd700'
        }}>
          <img 
            src={getNFTImage(station.nftImage)} 
            alt={`NFT ${station.nftImage}`}
            style={{
              width: '100%',
              maxWidth: '300px',
              height: 'auto',
              borderRadius: '10px',
              border: '2px solid #da251d',
              boxShadow: '0 8px 20px rgba(0,0,0,0.3)'
            }}
          />
          <p style={{ 
            color: '#ffd700', 
            fontWeight: 'bold', 
            marginTop: '0.5rem',
            fontSize: '0.9rem'
          }}>
            🖼️ NFT {station.nftImage} - {station.item}
          </p>
        </div>

        {/* 3D Item Display */}
        <div className="item-3d" style={{ textAlign: 'center', fontSize: '3rem', marginBottom: '1rem' }}>
          {station.icon}
        </div>

        <h3 style={{ color: '#ffd700', marginBottom: '0.5rem', textAlign: 'center' }}>
          {station.item}
        </h3>

        <p style={{ marginBottom: '1rem', lineHeight: '1.5', fontSize: '0.9rem', textAlign: 'center' }}>
          {getItemDescription(station.item, station.name)}
        </p>

        {/* AI Voice Story */}
        {showVoiceGuide && (
          <div style={{
            background: 'rgba(255, 215, 0, 0.1)',
            padding: '1rem',
            borderRadius: '10px',
            marginBottom: '1rem',
            border: '1px solid #ffd700'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '0.5rem'
            }}>
              <p style={{ color: '#ffd700', fontStyle: 'italic', fontSize: '0.9rem', margin: 0 }}>
                {speechAvailable ? '👩‍💼 Hướng dẫn viên đang kể chuyện lịch sử...' : '📖 Câu chuyện lịch sử'}
              </p>
              {speechAvailable && (
                <button
                  onClick={isSpeaking ? stopStory : startHistoricalStory}
                  style={{
                    background: isSpeaking ? '#ff4444' : '#ff69b4',
                    color: 'white',
                    border: 'none',
                    padding: '5px 10px',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '0.8rem'
                  }}
                >
                  {isSpeaking ? '⏸️ Dừng' : '👩‍💼 Nghe Hướng Dẫn'}
                </button>
              )}
            </div>
            
            {/* Story Text Display */}
            <div style={{
              maxHeight: '120px',
              overflowY: 'auto',
              background: 'rgba(0,0,0,0.3)',
              padding: '0.8rem',
              borderRadius: '5px',
              marginBottom: '0.5rem',
              fontSize: '0.85rem',
              lineHeight: '1.5'
            }}>
              <p style={{ color: '#ccc', margin: 0 }}>
                {currentStory}
              </p>
            </div>
            
            {speechAvailable && (
              <div style={{
                width: '100%',
                height: '3px',
                background: '#333',
                borderRadius: '2px',
                overflow: 'hidden'
              }}>
                {isSpeaking && (
                  <div style={{
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(90deg, #ff69b4, #ff1493)',
                    animation: 'speaking 2s infinite'
                  }} />
                )}
              </div>
            )}
          </div>
        )}

        {/* Collection Button */}
        <button
          className="collect-button"
          onClick={handleCollect}
          disabled={isCollecting}
          style={{
            background: isCollecting ? '#666' : '#ffd700',
            cursor: isCollecting ? 'not-allowed' : 'pointer',
            width: '100%',
            marginBottom: '1rem'
          }}
        >
          {isCollecting ? '🔄 Đang thu thập...' : '💎 Thu thập NFT'}
        </button>

        {/* Close Button */}
        <button className="close-button" onClick={() => {
          stopStory()
          onClose()
        }}>
          ❌ Đóng
        </button>

        {/* Progress Indicator */}
        <div style={{
          marginTop: '1rem',
          textAlign: 'center',
          fontSize: '0.9rem',
          color: '#ccc'
        }}>
          <p>🎮 Hiện vật này có thể được mint thành NFT sau này!</p>
        </div>

        {/* CODE THE ROOTS Footer */}
        <div style={{
          background: 'rgba(0,0,0,0.3)',
          padding: '0.5rem',
          borderRadius: '0 0 15px 15px',
          textAlign: 'center',
          fontSize: '0.8rem',
          color: '#ffd700',
          fontWeight: 'bold',
          borderTop: '1px solid #ffd700'
        }}>
          CODE THE ROOTS - Kết Nối Quá Khứ Với Tương Lai
        </div>
      </div>
    </div>
  )
}

export default CollectionModal 
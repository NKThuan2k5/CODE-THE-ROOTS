import React from 'react'

const Inventory = ({ collectedItems, allStations }) => {
  const progress = (collectedItems.length / allStations.length) * 100

  // NFT Image mapping
  const getNFTImage = (nftCode) => {
    const nftImages = {
      'G4': 'https://via.placeholder.com/200x150/da251d/ffffff?text=G4',
      'G5': 'https://via.placeholder.com/200x150/ffd700/000000?text=G5',
      'G6': 'https://via.placeholder.com/200x150/da251d/ffffff?text=G6',
      'G7': 'https://via.placeholder.com/200x150/ffd700/000000?text=G7',
      'G8': 'https://via.placeholder.com/200x150/da251d/ffffff?text=G8',
      'G9': 'https://via.placeholder.com/200x150/ffd700/000000?text=G9',
      'G10': 'https://via.placeholder.com/200x150/da251d/ffffff?text=G10'
    }
    return nftImages[nftCode] || nftImages['G4']
  }

  return (
    <div className="inventory-container vietnamese-pattern">
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
        {/* CODE THE ROOTS Header */}
        <div style={{
          background: 'linear-gradient(135deg, #da251d 0%, #ffd700 50%, #da251d 100%)',
          color: '#fff',
          padding: '1.5rem',
          borderRadius: '20px',
          textAlign: 'center',
          fontWeight: 'bold',
          fontSize: '1.8rem',
          marginBottom: '2rem',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
          textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
          border: '3px solid #fff'
        }}>
          🌟 CODE THE ROOTS 🌟
        </div>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ color: '#ffd700', fontSize: '2.5rem', marginBottom: '0.5rem' }}>
            💎 Bộ Sưu Tập CODE THE ROOTS
          </h1>
          <p style={{ color: '#ccc', fontSize: '1.1rem', marginBottom: '1rem' }}>
            Khám Phá Di Tích Lịch Sử Phú Thọ Hòa
          </p>
          
          {/* Progress Bar */}
          <div style={{
            background: '#333',
            borderRadius: '10px',
            height: '20px',
            margin: '1rem 0',
            overflow: 'hidden',
            border: '2px solid #ffd700'
          }}>
            <div 
              className="progress-bar"
              style={{
                width: `${progress}%`,
                height: '100%',
                transition: 'width 0.5s ease'
              }}
            />
          </div>
          
          <p style={{ color: '#ffd700', fontSize: '1.2rem', fontWeight: 'bold' }}>
            {collectedItems.length} / {allStations.length} Hiện Vật Đã Thu Thập
          </p>
        </div>

        {/* AI Voice Stories Section */}
        <div style={{
          background: 'rgba(255, 215, 0, 0.1)',
          padding: '1.5rem',
          borderRadius: '15px',
          marginBottom: '2rem',
          border: '2px solid #ffd700',
          textAlign: 'center'
        }}>
          <h2 style={{ color: '#ffd700', marginBottom: '1rem' }}>
            👩‍💼 Hướng Dẫn Viên
          </h2>
          <p style={{ color: '#ccc', lineHeight: '1.6', fontSize: '1rem' }}>
            Mỗi hiện vật đều có câu chuyện lịch sử được kể bởi hướng dẫn viên. 
            Click vào các điểm trên bản đồ để nghe những câu chuyện thú vị về Địa Đạo Phú Thọ Hòa!
          </p>
        </div>

        {/* Collected Items Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          {collectedItems.map((item) => (
            <div 
              key={item.id}
              className="item-card"
              style={{
                padding: '1.5rem',
                borderRadius: '15px',
                border: '2px solid #ffd700',
                background: 'linear-gradient(135deg, #3d3d3d 0%, #2d2d2d 100%)',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* NFT Image */}
              <div style={{
                textAlign: 'center',
                marginBottom: '1rem'
              }}>
                <img 
                  src={getNFTImage(item.nftImage)} 
                  alt={`NFT ${item.nftImage}`}
                  style={{
                    width: '100%',
                    maxWidth: '250px',
                    height: 'auto',
                    borderRadius: '10px',
                    border: '2px solid #da251d',
                    boxShadow: '0 6px 15px rgba(0,0,0,0.3)'
                  }}
                />
                <p style={{ 
                  color: '#ffd700', 
                  fontWeight: 'bold', 
                  marginTop: '0.5rem',
                  fontSize: '0.9rem'
                }}>
                  🖼️ NFT {item.nftImage}
                </p>
              </div>

              {/* Item Icon */}
              <div style={{
                fontSize: '2.5rem',
                textAlign: 'center',
                marginBottom: '1rem'
              }}>
                {item.icon}
              </div>

              {/* Item Details */}
              <h3 style={{ 
                color: '#ffd700', 
                fontSize: '1.3rem', 
                marginBottom: '0.5rem',
                textAlign: 'center'
              }}>
                {item.item}
              </h3>
              
              <p style={{ 
                color: '#ccc', 
                fontSize: '1rem', 
                marginBottom: '1rem',
                textAlign: 'center',
                fontStyle: 'italic'
              }}>
                {item.name}
              </p>

              {/* Collection Date */}
              <div style={{
                textAlign: 'center',
                fontSize: '0.9rem',
                color: '#999',
                borderTop: '1px solid #444',
                paddingTop: '1rem'
              }}>
                <p style={{ margin: 0 }}>
                  📅 Thu thập: {new Date(item.collectedAt).toLocaleDateString('vi-VN')}
                </p>
              </div>

              {/* Vietnamese Heritage Badge */}
              <div style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                background: 'linear-gradient(135deg, #da251d 0%, #ffd700 100%)',
                color: '#fff',
                padding: '0.3rem 0.6rem',
                borderRadius: '10px',
                fontSize: '0.7rem',
                fontWeight: 'bold',
                border: '1px solid #fff'
              }}>
                🏛️ Di Tích
              </div>

              {/* NFT Badge */}
              <div style={{
                position: 'absolute',
                top: '10px',
                left: '10px',
                background: 'linear-gradient(135deg, #ffd700 0%, #da251d 100%)',
                color: '#fff',
                padding: '0.3rem 0.6rem',
                borderRadius: '10px',
                fontSize: '0.7rem',
                fontWeight: 'bold',
                border: '1px solid #fff'
              }}>
                🖼️ NFT
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {collectedItems.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '3rem',
            color: '#ccc'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🗺️</div>
            <h3 style={{ color: '#ffd700', marginBottom: '1rem' }}>
              Chưa có hiện vật nào được thu thập
            </h3>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>
              Hãy khám phá bản đồ để thu thập các hiện vật lịch sử từ Địa Đạo Phú Thọ Hòa!
            </p>
          </div>
        )}

        {/* Achievement Section */}
        {collectedItems.length > 0 && (
          <div style={{
            background: 'rgba(218, 37, 29, 0.1)',
            padding: '1.5rem',
            borderRadius: '15px',
            border: '2px solid #da251d',
            textAlign: 'center'
          }}>
            <h3 style={{ color: '#da251d', marginBottom: '1rem' }}>
              🏆 Thành Tựu CODE THE ROOTS
            </h3>
            <p style={{ color: '#ccc', lineHeight: '1.6' }}>
              {collectedItems.length === allStations.length 
                ? '🎉 Hoàn thành! Bạn đã thu thập tất cả hiện vật lịch sử!'
                : `Tiếp tục khám phá để thu thập thêm ${allStations.length - collectedItems.length} hiện vật nữa!`
              }
            </p>
          </div>
        )}

        {/* Vietnamese Heritage Info */}
        <div style={{
          marginTop: '2rem',
          padding: '1.5rem',
          background: 'rgba(0,0,0,0.3)',
          borderRadius: '15px',
          border: '2px solid #ffd700',
          textAlign: 'center'
        }}>
          <h3 style={{ color: '#ffd700', marginBottom: '1rem' }}>
            🌟 CODE THE ROOTS - Kết Nối Quá Khứ Với Tương Lai
          </h3>
          <p style={{ color: '#ccc', lineHeight: '1.6', fontSize: '1rem' }}>
            Dự án này được thiết kế để bảo tồn và truyền bá lịch sử Việt Nam thông qua công nghệ hiện đại. 
            Mỗi hiện vật đều mang trong mình câu chuyện về lòng dũng cảm và tinh thần bất khuất của dân tộc.
          </p>
        </div>

        {/* CODE THE ROOTS Footer */}
        <div style={{
          background: 'linear-gradient(135deg, #da251d 0%, #ffd700 50%, #da251d 100%)',
          color: '#fff',
          padding: '1rem',
          borderRadius: '15px',
          textAlign: 'center',
          fontWeight: 'bold',
          fontSize: '1.1rem',
          marginTop: '2rem',
          boxShadow: '0 8px 25px rgba(0,0,0,0.5)',
          textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
          border: '2px solid #fff'
        }}>
          🌟 CODE THE ROOTS - Bảo Tồn Văn Hóa Việt Nam 🌟
        </div>
      </div>
    </div>
  )
}

export default Inventory 
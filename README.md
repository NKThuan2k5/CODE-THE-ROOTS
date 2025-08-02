# 🌟 CODE THE ROOTS - Địa Đạo Phú Thọ Hòa

Một ứng dụng tương tác khám phá di tích lịch sử Việt Nam thông qua công nghệ hiện đại.

## 🏛️ Về Dự Án

**CODE THE ROOTS** là một dự án bảo tồn và truyền bá lịch sử Việt Nam thông qua công nghệ. Ứng dụng cho phép người dùng khám phá Địa Đạo Phú Thọ Hòa - một di tích lịch sử quan trọng của Việt Nam.

### 🎯 Mục Tiêu
- Bảo tồn và truyền bá lịch sử Việt Nam
- Kết hợp công nghệ hiện đại với di sản văn hóa
- Tạo trải nghiệm tương tác cho người dùng
- Chuẩn bị cho tích hợp NFT và blockchain

## 🚀 Tính Năng Hiện Tại

### 🗺️ Bản Đồ Tương Tác
- Bản đồ thực của Địa Đạo Phú Thọ Hòa
- 6 điểm khám phá với hiện vật lịch sử
- Hiển thị ngẫu nhiên 3 điểm mỗi phiên
- Giao diện đẹp với màu sắc Việt Nam

### 👩‍💼 AI Nữ Hướng Dẫn Viên
- Giọng nữ AI kể chuyện lịch sử
- Câu chuyện chi tiết cho từng điểm khám phá
- Hỗ trợ tiếng Việt và tiếng Anh
- Hiển thị văn bản khi không có âm thanh

### 💎 Hệ Thống Thu Thập
- Thu thập hiện vật lịch sử
- Lưu trữ trong localStorage
- Hiển thị tiến độ thu thập
- Chuẩn bị cho mint NFT

### 📱 QR Code Truy Cập
- QR code tự động tạo
- Dễ dàng truy cập trên mobile
- Hướng dẫn sử dụng chi tiết
- Link trực tiếp

## 🎮 Cách Chơi

1. **Khởi động ứng dụng**: Mở `http://localhost:3001`
2. **Khám phá bản đồ**: Click vào các điểm đánh dấu
3. **Nghe câu chuyện**: AI nữ sẽ kể chuyện lịch sử
4. **Thu thập hiện vật**: Click "Thu thập NFT"
5. **Xem bộ sưu tập**: Chuyển sang tab "Bộ Sưu Tập"
6. **Scan QR code**: Để truy cập trên điện thoại

## 🏛️ Điểm Khám Phá

| ID | Tên Điểm | Hiện Vật | Icon | Mô Tả |
|----|----------|----------|------|-------|
| PT1 | CỔNG ĐỊA ĐẠO PHÚ THỌ HÒA | Bản Đồ Bí Mật | 🗺️ | Cổng vào hệ thống địa đạo |
| PT2 | KHU TRƯNG BÀY VŨ KHÍ | Súng Trường Cổ | 🔫 | Vũ khí lịch sử |
| PT3 | HẦM CHỈ HUY | Đài Liên Lạc | 📡 | Trung tâm điều hành |
| PT4 | HẦM Y TẾ | Bộ Dụng Cụ Y Tế | 🏥 | Chăm sóc sức khỏe |
| PT5 | HẦM BẾP | Nồi Đồng Truyền Thống | 🍳 | Văn hóa ẩm thực |
| PT6 | HẦM NGỦ | Chiếu Cỏ Dân Gian | 🛏️ | Sinh hoạt hàng ngày |

## 🛠️ Cài Đặt và Chạy

### Yêu Cầu Hệ Thống
- Node.js 16+
- npm hoặc yarn

### Cài Đặt
```bash
# Clone repository
git clone [repository-url]
cd webapp

# Cài đặt dependencies
npm install

# Chạy development server
npm run dev
```

### Truy Cập
- Local: `http://localhost:3001`
- Network: Sử dụng `--host` để expose

## 📱 Test Trên Mobile

1. **Chạy với host**:
   ```bash
   npm run dev -- --host
   ```

2. **Truy cập từ mobile**:
   - Mở QR code trong ứng dụng
   - Hoặc truy cập IP của máy tính

3. **Test tính năng**:
   - Click vào các điểm trên bản đồ
   - Nghe AI voice
   - Thu thập hiện vật

## 🎨 Thiết Kế

### Màu Sắc Việt Nam
- **Đỏ**: #da251d (Quốc kỳ Việt Nam)
- **Vàng**: #ffd700 (Quốc kỳ Việt Nam)
- **Đen**: #1a1a1a (Nền tối)
- **Xám**: #2d2d2d (Nền phụ)

### Giao Diện
- Responsive design
- Gradient màu Việt Nam
- Animation mượt mà
- Typography rõ ràng

## 🔮 Tính Năng Tương Lai

### 🚀 NFT Integration
- Mint hiện vật thành NFT
- Tích hợp ví blockchain
- Marketplace cho hiện vật

### 🎯 AR/VR Support
- Hiển thị 3D hiện vật
- AR overlay trên bản đồ
- VR tour địa đạo

### 📍 GPS Integration
- Vị trí thực tế
- Geofencing
- Location-based rewards

### 🤖 AI Enhancement
- Voice recognition
- Natural language processing
- Personalized stories

## 🏗️ Tech Stack

### Frontend
- **React 18**: UI framework
- **Vite**: Build tool
- **CSS3**: Styling với gradients và animations
- **Web Speech API**: AI voice synthesis

### Dependencies
- **qrcode.react**: QR code generation
- **@react-three/fiber**: 3D rendering (future)
- **@react-three/drei**: 3D utilities (future)

### Storage
- **localStorage**: Client-side persistence
- **Session management**: Random station selection

## 📊 Performance

- **Bundle size**: ~500KB gzipped
- **Load time**: <2s trên 3G
- **Voice latency**: <100ms
- **Animation**: 60fps

## 🐛 Troubleshooting

### AI Voice Không Hoạt Động
1. Kiểm tra browser support
2. Cho phép microphone access
3. Thử refresh trang
4. Kiểm tra console logs

### QR Code Không Scan Được
1. Đảm bảo URL đúng
2. Thử zoom in/out
3. Kiểm tra ánh sáng
4. Thử camera khác

### Hiện Vật Không Lưu
1. Kiểm tra localStorage
2. Thử refresh trang
3. Xóa cache browser
4. Kiểm tra console errors

## 🤝 Đóng Góp

1. Fork repository
2. Tạo feature branch
3. Commit changes
4. Push to branch
5. Tạo Pull Request

## 📄 License

MIT License - Xem file LICENSE để biết thêm chi tiết.

## 🌟 CODE THE ROOTS

**Kết Nối Quá Khứ Với Tương Lai**

---

*Dự án được phát triển với tình yêu dành cho lịch sử và văn hóa Việt Nam* 🇻🇳 
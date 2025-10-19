# 🎮 Odd/Even Tic-Tac-Toe

Multiplayer game với React + WebSocket để học về Distributed Systems.

## 🚀 Cách chạy

### 1. Chạy Server
\`\`\`bash
cd server
npm install
npm start
\`\`\`

### 2. Chạy Client (Terminal mới)
\`\`\`bash
cd client
npm install
npm run dev
\`\`\`

### 3. Mở 2 tab browser
- Tab 1: http://localhost:3000 (Player 1 - ODD)
- Tab 2: http://localhost:3000 (Player 2 - EVEN)

## 📦 Deploy lên GitHub

\`\`\`bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/username/oddeven-tictactoe.git
git push -u origin main
\`\`\`

## 🎯 Tính năng

✅ Multiplayer qua WebSocket
✅ Server authority & operational transforms
✅ Bảng thống kê thắng-thua
✅ Nút New Game
✅ Optimistic updates
✅ Giao diện đẹp với màu đen + xanh Naver

## 🎮 Luật chơi

- Board 5x5, tất cả ô bắt đầu = 0
- Click ô để tăng số lên 1
- Người LẺ thắng: 5 số lẻ liên tiếp
- Người CHẴN thắng: 5 số chẵn liên tiếp
- Cả 2 người có thể click bất kỳ ô nào!
\`\`\`

---

## ✅ CHECKLIST HOÀN THÀNH

Trước khi submit:
- [ ] Server chạy được trên ws://localhost:8080
- [ ] Client chạy được trên http://localhost:3000
- [ ] 2 players có thể kết nối và chơi
- [ ] Click cùng lúc → cả 2 clicks đều được tính
- [ ] Win detection hoạt động đúng
- [ ] Bảng điểm cập nhật sau mỗi game
- [ ] Nút New Game hoạt động
- [ ] Code đã push lên GitHub
- [ ] README.md có hướng dẫn rõ ràng

## 📚 Kiến thức học được

1. **Server Authority**: Server là nguồn chân lý duy nhất
2. **Operational Transforms**: Gửi operations (INCREMENT) thay vì states
3. **WebSocket**: Real-time bidirectional communication
4. **Race Conditions**: Xử lý simultaneous actions
5. **Optimistic Updates**: Cập nhật UI ngay, chờ server confirm

## 🐛 Troubleshooting

**Problem: "WebSocket connection failed"**
- Kiểm tra server đã chạy chưa: `cd server && npm start`
- Kiểm tra port 8080 có bị chiếm không

**Problem: "Cannot find module"**
- Chạy `npm install` trong cả 2 thư mục server và client

**Problem: "Third player cannot join"**
- Đúng rồi! Game chỉ cho 2 người. Player thứ 3 sẽ bị reject.

**Problem: "Game không start"**
- Game chỉ start khi cả 2 players đã connect
- Mở 2 tab browser để test

## 🎨 Tùy chỉnh màu sắc

Trong code, tìm và thay đổi:
- `#00ff88` - Màu chủ đạo (xanh Naver)
- `#000` - Nền đen
- `#111` - Đen nhạt cho cards
- `#60a5fa` - Xanh dương (số lẻ)
- `#064e3b` - Xanh đậm (số chẵn)
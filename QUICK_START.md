
# 🎮 Chess Game - Quick Start Guide

## 1️⃣ Installation (One-time setup)

### Windows:
Double-click `setup.bat` in the project root

### Mac/Linux:
```bash
bash setup.sh
```

Or manually:
```bash
npm install
cd server
npm install
```

## 2️⃣ Running the Game

### Terminal 1 - Start Server:
```bash
cd server
npm start
```
Server runs on: http://localhost:3000

### Terminal 2 - Start Frontend:
```bash
npm run dev
```
Frontend runs on: http://localhost:5173

## 3️⃣ Playing the Game

### Create New Game:
1. Click "Create New Game"
2. Get the game URL
3. Share it with opponent

### Join Existing Game:
1. Click "Refresh Games"
2. Select a game
3. Click "Join as Black"

### Start Playing:
- White player clicks "Start Game"
- White moves first
- Drag pieces to valid squares
- Game ends at checkmate

## 🎯 Game Rules

✅ Standard chess rules apply
✅ Valid moves only (piece movement + capture)
✅ Check detection (king under attack)
✅ Checkmate detection (game ends)
✅ Turn-based gameplay

## 🔧 Configuration

Edit `.env.local` if server is on different port:
```
VITE_SERVER_URL=http://localhost:3000
```

## 📁 Project Structure

```
chessgame/
├── src/                    Frontend React app
├── server/                 Backend Node.js server
├── package.json
├── setup.bat / setup.sh    One-click setup
└── README.md               Full documentation
```

## 🚀 Performance Tips

- Use modern browser (Chrome, Firefox, Safari, Edge)
- Check browser console for errors (F12)
- Ensure both players are in same game room
- Verify server is running before starting frontend

## ❓ Troubleshooting

### Can't connect to server?
- Check server is running on port 3000
- Look for CORS errors in browser console
- Verify VITE_SERVER_URL in .env.local

### Moves not syncing?
- Check WebSocket connection (Network tab)
- Restart both server and frontend
- Verify both players in same game

### Game feels slow?
- Check network connection
- Monitor server logs for errors
- Check browser CPU usage

## 📞 Support

Full documentation available in README.md
Server code: server/server.js
Client code: src/component/chessboard/ChessBoard.tsx
Game logic: src/referee/Referee.ts

Happy Chess! ♟️

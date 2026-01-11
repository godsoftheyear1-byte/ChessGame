# 📚 Documentation Index

Quick links to all documentation and guides for the multiplayer chess game.

## 🚀 Getting Started

1. **[QUICK_START.md](./QUICK_START.md)** - Start here!
   - 5-minute setup guide
   - Running instructions
   - Basic gameplay

2. **[setup.bat](./setup.bat)** (Windows) or **[setup.sh](./setup.sh)** (Mac/Linux)
   - One-click automatic setup
   - Just run and follow prompts

## 📖 Main Documentation

3. **[README.md](./README.md)** - Complete documentation
   - Full feature list
   - Installation details
   - Running the app
   - API documentation
   - Game rules
   - Troubleshooting
   - Technologies used

4. **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)** - Architecture overview
   - What was created
   - How to run
   - Architecture diagram
   - WebSocket events
   - File changes
   - Next steps

## 🔧 Reference Guides

5. **[QUICK_START.md](./QUICK_START.md)** - Quick reference
   - Commands
   - Configuration
   - Game rules
   - Performance tips

6. **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** - Problem solving
   - Installation issues
   - Server problems
   - Frontend issues
   - Network troubleshooting
   - Browser-specific fixes
   - Getting help

7. **[VERIFICATION_CHECKLIST.md](./VERIFICATION_CHECKLIST.md)** - Testing guide
   - Setup checklist
   - Testing procedures
   - API verification
   - Production deployment checklist

## 📁 Configuration Files

- **[.env.example](./.env.example)** - Environment variables template
  - Copy to `.env.local`
  - Set `VITE_SERVER_URL=http://localhost:3000`

- **[.gitignore](./.gitignore)** - Git ignore rules

## 💻 Code Files

### Server (Backend)
- **[server/server.js](./server/server.js)** - Main server file
  - Express + Socket.IO setup
  - Game management
  - WebSocket handlers

- **[server/package.json](./server/package.json)** - Server dependencies

- **[server/Dockerfile](./server/Dockerfile)** - Docker container setup

- **[server/.gitignore](./server/.gitignore)** - Server Git ignore

### Frontend (Client)
- **[src/component/chessboard/ChessBoard.tsx](./src/component/chessboard/ChessBoard.tsx)** - Main game component
  - Multiplayer logic
  - Socket.IO integration
  - Game UI

- **[src/component/chessboard/ChessBoard.css](./src/component/chessboard/ChessBoard.css)** - Game styles
  - Board styling
  - Modal styles
  - Responsive design

- **[src/referee/Referee.ts](./src/referee/Referee.ts)** - Chess rule validation
  - Move validation
  - Check/checkmate detection

### Build & Config
- **[package.json](./package.json)** - Frontend dependencies

- **[vite.config.js](./vite.config.js)** - Vite configuration

## 🎯 Quick Navigation

### I want to...

**Get started quickly**
→ Run [setup.bat](./setup.bat) or [setup.sh](./setup.sh)

**Learn how to play**
→ Read [QUICK_START.md](./QUICK_START.md) → Game Rules section

**Understand the architecture**
→ Read [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)

**Fix an issue**
→ Check [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

**Deploy to production**
→ See [README.md](./README.md) → Future Enhancements section
→ Check [VERIFICATION_CHECKLIST.md](./VERIFICATION_CHECKLIST.md) → Deployment section

**Understand the code**
→ See [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) → Architecture section

**Test everything**
→ Follow [VERIFICATION_CHECKLIST.md](./VERIFICATION_CHECKLIST.md)

## 🔑 Key Commands

```bash
# Setup
npm install && cd server && npm install

# Run server (Terminal 1)
cd server && npm start

# Run frontend (Terminal 2)
npm run dev

# Build for production
npm run build
```

## 📊 File Organization

```
chessgame/
├── Documentation
│   ├── README.md                    ← Comprehensive guide
│   ├── QUICK_START.md               ← Fast setup
│   ├── IMPLEMENTATION_SUMMARY.md    ← Architecture
│   ├── TROUBLESHOOTING.md           ← Problem solving
│   ├── VERIFICATION_CHECKLIST.md    ← Testing guide
│   ├── FILES_INDEX.md               ← This file
│   └── .env.example                 ← Config template
│
├── Setup Scripts
│   ├── setup.bat                    ← Windows setup
│   └── setup.sh                     ← Mac/Linux setup
│
├── Server
│   ├── server/server.js             ← Backend
│   ├── server/package.json
│   ├── server/Dockerfile
│   └── server/.gitignore
│
├── Frontend
│   ├── src/component/chessboard/ChessBoard.tsx
│   ├── src/component/chessboard/ChessBoard.css
│   ├── src/referee/Referee.ts
│   ├── package.json
│   └── vite.config.js
│
└── Public Assets
    └── public/images/               ← Chess piece images
```

## 🌐 Default Ports

- **Server**: `http://localhost:3000`
- **Frontend**: `http://localhost:5173`

## 🛠️ Technologies

- **Frontend**: React 19, TypeScript, Vite, Socket.IO Client
- **Backend**: Node.js, Express, Socket.IO
- **Communication**: WebSocket

## 📞 Support

For issues:
1. Check [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
2. Review browser console (F12)
3. Check server logs
4. Restart everything
5. Reinstall dependencies

---

**Start with**: [QUICK_START.md](./QUICK_START.md) ⚡

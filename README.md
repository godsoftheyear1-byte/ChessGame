# Chess Game - Multiplayer

A multiplayer chess game built with React, Vite, TypeScript, Node.js, Express, and Socket.IO.

## Features

✅ Real-time multiplayer gameplay via WebSocket
✅ Game room creation and joining
✅ Full chess rule validation (moves, check, checkmate)
✅ Game state synchronization across clients
✅ Touch and mouse support
✅ Game restart functionality

## Project Structure

```
chessgame/
├── src/                          # Frontend React application
│   ├── component/
│   │   ├── chessboard/
│   │   │   ├── ChessBoard.tsx   # Main game component (multiplayer)
│   │   │   └── ChessBoard.css
│   │   └── Tile/
│   │       ├── Tile.tsx
│   │       └── Tile.css
│   ├── referee/
│   │   └── Referee.ts           # Chess rule validation
│   ├── App.jsx
│   └── main.jsx
├── server/                       # Backend Node.js server
│   ├── server.js                # Express + Socket.IO server
│   └── package.json
├── package.json                 # Frontend dependencies
├── vite.config.js
└── .env.example
```

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn

## Installation

### 1. Install Frontend Dependencies

```bash
cd chessgame
npm install
```

### 2. Install Server Dependencies

```bash
cd server
npm install
cd ..
```

### 3. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env.local
```

Edit `.env.local` if your server is running on a different URL:

```
VITE_SERVER_URL=http://localhost:3000
```

## Running the Application

### Terminal 1: Start the Server

```bash
cd server
npm start
```

Or for development with auto-reload:

```bash
cd server
npm run dev
```

The server will start on `http://localhost:3000`

### Terminal 2: Start the Frontend

```bash
npm run dev
```

The frontend will start on `http://localhost:5173` (or similar)

## How to Play

### Create a New Game

1. Open the application in your browser
2. Click **"Create New Game"**
3. Copy the generated game URL
4. Share it with your opponent (they can click the link or manually enter it)

### Join an Existing Game

1. Click **"Refresh Games"** to see available games
2. Select a game and click **"Join as Black"**
3. Wait for both players to be connected

### Start Playing

1. The white player (game creator) clicks **"Start Game"**
2. White moves first
3. Make moves by dragging pieces to valid squares
4. The game ends when checkmate is achieved

## API Endpoints

### REST API

- `GET /api/health` - Server health check
- `POST /api/games` - Create a new game
- `GET /api/games` - List available (open) games
- `GET /api/games/:gameId` - Get specific game state

### WebSocket Events

**Client → Server:**
- `join_game` - Join a game with a color (white/black)
- `start_game` - Initialize the game with starting pieces
- `make_move` - Send a move to the server
- `restart_game` - Restart the current game
- `send_message` - Send a chat message
- `get_game_state` - Request current game state

**Server → Client:**
- `player_joined` - Notification when a player joins
- `game_started` - Game has started
- `move_made` - A move was made (receives updated board state)
- `game_restarted` - Game was restarted
- `player_disconnected` - Opponent disconnected
- `receive_message` - Chat message received

## Game Rules

The game follows standard chess rules:

- **Pawn**: Moves 1 square forward (2 on first move), captures diagonally
- **Rook**: Moves any distance horizontally or vertically
- **Knight**: Moves in L-shape (2+1)
- **Bishop**: Moves any distance diagonally
- **Queen**: Combines rook and bishop movement
- **King**: Moves 1 square in any direction

Special rules:
- Check detection and validation
- Checkmate detection
- Preventing moves that leave your king in check

## Troubleshooting

### "Cannot connect to server"
- Ensure the server is running on `localhost:3000`
- Check that `VITE_SERVER_URL` in `.env.local` matches your server URL
- Check browser console for CORS errors

### "Moves not syncing"
- Verify both players are in the same game room
- Check server logs for errors
- Ensure WebSocket connection is active (browser dev tools → Network)

### "Game state is wrong"
- Refresh the page
- Check that the Referee.ts chess logic is correct
- Verify server-side game state matches client

## Development

### Building for Production

```bash
npm run build
```

### Linting

```bash
npm run lint
```

## Technologies

- **Frontend**: React 19, TypeScript, Vite
- **Backend**: Node.js, Express, Socket.IO
- **Communication**: WebSocket (Socket.IO)
- **Styling**: CSS3

## Future Enhancements

- [ ] User authentication
- [ ] Game history/replay
- [ ] Chess timer
- [ ] Piece promotion
- [ ] En passant capture
- [ ] Castling
- [ ] Chat between players
- [ ] Rating system
- [ ] Database persistence

## License

MIT


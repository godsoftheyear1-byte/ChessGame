import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Store active games
const games = new Map();

// Store player info
const players = new Map();

class ChessGame {
  constructor(gameId) {
    this.gameId = gameId;
    this.whitePlayer = null;
    this.blackPlayer = null;
    this.pieces = [];
    this.currentTurn = 'white'; // 'white' or 'black'
    this.moveHistory = [];
    this.isCheckmate = false;
    this.isCheck = false;
    this.winner = null;
    this.createdAt = Date.now();
  }

  addPlayer(playerId, color) {
    if (color === 'white' && !this.whitePlayer) {
      this.whitePlayer = playerId;
      return true;
    }
    if (color === 'black' && !this.blackPlayer) {
      this.blackPlayer = playerId;
      return true;
    }
    return false;
  }

  isFull() {
    return this.whitePlayer && this.blackPlayer;
  }

  getPlayerColor(playerId) {
    if (playerId === this.whitePlayer) return 'white';
    if (playerId === this.blackPlayer) return 'black';
    return null;
  }

  getOpponent(playerId) {
    if (playerId === this.whitePlayer) return this.blackPlayer;
    if (playerId === this.blackPlayer) return this.whitePlayer;
    return null;
  }
}

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date().toISOString() });
});

app.post('/api/games', (req, res) => {
  const gameId = `game_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const game = new ChessGame(gameId);
  games.set(gameId, game);
  
  console.log(`Game created: ${gameId}`);
  res.json({ gameId, message: 'Game created successfully' });
});

app.get('/api/games/:gameId', (req, res) => {
  const game = games.get(req.params.gameId);
  if (!game) {
    return res.status(404).json({ error: 'Game not found' });
  }

  res.json({
    gameId: game.gameId,
    whitePlayer: game.whitePlayer,
    blackPlayer: game.blackPlayer,
    isFull: game.isFull(),
    currentTurn: game.currentTurn,
    isCheckmate: game.isCheckmate,
    isCheck: game.isCheck,
    winner: game.winner
  });
});

app.get('/api/games', (req, res) => {
  const availableGames = Array.from(games.values())
    .filter(game => !game.isFull())
    .map(game => ({
      gameId: game.gameId,
      whitePlayer: game.whitePlayer ? 'occupied' : 'available',
      blackPlayer: game.blackPlayer ? 'occupied' : 'available',
      createdAt: game.createdAt
    }));

  res.json({ games: availableGames });
});

// WebSocket Events
io.on('connection', (socket) => {
  console.log(`Player connected: ${socket.id}`);
  players.set(socket.id, { socketId: socket.id, gameId: null });

  socket.on('join_game', ({ gameId, color }, callback) => {
    const game = games.get(gameId);
    
    if (!game) {
      callback({ success: false, error: 'Game not found' });
      return;
    }

    if (!game.addPlayer(socket.id, color)) {
      callback({ success: false, error: `${color} side is already occupied` });
      return;
    }

    const playerInfo = players.get(socket.id);
    playerInfo.gameId = gameId;

    socket.join(gameId);
    callback({ 
      success: true, 
      color, 
      gameId,
      whitePlayer: game.whitePlayer,
      blackPlayer: game.blackPlayer
    });

    io.to(gameId).emit('player_joined', {
      whitePlayer: game.whitePlayer,
      blackPlayer: game.blackPlayer,
      isFull: game.isFull(),
      color,
      message: `${color} player joined the game`
    });

    console.log(`Player ${socket.id} joined game ${gameId} as ${color}`);
  });

  socket.on('start_game', ({ gameId, initialPieces }, callback) => {
    const game = games.get(gameId);
    if (!game) {
      callback({ success: false, error: 'Game not found' });
      return;
    }

    game.pieces = initialPieces;
    io.to(gameId).emit('game_started', {
      pieces: initialPieces,
      currentTurn: game.currentTurn
    });

    callback({ success: true });
    console.log(`Game ${gameId} started`);
  });

  socket.on('make_move', ({ gameId, pieces, currentTurn, isCheck, isCheckmate, winner }, callback) => {
    const game = games.get(gameId);
    if (!game) {
      callback({ success: false, error: 'Game not found' });
      return;
    }

    game.pieces = pieces;
    game.currentTurn = currentTurn;
    game.isCheck = isCheck;
    game.isCheckmate = isCheckmate;
    game.winner = winner;

    game.moveHistory.push({
      timestamp: Date.now(),
      pieces: JSON.parse(JSON.stringify(pieces)),
      currentTurn,
      movedBy: socket.id
    });

    io.to(gameId).emit('move_made', {
      pieces,
      currentTurn,
      isCheck,
      isCheckmate,
      winner,
      movedBy: socket.id
    });

    callback({ success: true });
  });

  socket.on('restart_game', ({ gameId, initialPieces }, callback) => {
    const game = games.get(gameId);
    if (!game) {
      callback({ success: false, error: 'Game not found' });
      return;
    }

    game.pieces = initialPieces;
    game.currentTurn = 'white';
    game.moveHistory = [];
    game.isCheckmate = false;
    game.isCheck = false;
    game.winner = null;

    io.to(gameId).emit('game_restarted', {
      pieces: initialPieces,
      currentTurn: 'white'
    });

    callback({ success: true });
    console.log(`Game ${gameId} restarted`);
  });

  socket.on('send_message', ({ gameId, message }, callback) => {
    const game = games.get(gameId);
    if (!game) return;

    io.to(gameId).emit('receive_message', {
      senderId: socket.id,
      message,
      timestamp: new Date().toISOString()
    });

    callback({ success: true });
  });

  socket.on('disconnect', () => {
    const playerInfo = players.get(socket.id);
    if (playerInfo?.gameId) {
      const game = games.get(playerInfo.gameId);
      if (game) {
        io.to(playerInfo.gameId).emit('player_disconnected', {
          playerId: socket.id,
          message: 'Opponent has disconnected'
        });
        console.log(`Player ${socket.id} disconnected from game ${playerInfo.gameId}`);
      }
    }
    players.delete(socket.id);
    console.log(`Player disconnected: ${socket.id}`);
  });

  socket.on('get_game_state', ({ gameId }, callback) => {
    const game = games.get(gameId);
    if (!game) {
      callback({ success: false, error: 'Game not found' });
      return;
    }

    callback({
      success: true,
      gameState: {
        pieces: game.pieces,
        currentTurn: game.currentTurn,
        isCheck: game.isCheck,
        isCheckmate: game.isCheckmate,
        winner: game.winner,
        moveHistory: game.moveHistory
      }
    });
  });
});

httpServer.listen(PORT, () => {
  console.log(`Chess server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

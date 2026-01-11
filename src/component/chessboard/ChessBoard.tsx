import "./ChessBoard.css";
import Tile from "../Tile/Tile";
import React, { useEffect, useRef, useState } from "react";
import Referee from "../../referee/Referee";
import { io } from "socket.io-client";



const verticalAxis = ["1","2","3","4","5","6","7","8"];
const horizontalAxis = ["a","b","c","d","e","f","g","h"];

export interface Piece {
   image:string ;
   x:number ;
   y:number ;
   type: PieceType;
   team: TeamType;
}

export enum TeamType {
   OPPONENT,
   OUR,
}

export enum PieceType {
   PAWN,
   ROOK,
   BISHOP,
   KNIGHT,
   QUEEN,
   KING
}

// Fixed: Initialize board properly
const InitialBoardState: Piece [] = [];
for(let p = 0 ; p <2; p++) {
   const teamType = (p === 0) ? TeamType.OPPONENT : TeamType.OUR;
   const type = (teamType === TeamType.OPPONENT) ? "d":"t";
   // place OPPONENT at top (y=0) and OUR at bottom (y=7)
   const y = (teamType === TeamType.OPPONENT ) ? 0 : 7 ;

   InitialBoardState.push ({ image:`/images/rak_${type}.png`, x: 0, y, type: PieceType.ROOK, team: teamType});
   InitialBoardState.push ({ image:`/images/rak_${type}.png`, x: 7, y, type: PieceType.ROOK , team: teamType });
   InitialBoardState.push ({ image:`/images/nit_${type}.png`, x: 1, y, type: PieceType.KNIGHT, team: teamType });
   InitialBoardState.push ({ image:`/images/nit_${type}.png`, x: 6, y, type: PieceType.KNIGHT, team: teamType });
   InitialBoardState.push ({ image:`/images/bet_${type}.png`, x: 5, y, type: PieceType.BISHOP, team: teamType });
   InitialBoardState.push ({ image:`/images/bet_${type}.png`, x: 2, y, type: PieceType.BISHOP, team: teamType});
   InitialBoardState.push ({ image:`/images/qe_${type}.png`, x: 3, y, type: PieceType.QUEEN, team: teamType});
   InitialBoardState.push ({ image:`/images/kit_${type}.png`, x: 4, y, type: PieceType.KING, team: teamType});
}

// Fixed: Add opponent pawns
for (let i = 0 ; i < 8; i++){
   // opponent pawns on second rank from top
   InitialBoardState.push ({ image:"/images/paw_d.png", x: i, y: 1, type: PieceType.PAWN, team: TeamType.OPPONENT,});
}

// Fixed: Add our pawns
for (let i = 0 ; i < 8; i++){
   // our pawns on second rank from bottom
   InitialBoardState.push ({ image:"/images/paw_t.png", x: i, y: 6, type: PieceType.PAWN, team: TeamType.OUR, });
}

const referee = new Referee();

export default function ChessBoard() {
   const [activePiece , setActivePiece]=useState<HTMLElement | null>(null)
   const [ gridY, setGridY]=useState (0);
   const [gridX, setGridX]=useState (0);
   const [pieces, setPieces] = useState <Piece[]>(InitialBoardState)
   const [currentTurn, setCurrentTurn] = useState <TeamType>(TeamType.OUR)
   const [isCheckmate, setIsCheckmate] = useState <boolean>(false)
   const [winner, setWinner] = useState <string>("")
   const [isCheck, setIsCheck] = useState <boolean>(false)
   const chessboardRef = useRef<HTMLDivElement>(null);

   // Multiplayer state
   const [socket, setSocket] = useState<any>(null);
   const [gameId, setGameId] = useState<string | null>(null);
   const [playerColor, setPlayerColor] = useState<'white' | 'black' | null>(null);
   const [opponentConnected, setOpponentConnected] = useState(false);
   const [gameStarted, setGameStarted] = useState(false);
   const [showGameSetup, setShowGameSetup] = useState(true);
   const [availableGames, setAvailableGames] = useState<any[]>([]);
   const [gameUrl, setGameUrl] = useState("");
   const [message, setMessage] = useState("");

   // Initialize Socket.IO connection
   useEffect(() => {
      try {
         // Prefer explicit env var, otherwise derive server host from the page's host
         const envServer = (import.meta as any).env.VITE_SERVER_URL;
         const pageHost = window.location.hostname;
         const inferredHost = (pageHost === 'localhost' || pageHost === '127.0.0.1') ? 'localhost' : pageHost;
         const serverUrl = envServer || `${window.location.protocol}//${inferredHost}:3000`;
         const newSocket: any = io(serverUrl, {
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            reconnectionAttempts: 5
         });

         newSocket.on('connect', () => {
            console.log('Connected to server');
            setMessage('Connected to server');
         });

         newSocket.on('connect_error', (error: any) => {
            console.error('Connection error:', error);
            setMessage(`Server connection error: ${error.message}`);
         });

         newSocket.on('player_joined', (data: any) => {
            console.log('Player joined:', data);
            setOpponentConnected(data.isFull);
            if (data.isFull) {
               setMessage('Opponent joined! Game ready to start.');
            }
         });

         newSocket.on('move_made', (data: any) => {
            setPieces(data.pieces);
            setCurrentTurn(data.currentTurn === 'white' ? TeamType.OUR : TeamType.OPPONENT);
            setIsCheck(data.isCheck);
            if (data.isCheckmate) {
               setIsCheckmate(true);
               setWinner(data.winner);
            }
         });

         newSocket.on('game_started', (data: any) => {
            setPieces(data.pieces);
            setCurrentTurn(data.currentTurn === 'white' ? TeamType.OUR : TeamType.OPPONENT);
            setGameStarted(true);
            setShowGameSetup(false);
         });

         newSocket.on('game_restarted', (data: any) => {
            setPieces(data.pieces);
            setCurrentTurn(data.currentTurn === 'white' ? TeamType.OUR : TeamType.OPPONENT);
            setIsCheckmate(false);
            setWinner("");
            setIsCheck(false);
         });

         newSocket.on('player_disconnected', (data: any) => {
            setMessage('Opponent disconnected!');
            setOpponentConnected(false);
         });

         newSocket.on('disconnect', () => {
            console.log('Disconnected from server');
            setOpponentConnected(false);
         });

         setSocket(newSocket);

         return () => {
            newSocket.close();
         };
      } catch (error) {
         console.error('Socket connection error:', error);
      }
   }, []);

   // Fetch available games
   const fetchAvailableGames = async () => {
      try {
         const response = await fetch('http://localhost:3000/api/games');
         const data = await response.json();
         setAvailableGames(data.games);
      } catch (error) {
         console.error('Failed to fetch games:', error);
      }
   };

   // Create new game
   const createNewGame = async () => {
      try {
         const response = await fetch('http://localhost:3000/api/games', { method: 'POST' });
         const data = await response.json();
         setGameId(data.gameId);
         setPlayerColor('white');
         setGameUrl(`${window.location.origin}?gameId=${data.gameId}&color=white`);
         
         if (socket) {
            socket.emit('join_game', { gameId: data.gameId, color: 'white' }, (response: any) => {
               if (response.success) {
                  console.log('Joined game as white');
               }
            });
         }
      } catch (error) {
         console.error('Failed to create game:', error);
      }
   };

   // Join existing game
   const joinGame = (gId: string, color: 'white' | 'black') => {
      setGameId(gId);
      setPlayerColor(color);
      
      if (socket) {
         socket.emit('join_game', { gameId: gId, color }, (response: any) => {
            if (response.success) {
               console.log(`Joined game as ${color}`);
            } else {
               setMessage(response.error);
            }
         });
      }
   };

   // Start game
   const startGame = () => {
      if (socket && gameId && playerColor === 'white') {
         socket.emit('start_game', { gameId, initialPieces: InitialBoardState }, (response: any) => {
            if (response.success) {
               console.log('Game started');
            }
         });
      }
   };
   useEffect(() => {
      if (!isCheckmate) {
         // Check if current player's opponent is in checkmate
         const opponentTeam = currentTurn === TeamType.OUR ? TeamType.OPPONENT : TeamType.OUR;
         const checkmate = referee.isCheckmate(opponentTeam, pieces);
         
         if (checkmate) {
            setIsCheckmate(true);
            setWinner(opponentTeam === TeamType.OUR ? "WHITE" : "BLACK");
            console.log(`${opponentTeam === TeamType.OUR ? 'WHITE' : 'BLACK'} is checkmated!`);
            alert(`CHECKMATE! ${opponentTeam === TeamType.OUR ? 'WHITE' : 'BLACK'} wins!`);
         }
      }
   }, [pieces, currentTurn, isCheckmate]);

   // Check for check
   useEffect(() => {
      if (!isCheckmate) {
         // Check if current player's opponent is in check
         const opponentTeam = currentTurn === TeamType.OUR ? TeamType.OPPONENT : TeamType.OUR;
         const check = referee.isKingInCheck(opponentTeam, pieces);
         setIsCheck(check);
      }
   }, [pieces, currentTurn, isCheckmate]);

   // Restart game function
   function restartGame() {
      if (socket && gameId) {
         socket.emit('restart_game', { gameId, initialPieces: InitialBoardState }, (response: any) => {
            if (response.success) {
               console.log('Game restarted');
            }
         });
      } else {
         setPieces(InitialBoardState);
         setCurrentTurn(TeamType.OUR);
         setIsCheckmate(false);
         setWinner("");
         setIsCheck(false);
         setActivePiece(null);
      }
   }

 function grabPiece (e: React.MouseEvent | React.TouchEvent){
      if (isCheckmate) return;

      const chessboard = chessboardRef.current;
      if (!chessboard) return;

      const target = (e.target as HTMLElement).closest('.chess-piece') as HTMLElement | null;
      if (!target) return;

      const rect = chessboard.getBoundingClientRect();
      const tileSize = rect.width / 8;

      const clientX = 'clientX' in e ? e.clientX : e.touches[0].clientX;
      const clientY = 'clientY' in e ? e.clientY : e.touches[0].clientY;

      const gx = Math.floor((clientX - rect.left) / tileSize);
      const gy = Math.floor((clientY - rect.top) / tileSize);

      setGridX(Math.max(0, Math.min(7, gx)));
      setGridY(Math.max(0, Math.min(7, gy)));

      const left = clientX - tileSize / 2;
      const top = clientY - tileSize / 2;

      target.style.position = 'absolute';
      target.style.zIndex = '1000';
      target.style.left = `${left}px`;
      target.style.top = `${top}px`;

      setActivePiece(target);
 }

 function movePiece (e: React.MouseEvent | React.TouchEvent){
    const chessboard = chessboardRef.current;
    if (!activePiece || !chessboard) return;

    const rect = chessboard.getBoundingClientRect();
    const tileSize = rect.width / 8;

    const clientX = 'clientX' in e ? e.clientX : e.touches[0].clientX;
    const clientY = 'clientY' in e ? e.clientY : e.touches[0].clientY;

    let left = clientX - tileSize / 2;
    let top = clientY - tileSize / 2;

    const minLeft = rect.left;
    const maxLeft = rect.right - tileSize;
    const minTop = rect.top;
    const maxTop = rect.bottom - tileSize;

    if (left < minLeft) left = minLeft;
    if (left > maxLeft) left = maxLeft;
    if (top < minTop) top = minTop;
    if (top > maxTop) top = maxTop;

    activePiece.style.position = 'absolute';
    activePiece.style.left = `${left}px`;
    activePiece.style.top = `${top}px`;
 }


 function dropPiece (e: React.MouseEvent | React.TouchEvent){
    const chessboard = chessboardRef.current;  
    
      if(activePiece && chessboard && !isCheckmate) {
         const rect = chessboard.getBoundingClientRect();
         const tileSize = rect.width / 8;

         const clientX = 'clientX' in e ? e.clientX : e.changedTouches[0].clientX;
         const clientY = 'clientY' in e ? e.clientY : e.changedTouches[0].clientY;

         let x = Math.floor((clientX - rect.left) / tileSize);
         let y = Math.floor((clientY - rect.top) / tileSize);
         x = Math.max(0, Math.min(7, x));
         y = Math.max(0, Math.min(7, y));
    
         setPieces((previousPieces) =>{
            console.log("Before move:", previousPieces.length, "pieces");
            
            const movingPiece = previousPieces.find((p) => p.x === gridX && p.y === gridY);
            
            if (!movingPiece) {
                console.log("No piece found at", gridX, gridY);
                return previousPieces;
            }
            
            if (movingPiece.team !== currentTurn) {
                console.log("Not your turn!");
                activePiece.style.position = 'relative';
                activePiece.style.removeProperty('top');
                activePiece.style.removeProperty('left');
                return previousPieces;
            }
            
            const validMove = referee.isValidMove(gridX, gridY, x, y, movingPiece.type, movingPiece.team, previousPieces);
            
            if(validMove){ 
                console.log("Valid move from", gridX, gridY, "to", x, y);
                
                const newPieces = previousPieces.map((p) => {
                    if(p.x === gridX && p.y === gridY){
                        return { ...p, x: x, y: y };
                    }
                    else if (p.x === x && p.y === y && p.team !== movingPiece.team) {
                        return null;
                    }
                    return p;
                });
                
                const filteredPieces = newPieces.filter((p) => p !== null);
                
                console.log("After move:", filteredPieces.length, "pieces");
                
                const newTurn = currentTurn === TeamType.OUR ? TeamType.OPPONENT : TeamType.OUR;
                const newTurnString = newTurn === TeamType.OUR ? 'white' : 'black';
                
                // Check for check/checkmate before sending
                const opponentTeam = newTurn;
                const isOpponentInCheck = referee.isKingInCheck(opponentTeam, filteredPieces);
                const isOpponentInCheckmate = referee.isCheckmate(opponentTeam, filteredPieces);
                const gameWinner = isOpponentInCheckmate ? (opponentTeam === TeamType.OUR ? 'WHITE' : 'BLACK') : null;

                // Send move to server
                if (socket && gameId) {
                   socket.emit('make_move', {
                      gameId,
                      pieces: filteredPieces,
                      currentTurn: newTurnString,
                      isCheck: isOpponentInCheck,
                      isCheckmate: isOpponentInCheckmate,
                      winner: gameWinner
                   }, (response: any) => {
                      if (!response.success) {
                         console.error('Failed to make move:', response.error);
                      }
                   });
                }
                
                setCurrentTurn(newTurn);
                return filteredPieces;
            } else {
                console.log("Invalid move, reverting");
                activePiece.style.position = 'relative';
                activePiece.style.removeProperty('top');
                activePiece.style.removeProperty('left');
                return previousPieces;
            }
         });
         setActivePiece(null)
      }
   }

   let board = [];

   for (let j = 0; j < verticalAxis.length; j++){
     for (let i = 0 ; i < horizontalAxis.length; i++){
        const number = j + i + 2;
        let image = undefined;

        pieces.forEach(p =>{
         if(p.x === i && p.y === j){
            image = p.image;
         }
        });
        board.push(<Tile key={`${j},${i}`} image={image} number={number} />);  

     }
   }
    return (
      <div className="chess-container">
         {/* Game Setup Screen */}
         {showGameSetup && (
            <div className="game-setup-overlay">
               <div className="game-setup-modal">
                  <h2>Chess Game - Multiplayer</h2>
                  
                  <div className="setup-section">
                     <button onClick={() => { setShowGameSetup(false); setGameStarted(true); }} className="setup-button" style={{backgroundColor: '#4CAF50', fontSize: '16px', padding: '12px 20px'}}>Play Now (Local)</button>
                  </div>

                  <div className="setup-section">
                     <h3>Multiplayer</h3>
                     <button onClick={createNewGame} className="setup-button">Create New Game</button>
                     {gameUrl && (
                        <div className="game-url-section">
                           <p>Share this URL with opponent:</p>
                           <input type="text" value={gameUrl} readOnly className="game-url-input" />
                           <button onClick={() => navigator.clipboard.writeText(gameUrl)} className="copy-button">Copy Link</button>
                        </div>
                     )}
                  </div>

                  <div className="setup-section">
                     <h3>Available Games</h3>
                     <button onClick={fetchAvailableGames} className="setup-button">Refresh Games</button>
                     {availableGames.map((game) => (
                        <div key={game.gameId} className="game-item">
                           <span>{game.gameId}</span>
                           <button onClick={() => joinGame(game.gameId, 'black')} className="join-button">Join as Black</button>
                        </div>
                     ))}
                  </div>

                  {gameId && opponentConnected && (
                     <div className="game-ready">
                        <p>✓ Opponent Connected! Game is ready to start.</p>
                        {playerColor === 'white' && (
                           <button onClick={startGame} className="start-button">Start Game</button>
                        )}
                        {playerColor === 'black' && (
                           <p>Waiting for white player to start...</p>
                        )}
                     </div>
                  )}

                  {message && <p className="message">{message}</p>}
               </div>
            </div>
         )}

         {/* Checkmate Alert */}
         {isCheckmate && (
            <div className="checkmate-overlay">
               <div className="checkmate-message">
                  <h2>👑 CHECKMATE! 👑</h2>
                  <p>{winner} WINS!</p>
                  <button onClick={restartGame} className="restart-button">Play Again</button>
               </div>
            </div>
         )}
         
         {/* Check Alert */}
         {isCheck && !isCheckmate && (
            <div className="check-alert">
               ⚠️ CHECK! ⚠️
            </div>
         )}
         
         {/* Turn Indicator */}
         {gameStarted && (
            <div className="turn-indicator">
               <h3>Current Turn: {currentTurn === TeamType.OUR ? "WHITE (Bottom)" : "BLACK (Top)"}</h3>
               <p>Color: {playerColor?.toUpperCase()}</p>
               {isCheck && <p className="warning">King is in check!</p>}
               {!opponentConnected && <p className="warning">Opponent disconnected!</p>}
            </div>
         )}
         
         {/* Chess Board */}
         <div 
           onMouseUp={e => dropPiece(e)} 
           onMouseMove={e => movePiece(e)} 
           onMouseDown={e => grabPiece(e)}
           onTouchStart={e => grabPiece(e)}
           onTouchMove={e => movePiece(e)}
           onTouchEnd={e => dropPiece(e)}
           id="chessboard" 
           ref={chessboardRef}
         >
           {board}
         </div>
         
         {/* Restart Button */}
         {gameStarted && (
            <button onClick={restartGame} className="restart-button-small">Restart Game</button>
         )}
      </div>
   );
}
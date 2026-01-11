import { PieceType, TeamType, Piece } from "../component/chessboard/ChessBoard";

export default class referee {
   
    tileIsOccupied(x: number, y: number, boardState: Piece[]): boolean {
        const piece = boardState.find((p) => p.x === x && p.y === y);
        return piece !== undefined;
    }

   
    tileIsOccupiedByOpponent(x: number, y: number, boardState: Piece[], team: TeamType): boolean {
        const piece = boardState.find((p) => p.x === x && p.y === y && p.team !== team);
        return piece !== undefined;
    }

   
    isPathClear(px: number, py: number, x: number, y: number, boardState: Piece[]): boolean {
        const dx = Math.sign(x - px);
        const dy = Math.sign(y - py);
        
        let currentX = px + dx;
        let currentY = py + dy;
        
       
        while (currentX !== x || currentY !== y) {
            if (this.tileIsOccupied(currentX, currentY, boardState)) {
                return false; 
            }
            currentX += dx;
            currentY += dy;
        }
        
        return true; 
    }

    // Find the king's position for a given team
    findKing(team: TeamType, boardState: Piece[]): Piece | undefined {
        return boardState.find((p) => p.type === PieceType.KING && p.team === team);
    }

    // Check if a square is under attack by any opponent piece
    isSquareAttacked(x: number, y: number, team: TeamType, boardState: Piece[]): boolean {
        // Check all opponent pieces
        for (const piece of boardState) {
            if (piece.team !== team) {
                // Check if this opponent piece can attack the square
                if (this.canPieceAttack(piece.x, piece.y, x, y, piece.type, boardState)) {
                    console.log(`Square (${x}, ${y}) is attacked by ${PieceType[piece.type]}`);
                    return true;
                }
            }
        }
        return false;
    }

    // Check if a specific piece can attack a square (ignoring check constraints)
    canPieceAttack(px: number, py: number, x: number, y: number, type: PieceType, boardState: Piece[]): boolean {
        switch (type) {
            case PieceType.PAWN:
                return this.canPawnAttack(px, py, x, y, boardState);
            case PieceType.KNIGHT:
                return this.canKnightAttack(px, py, x, y);
            case PieceType.ROOK:
                return this.canRookAttack(px, py, x, y, boardState);
            case PieceType.BISHOP:
                return this.canBishopAttack(px, py, x, y, boardState);
            case PieceType.QUEEN:
                return this.canQueenAttack(px, py, x, y, boardState);
            case PieceType.KING:
                return this.canKingAttack(px, py, x, y);
            default:
                return false;
        }
    }

    // Pawn attacks diagonally (different from movement)
    private canPawnAttack(px: number, py: number, x: number, y: number, boardState: Piece[]): boolean {
        const piece = boardState.find((p) => p.x === px && p.y === py);
        if (!piece) return false;
        // OUR pieces are placed on bottom and move up (decreasing y)
        const direction = (piece.team === TeamType.OUR) ? -1 : 1;

        // Pawns attack diagonally, not straight
        return (Math.abs(x - px) === 1) && (y - py === direction);
    }

    private canKnightAttack(px: number, py: number, x: number, y: number): boolean {
        const dx = Math.abs(x - px);
        const dy = Math.abs(y - py);
        return (dx === 2 && dy === 1) || (dx === 1 && dy === 2);
    }

    private canRookAttack(px: number, py: number, x: number, y: number, boardState: Piece[]): boolean {
        const sameFile = px === x;
        const sameRank = py === y;
        
        if (!sameFile && !sameRank) {
            return false;
        }
        
        return this.isPathClear(px, py, x, y, boardState);
    }

    private canBishopAttack(px: number, py: number, x: number, y: number, boardState: Piece[]): boolean {
        const dx = Math.abs(x - px);
        const dy = Math.abs(y - py);
        
        if (dx !== dy) {
            return false;
        }
        
        return this.isPathClear(px, py, x, y, boardState);
    }

    private canQueenAttack(px: number, py: number, x: number, y: number, boardState: Piece[]): boolean {
        const dx = Math.abs(x - px);
        const dy = Math.abs(y - py);
        
        const sameFile = px === x;
        const sameRank = py === y;
        const diagonal = dx === dy;
        
        if (!sameFile && !sameRank && !diagonal) {
            return false;
        }
        
        return this.isPathClear(px, py, x, y, boardState);
    }

    private canKingAttack(px: number, py: number, x: number, y: number): boolean {
        const dx = Math.abs(x - px);
        const dy = Math.abs(y - py);
        return dx <= 1 && dy <= 1;
    }

    // Check if a team's king is in check
    isKingInCheck(team: TeamType, boardState: Piece[]): boolean {
        const king = this.findKing(team, boardState);
        
        if (!king) {
            console.log("King not found!");
            return false;
        }
        
        const isInCheck = this.isSquareAttacked(king.x, king.y, team, boardState);
        
        if (isInCheck) {
            console.log(`${team === TeamType.OUR ? 'OUR' : 'OPPONENT'} king is in check!`);
        }
        
        return isInCheck;
    }

    // Check if a move would leave the king in check
    wouldMoveCauseCheck(
        px: number,
        py: number,
        x: number,
        y: number,
        type: PieceType,
        team: TeamType,
        boardState: Piece[]
    ): boolean {
        // Simulate the move
        const simulatedBoard = this.simulateMove(px, py, x, y, team, boardState);
        
        // Check if our king is in check after the move
        const isInCheck = this.isKingInCheck(team, simulatedBoard);
        
        if (isInCheck) {
            console.log("Move would leave king in check!");
        }
        
        return isInCheck;
    }

    // Simulate a move and return the new board state
    private simulateMove(px: number, py: number, x: number, y: number, team: TeamType, boardState: Piece[]): Piece[] {
        // Create a copy of the board
        const simulatedBoard = boardState.map(p => ({ ...p }));
        
        // Find and remove the piece at the starting position
        const movingPieceIndex = simulatedBoard.findIndex(p => p.x === px && p.y === py);
        
        if (movingPieceIndex === -1) {
            return simulatedBoard;
        }
        
        const movingPiece = simulatedBoard[movingPieceIndex];
        
        // Remove any piece at the destination (capture)
        const capturedIndex = simulatedBoard.findIndex(p => p.x === x && p.y === y && p.team !== team);
        if (capturedIndex !== -1) {
            simulatedBoard.splice(capturedIndex, 1);
        }
        
        // Update the moving piece's position
        simulatedBoard[movingPieceIndex].x = x;
        simulatedBoard[movingPieceIndex].y = y;
        
        return simulatedBoard;
    }

    // Check if the king is checkmated
    isCheckmate(team: TeamType, boardState: Piece[]): boolean {
        // First, check if king is in check
        if (!this.isKingInCheck(team, boardState)) {
            return false; // Not in check, so not checkmate
        }
        
        // Try all possible moves for all pieces of the team
        for (const piece of boardState) {
            if (piece.team === team) {
                // Try all possible destination squares
                for (let destX = 0; destX < 8; destX++) {
                    for (let destY = 0; destY < 8; destY++) {
                        // Check if this is a valid move
                        if (this.isValidMove(piece.x, piece.y, destX, destY, piece.type, piece.team, boardState)) {
                            // Check if this move would get out of check
                            if (!this.wouldMoveCauseCheck(piece.x, piece.y, destX, destY, piece.type, piece.team, boardState)) {
                                console.log(`Found escape move: ${PieceType[piece.type]} from (${piece.x}, ${piece.y}) to (${destX}, ${destY})`);
                                return false; // Found a valid move that escapes check
                            }
                        }
                    }
                }
            }
        }
        
        // No valid moves found - it's checkmate!
        console.log(`${team === TeamType.OUR ? 'OUR' : 'OPPONENT'} is checkmated!`);
        return true;
    }

    isValidMove(
        px: number,
        py: number,
        x: number,
        y: number,
        type: PieceType,
        team: TeamType,
        boardState: Piece[]
    ): boolean {
        console.log("referee is checking the move ...");
        console.log(`Previous Location (${px}, ${py})`);
        console.log(`Current Location (${x},${y})`);
        console.log(`Piece type: (${type})`);
        console.log(`Team: (${team})`);

      
        if (px === x && py === y) {
            return false;
        }

        
        if (this.tileIsOccupied(x, y, boardState)) {
            const pieceAtDest = boardState.find((p) => p.x === x && p.y === y);
            if (pieceAtDest && pieceAtDest.team === team) {
                return false;
            }
        }

        // Check the piece's basic movement rules
        let validMove = false;
        switch (type) {
            case PieceType.PAWN:
                validMove = this.isValidPawnMove(px, py, x, y, team, boardState);
                break;
            case PieceType.KNIGHT:
                validMove = this.isValidKnightMove(px, py, x, y);
                break;
            case PieceType.ROOK:
                validMove = this.isValidRookMove(px, py, x, y, boardState);
                break;
            case PieceType.BISHOP:
                validMove = this.isValidBishopMove(px, py, x, y, boardState);
                break;
            case PieceType.QUEEN:
                validMove = this.isValidQueenMove(px, py, x, y, boardState);
                break;
            case PieceType.KING:
                validMove = this.isValidKingMove(px, py, x, y);
                break;
            default:
                validMove = false;
        }

        if (!validMove) {
            return false;
        }

        // NEW: Check if the move would leave the king in check
        if (this.wouldMoveCauseCheck(px, py, x, y, type, team, boardState)) {
            console.log("Move is invalid because it would leave king in check");
            return false;
        }

        return true;
    }

    private isValidPawnMove(px: number, py: number, x: number, y: number, team: TeamType, boardState: Piece[]): boolean {
        // OUR pawns start near bottom (y=6) and move up (y--), opponent pawns start near top (y=1) and move down (y++)
        const startRow = (team === TeamType.OUR) ? 6 : 1;
        const direction = (team === TeamType.OUR) ? -1 : 1;
        const forwardOne = y - py === direction;
        const forwardTwo = y - py === 2 * direction;
        const sameFile = px === x;
        const diagonalOne = Math.abs(x - px) === 1 && forwardOne;

      
        if (sameFile && forwardOne) {
            return !this.tileIsOccupied(x, y, boardState);
        }

        
        if (sameFile && forwardTwo && py === startRow) {
          
            return !this.tileIsOccupied(x, y, boardState) && 
                   !this.tileIsOccupied(x, py + direction, boardState);
        }

     
        if (diagonalOne) {
            return this.tileIsOccupiedByOpponent(x, y, boardState, team);
        }

        return false;
    }

    private isValidKnightMove(px: number, py: number, x: number, y: number): boolean {
        const dx = Math.abs(x - px);
        const dy = Math.abs(y - py);
      
        return (dx === 2 && dy === 1) || (dx === 1 && dy === 2);
    }

    private isValidRookMove(px: number, py: number, x: number, y: number, boardState: Piece[]): boolean {
     
        const sameFile = px === x;
        const sameRank = py === y;
        
        if (!sameFile && !sameRank) {
            return false; 
        }
        
      
        return this.isPathClear(px, py, x, y, boardState);
    }

    private isValidBishopMove(px: number, py: number, x: number, y: number, boardState: Piece[]): boolean {
        const dx = Math.abs(x - px);
        const dy = Math.abs(y - py);
        
        if (dx !== dy) {
            return false; 
        }
        
       
        return this.isPathClear(px, py, x, y, boardState);
    }

    private isValidQueenMove(px: number, py: number, x: number, y: number, boardState: Piece[]): boolean {
       
        const dx = Math.abs(x - px);
        const dy = Math.abs(y - py);
        
        const sameFile = px === x;
        const sameRank = py === y;
        const diagonal = dx === dy;
        
        if (!sameFile && !sameRank && !diagonal) {
            return false;
        }
         
        return this.isPathClear(px, py, x, y, boardState);
    }

    private isValidKingMove(px: number, py: number, x: number, y: number): boolean {
       
        const dx = Math.abs(x - px);
        const dy = Math.abs(y - py);
        
        return dx <= 1 && dy <= 1;
    }
}
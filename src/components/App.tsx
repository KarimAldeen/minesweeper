import React, { useState } from 'react';
import { Game, Cell } from '../game';
import GameBoard from './GameBoard';
import PreventContextMenu from '../hooks/PreventContextMenu';
//@ts-ignore
import { Fireworks } from '@fireworks-js/react';
import { GameStateEnum } from '../enums/tile_enum';

//@ts-ignore
import revealCellSound from '../assets/music/revealCellSound.wav';
//@ts-ignore
import mineCellSound from '../assets/music/mineCellSound.mp3';

const App: React.FC = () => {
  const [revealclickAudio] = useState(new Audio(revealCellSound));
  const [mineclickAudio] = useState(new Audio(mineCellSound));
  const [game, setGame] = useState<Game | null>(null); // Initialize game as null
  const [gameBoard, setGameBoard] = useState<Cell[][]>([]); // Initialize game board as empty array
  const [gameStatus, setGameStatus] = useState(GameStateEnum.PLAYING);
  const [boardSize, setBoardSize] = useState<number>(6); // Initial board size
  const [minesNumber, setMinesNumber] = useState<number>(10); // Initial number of mines

  // Function to start the game with the specified parameters
  const startGame = () => {
    const newGame = new Game(boardSize, minesNumber);
    setGame(newGame);
    setGameBoard(newGame.getBoard().getCell());
    setGameStatus(GameStateEnum.PLAYING);
  };

  const handleCellClick = (cell: Cell, rowIndex: number, colIndex: number) => {
    // Check if the game is not lost
    if (gameStatus !== GameStateEnum.LOST && game) {
      game.revealCell(cell);
      const gameStatus = game.getState();
      if (gameStatus === GameStateEnum.LOST) {
        mineclickAudio.play();
      }
      setGameStatus(gameStatus);

      const updatedGameBoard = [...gameBoard];
      updatedGameBoard[rowIndex][colIndex] = cell;
      setGameBoard(updatedGameBoard);
      revealclickAudio.play();
    }
  };

  const handleCellRightClick = (cell: Cell, rowIndex: number, colIndex: number) => {
    const updatedGameBoard = [...gameBoard];
    if (game) {
      game.flagCell(cell);
      updatedGameBoard[rowIndex][colIndex] = cell;
      setGameBoard(updatedGameBoard);
    }
  };

  return (
    <div className="App">
      <PreventContextMenu />
      {!game && (
          <>
            <div>
        <label htmlFor="boardSize">Board Size:</label>
        <input
          type="number"
          id="boardSize"
          value={boardSize}
          onChange={(e) => setBoardSize(parseInt(e.target.value))}
        />
      </div>
      <div>
        <label htmlFor="minesNumber">Number of Mines:</label>
        <input
          type="number"
          id="minesNumber"
          value={minesNumber}
          onChange={(e) => setMinesNumber(parseInt(e.target.value))}
        />
      </div>
      <button onClick={startGame}>Start Game</button>

          </>
      )}
    

      {gameStatus === GameStateEnum.LOST && (
        <div className="lost-message">
          <h4>You Lost!</h4>
        </div>
      )}
      {gameStatus === GameStateEnum.WON && (
        <div className="won-message">
          <div className="Fireworks">
            <Fireworks />
          </div>
          <h4>You Won!</h4>
        </div>
      )}
      {/* Render the GameBoard only when the game is started */}
      {game && (
        <GameBoard
          gameBoard={gameBoard}
          onCellClick={handleCellClick}
          onCellRightClick={handleCellRightClick}
        />
      )}
    </div>
  );
};

export default App;

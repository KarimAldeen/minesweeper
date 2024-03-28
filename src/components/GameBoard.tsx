import React from 'react';
import { Cell } from '../game'; // Assuming appropriate imports for game logic
import CellComponent from './Cell'; // Assuming Cell component is exported from Cell.tsx

interface GameBoardProps {
  gameBoard: Cell[][];
  onCellClick: (cell: Cell, rowIndex: number, colIndex: number) => void;
  onCellRightClick: (cell: Cell, rowIndex: number, colIndex: number) => void;
}

const GameBoard: React.FC<GameBoardProps> = ({ gameBoard, onCellClick, onCellRightClick }) => {
    const gridTemplateColumns = `repeat(${gameBoard.length}, 60px)`;
    const gridTemplateRows = `repeat(${gameBoard.length}, 60px)`;  
  return (
    <div className='mine_sweeper' style={{ gridTemplateColumns, gridTemplateRows }}>
      {gameBoard.map((row, rowIndex) => (
        row.map((cell, colIndex) => (
          <CellComponent
            key={`${rowIndex}-${colIndex}_${cell.getStatus()}`}
            cell={cell}
            onClick={() => onCellClick(cell, rowIndex, colIndex)}
            onContextMenu={() => onCellRightClick(cell, rowIndex, colIndex)}
          />
        ))
      ))}
    </div>
  );
};

export default GameBoard;

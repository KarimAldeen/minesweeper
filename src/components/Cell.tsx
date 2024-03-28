import React from 'react';
import { Cell, NormalCell } from '../game'; // Assuming appropriate imports for game logic
import { CellStatusEnum } from '../enums/tile_enum';

interface CellProps {
  cell: Cell;
  onClick: () => void;
  onContextMenu: () => void;
}

const CellComponent: React.FC<CellProps> = ({ cell, onClick, onContextMenu }) => {
  const handleClick = () => {
    onClick();
  };

  const handleRightClick = (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    event.preventDefault(); // Prevent default right-click behavior
    onContextMenu();
  };

  return (
    <span
      onClick={handleClick}
      onContextMenu={handleRightClick}
      className="cell"
      data-status={ cell.getStatus()}
    >
      {cell.getStatus() === CellStatusEnum.REVEALED && cell instanceof NormalCell ? 
      cell.getNumberOfNearMines() === 0  ? "" : cell.getNumberOfNearMines()   
      
      : ''}

    </span>
  );
};

export default CellComponent;

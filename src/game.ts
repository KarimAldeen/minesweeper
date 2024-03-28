import { CellStatusEnum, GameStateEnum } from "./enums/tile_enum";


class NumberHelper {
    public makeRandomNumber(max: number) {
        return Math.floor(Math.random() * max);
    }
}




export class Game {
    private board: Board ;
    private state: GameStateEnum;

    constructor(boardSize: number, minesNumber: number){
        this.board = new Board(boardSize, minesNumber)
        this.state = GameStateEnum.PLAYING;

    }

    public revealCell(cell:Cell): void {
        

        this.board.revealCell(cell);

        
        if (this.board.isMine(cell)) {
            this.board.getCell().forEach(row => {
                row.forEach(cell => {
                    if (cell.isMine()) {
                        cell.setStatus(CellStatusEnum.MINE);
                    }
                });
            });
            
            this.state = GameStateEnum.LOST;

        } else if (this.board.isAllSafeCellsRevealed()) {
            this.state = GameStateEnum.WON;

        }
    }

    public flagCell(cell:Cell): void {
        if (this.state !== GameStateEnum.PLAYING) return; 

        this.board.flagCell(cell);
    }

    public getState(): GameStateEnum {
        return this.state;
    }
    public getBoard(): Board {
        return this.board;
    }
    public minesLeft(){

    }


}
export class Board {
    private cells: Cell[][]=[];

    constructor(board_size: number, mines_number: number) {
        this.create_board(board_size);
        this.add_random_mine_to_cells(board_size, mines_number);
        this.add_number_of_mines_near_by_to_cell()
    }

    public create_board(board_size: number) {
        this.cells = [];
        for (let x = 0; x < board_size; x++) {
            const row = [];
            for (let y = 0; y < board_size; y++) {
                const cell = new NormalCell(x, y);
                row.push(cell);
            }
            this.cells.push(row);
        }
    }

    public add_random_mine_to_cells(board_size: number, mines_number: number) {
        const helper = new NumberHelper();
        let counter = 0;
        while (mines_number > counter) {
            const x = helper.makeRandomNumber(board_size);
            const y = helper.makeRandomNumber(board_size);
            if (!this.cells[x][y].isMine()) {
                this.cells[x][y] = new MineCell(x, y);
                counter++;
            }
        }
    }
    public isAllSafeCellsRevealed(): boolean {
        console.log(this.cells,"this.cells");

        for (let row of this.cells) {
            for (let cell of row) {


                if (!cell.isMine() && cell.isHidden()) {

                    return false;
                }
            }
        }
        return true;
    }
    public revealCell(cell: Cell): void {
        // Reveal the cell

        if(cell.isMine()){
            return ;
        }
        cell.reveal();
        console.log(cell,"cell");
        
        console.log((cell as NormalCell).getNumberOfNearMines() === 0,"getNumberOfNearMines");
        
    
        // If the cell has no nearby mines, recursively reveal adjacent cells
        if ((cell as NormalCell).getNumberOfNearMines() === 0) {
            const x = cell.getX();
            const y = cell.getY();
    
            // Check all 8 adjacent cells
            for (let near_x = -1; near_x <= 1; near_x++) {
                for (let near_y = -1; near_y <= 1; near_y++) {

                    const newX = x + near_x;
                    const newY = y + near_y;
    
                    // Check if within bounds
                    if (newX >= 0 && newX < this.cells.length &&
                        newY >= 0 && newY < this.cells[newX].length &&
                        !(near_x === 0 && near_y === 0)) {
                        const adjacentCell = this.cells[newX][newY];
                        // If adjacent cell is hidden, reveal it
                        if (adjacentCell.isHidden()) {
                            this.revealCell(adjacentCell);
                        }
                    }
                }
            }
        }
    }
    



    public flagCell(cell:Cell): void {
        cell.toggleFlag();
    }

    public isMine(cell:Cell): any {
        return cell.isMine() ;

    }

    public getCell(): Cell[][] {
        return this.cells;
    }

    public add_number_of_mines_near_by_to_cell(): void {
        for (let x = 0; x < this.cells.length; x++) {
            for (let y = 0; y < this.cells[x].length; y++) {
                if (!this.cells[x][y].isMine()) {
                    let adjacentMines = 0;

                    // Check all 8 adjacent cells
                    for (let near_x = -1; near_x <= 1; near_x++) {
                        for (let near_y = -1; near_y <= 1; near_y++) {
                            const newX = x + near_x;
                            const newY = y + near_y;

                            // Check if within bounds
                            if (newX >= 0 && newX < this.cells.length &&
                                newY >= 0 && newY < this.cells[x].length &&
                                !(near_x === 0 && near_y === 0)) {
                                if (this.cells[newX][newY].isMine()) {
                                    adjacentMines++;
                                }
                            }
                        }
                    }

                        
                    // Set the number of adjacent mines for the cell
                    (this.cells[x][y] as NormalCell).setNumberOfNearMines(adjacentMines);
                }
            }
        }
    }

}

export class Cell {

    constructor(protected x: number, protected y: number,protected status: CellStatusEnum = CellStatusEnum.HIDDEN     ) {}

    
    public getX(): number {
        return this.x;
    }

    public getY(): number {
        return this.y;
    }

    public reveal(): void {
        this.status = CellStatusEnum.REVEALED;
    }

    public isHidden(): boolean {
        return this.status === CellStatusEnum.HIDDEN;
    }

    toggleFlag(): void {
        this.status =
        this.status === CellStatusEnum.FLAGGED
        ? CellStatusEnum.HIDDEN
        : CellStatusEnum.FLAGGED;
    }
    public isMine() :boolean{
            if(this instanceof MineCell ){
                
                return true

            }
            else{
                    return false; 
            }
    }

    getStatus(): CellStatusEnum {
        return this.status;
    }

    setStatus(status: CellStatusEnum): void {
        this.status = status;
    }


}


export class NormalCell extends Cell {
    protected number_of_near_mines :number = 0
    constructor(protected x: number, protected y: number) {
        super(x, y);
        
    }

    public setNumberOfNearMines(number_of_near_mines:number){
        this.number_of_near_mines = number_of_near_mines
    }
    public getNumberOfNearMines(){
        return  this.number_of_near_mines
    }


}

export class MineCell extends Cell {

    constructor( protected x: number, protected y: number) {
        super(x, y); 
        this.status = CellStatusEnum.HIDDEN
    }
}

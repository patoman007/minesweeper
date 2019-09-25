import { Component, Output, EventEmitter } from '@angular/core';
import { TileInterface } from '../tile/tile.interface';
import { BoardManager } from './board.manager';
import { TilesManager } from '../tile/tiles.manager';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent {

  board: TileInterface[][] = [];

  @Output()
  tileFlagged = new EventEmitter<number>();

  @Output()
  gameOver = new EventEmitter();

  @Output()
  boardResolved = new EventEmitter();

  constructor() { }

  private checkIfIsAMine(tile: TileInterface) {
    if (tile.state === 'flagged' || !tile.isAMine) { return; }
    BoardManager.ResolveBoard(this.board);
    this.gameOver.emit();
  }

  private updateBoardState() {
    if (!BoardManager.IsBoardResolved(this.board)) { return; }
    BoardManager.ResolveBoard(this.board);
    this.boardResolved.emit();
  }

  private flagTile(tile: TileInterface) {
    BoardManager.HandleRightClick(this.board, tile);
    this.tileFlagged.emit(BoardManager.GetFlagsCount());
    this.updateBoardState();
  }

  initializateBoard(rows: number, columns: number) {
    this.board = BoardManager.InitializateBoard(rows, columns);
  }

  clickHandler(tile: TileInterface) {
    BoardManager.HandleClick(this.board, tile);
    this.checkIfIsAMine(tile);
    this.updateBoardState();
  }

  rightClickHandler(event: MouseEvent, tile: TileInterface) {
    event.preventDefault();
    this.flagTile(tile);
  }

  longPressHandler(tile: TileInterface) {
    this.flagTile(tile);
  }

}

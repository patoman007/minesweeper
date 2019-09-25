import { Component, ViewChild, AfterViewInit } from '@angular/core';

import { BoardComponent } from '../board/board.component';
import { GameStatusComponent } from './game-status/game-status.component';

import { BoardManager } from '../board/board.manager';
import { GameState } from './game-state.types';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements AfterViewInit {
  
  private rows = 10;
  private columns = 10;

  @ViewChild(GameStatusComponent, { static: false})
  private gameStatus: GameStatusComponent;

  @ViewChild(BoardComponent, { static: false})
  private board: BoardComponent;

  ngAfterViewInit() {
    this.refreshGame();
  }

  private initializateBoard() {
    if (!this.board) { return; }
    this.board.initializateBoard(this.rows, this.columns);
  }

  private initializateGameStatus() {
    if (!this.board || !this.gameStatus) { return; }
    
    this.gameStatus.setFlags(BoardManager.GetFlagsCount());
    this.gameStatus.setState('playing');
  }

  private updateGameStatus(state: GameState) {
    if (!this.gameStatus) { return; }
    this.gameStatus.setState(state);
  }

  private refreshGame() {
    this.initializateBoard();
    this.initializateGameStatus();
  }

  onGameRefreshed() {
    this.refreshGame();
  }

  onTileFlagged(flagsCount: number) {
    if (!this.gameStatus) { return; }
    this.gameStatus.setFlags(flagsCount);
  }

  onBoardResolved() {
    this.updateGameStatus('won');
  }

  onGameOver() {
    this.updateGameStatus('lose');
  }

}

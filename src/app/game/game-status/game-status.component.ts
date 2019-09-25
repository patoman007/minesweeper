import { Component, Output, EventEmitter } from '@angular/core';
import { GameState } from '../game-state.types';

@Component({
  selector: 'app-game-status',
  templateUrl: './game-status.component.html',
  styleUrls: ['./game-status.component.scss']
})
export class GameStatusComponent {

  private timerCounter: number;
  
  gameTime: number = 0;

  labels = {
    flags: '',
    state: ''
  };

  @Output()
  refreshGame = new EventEmitter();

  constructor() { }

  private getStateEmoji(gameState: GameState): string {
    switch (gameState) {
      case 'playing': return'🙂';
      case 'won': return '😎';
      case 'lose': return '😵';
    }
  }

  private startTimeCounter() {
    this.gameTime = 0;
    this.timerCounter = window.setInterval(() => { 
      this.gameTime++;
    }, 1000);
  }

  private stopTimeCounter() {
    if (!this.timerCounter) { return; }
    window.clearTimeout(this.timerCounter);
  }

  setFlags(flagsCount: number) {
    this.labels.flags = `🎌 ${ flagsCount }`;
  }
  
  setState(gameState: GameState) {
    this.labels.state = this.getStateEmoji(gameState);
    if (gameState === 'playing') {
      this.startTimeCounter();
    } else {
      this.stopTimeCounter();
    }
  }

  onRefreshGame() {
    this.refreshGame.emit();
  }

}

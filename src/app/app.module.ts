import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { SharedModule } from './shared/shared.module';

import { GameComponent } from './game/game.component';
import { NavbarComponent } from './game/navbar/navbar.component';
import { GameStatusComponent } from './game/game-status/game-status.component';
import { BoardComponent } from './board/board.component';
import { TileComponent } from './tile/tile.component';

import { GameTimePipe } from './game/game-time.pipe';

const COMPONENTS = [
  GameComponent,
  NavbarComponent,
  GameStatusComponent,
  BoardComponent,
  TileComponent
];

const PIPES = [
  GameTimePipe
];

@NgModule({
  imports: [
    BrowserModule,
    SharedModule
  ],
  declarations: [
    ...COMPONENTS,
    ...PIPES
  ],
  providers: [],
  bootstrap: [GameComponent]
})
export class AppModule { }

import { TileInterface } from './tile.interface';
import { TileState } from './tile-state.type';
import { BoardManager } from 'src/app/board/board.manager';

export class TilesManager {

  private static Icon(tile: TileInterface): string {
    if (tile.state === 'flagged') {
      return '🎌';
    }

    if (tile.state === 'wrong-flag') {
      return '❌';
    }

    if (tile.isAMine) {
      return '💣';
    }

    switch (tile.value) {
      case 0: return '';
      case 1: return '1️⃣';
      case 2: return '2️⃣';
      case 3: return '3️⃣';
      case 4: return '4️⃣';
      case 5: return '5️⃣';
      case 6: return '6️⃣';
      case 7: return '7️⃣';
      case 8: return '8️⃣';
      default: return '';
    }
  }

  private static SetState(tile: TileInterface, state: TileState) {
    tile.state = state;
    tile.icon = TilesManager.Icon(tile);
  }

  private static ShouldUncoverIt(tile: TileInterface) {
    return tile && tile.state && tile.state === 'covered';
  }

  private static ShouldFlagIt(tile: TileInterface) {
    return tile 
      && tile.state 
      && tile.state === 'covered' 
      && BoardManager.IsThereAnAvailableFlag();
  }

  private static ShouldUnflagIt(tile: TileInterface) {
    return tile && tile.state && tile.state === 'flagged';
  }

  private static HandleZeroTile(tile: TileInterface) {
    
  }

  private static FlagIt(tile: TileInterface) {
    TilesManager.SetState(tile, 'flagged');
    BoardManager.UseAFlag();
  }

  private static UnFlagIt(tile: TileInterface) {
    TilesManager.SetState(tile, 'covered');
    BoardManager.ReturnAFlag();
  }

  private static Rand(min: number, max: number): number {
    const rand = Math.floor(Math.random() * (max - min + 1));
    return  rand + min;
  }

  public static Tile(row: number,
                     column: number,
                     state: TileState, 
                     isAMine: boolean, 
                     value?: number): TileInterface {
    const tile = { row, column, state, isAMine, icon: '', value };
    tile.icon = TilesManager.Icon(tile);
    return tile;
  }

  public static SetValue(tile: TileInterface, value: number) {
    tile.value = value;
    tile.icon = TilesManager.Icon(tile);
  }

  public static GetTileCovered(row: number, column: number): TileInterface {
    return TilesManager.Tile(row, column, 'covered', false, 0);
  }

  public static UncoverIt(tile: TileInterface) {
    TilesManager.SetState(tile, 'uncovered');
  }

  public static ResolveIt(tile: TileInterface) {
    if (tile.state === 'flagged' && !tile.isAMine) {
      TilesManager.SetState(tile, 'wrong-flag');
      return
    }

    if (tile.state === 'flagged' && tile.isAMine) {
      return;
    }

    TilesManager.UncoverIt(tile);
  }

  public static HandleClick(tile: TileInterface) {
    if (!TilesManager.ShouldUncoverIt(tile)) { return; }
    TilesManager.UncoverIt(tile);
  }

  public static HandleRightClick(tile: TileInterface) {
    if (TilesManager.ShouldFlagIt(tile)) {
      TilesManager.FlagIt(tile);
      return;
    }

    if (TilesManager.ShouldUnflagIt(tile)) {
      TilesManager.UnFlagIt(tile);
      return;
    }
  }

  static GetScale(): number {
    return TilesManager.Rand(0.79, 0.89);
  }

  static GetSkew(): number {
    return TilesManager.Rand(-5, 5);
  }

  static GetZRotation(): number {
    return TilesManager.Rand(-5, 5);
  }

  static GetVelocity(): number {
    return TilesManager.Rand(60, 40);
  }

  static GetTheta(): number {
    const angle = TilesManager.Rand(110, 115);
    return (angle * Math.PI) / 180;
  }

  static GetHorizontalDirection(): number {
    const directions = [1, -1, 0];
    const randDirection = Math.floor(Math.random() * directions.length);
    return directions[randDirection];
  }

}

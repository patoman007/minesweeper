import { TileInterface } from '../tile/tile.interface';
import { TilesManager } from '../tile/tiles.manager';
import { NumberUtils } from '../utils/number.utils';

export class BoardManager {

  private static MinesCount: number;
  private static FlagsCount: number;

  private static NewColumn(row: number, length: number) {
    return new Array(length)
      .fill({})
      .map((_, column) => TilesManager.GetTileCovered(row, column));
  }

  private static InitializateTiles(board: TileInterface[][], 
                                   rows: number, 
                                   columns: number) {
    for(let i = 0; i < rows; i++) {
      const column = BoardManager.NewColumn(i, columns);
      board.push(column);
    }
  }

  private static CalculateMinesCount(rows: number, columns: number): number {
    const tiles = rows * columns;
    const divisor = 8;
    const division = Math.floor(tiles / divisor);
    const remainder = tiles % divisor;
    return division + remainder + Math.floor(divisor / 2);
  }

  private static FitMinesIntoBoard(board: TileInterface[][], 
                                   rows: number, 
                                   columns: number,
                                   minesCount: number) {
    let minesMined = 0;
    while(minesMined < minesCount) {
      const rndRow = NumberUtils.Random(rows - 1);
      const rndColumn = NumberUtils.Random(columns - 1);
      const rndTile = board[rndRow][rndColumn];
      if (rndTile.isAMine) {
        continue;
      }
      rndTile.isAMine = true;
      minesMined++;
    }
  }

  private static initializateMines(board: TileInterface[][], 
                                   rows: number, 
                                   columns: number) {
    const minesCount = BoardManager.CalculateMinesCount(rows, columns);
    BoardManager.MinesCount = minesCount;
    BoardManager.FlagsCount = minesCount;
    BoardManager.FitMinesIntoBoard(board, rows, columns, minesCount);
  }

  private static GetSlicedRow(board: TileInterface[][], 
                              row: number, 
                              column: number): TileInterface[] {
    const maxColumn = board[0].length;
    const startColumn = column > 0 ? column - 1 : column;
    const endColumn = column < maxColumn ? column + 1 : column;
    return board[row].slice(startColumn, endColumn + 1);
  }

  private static GetPreviousRow(board: TileInterface[][], 
                                row: number, 
                                column: number): TileInterface[] {
    return row > 0 ? BoardManager.GetSlicedRow(board, row-1, column) : [];
  }

  private static GetCurrentRow(board: TileInterface[][], 
                               row: number, 
                               column: number): TileInterface[] {
    return BoardManager.GetSlicedRow(board, row, column);
  }

  private static GetNextRow(board: TileInterface[][], 
                            row: number, 
                            column: number): TileInterface[] {
    const maxRows = board[0].length - 1;
    return row < maxRows ? BoardManager.GetSlicedRow(board, row+1, column) : [];
  }

  private static GetNearestMinesCount(board: TileInterface[][], 
                                      row: number, 
                                      column: number): number {
    const previousRow = BoardManager.GetPreviousRow(board, row, column);
    const currentRow = BoardManager.GetCurrentRow(board, row, column);
    const nextRow = BoardManager.GetNextRow(board, row, column);

    return [...previousRow, ...currentRow, ...nextRow]
      .filter(tile => tile.isAMine)
      .length;
  }

  private static InitializateTileValues(board: TileInterface[][], 
                                        rows: number, 
                                        columns: number) {
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
        const tile = board[i][j];
        const value = BoardManager.GetNearestMinesCount(board, i, j);
        TilesManager.SetValue(tile, value);
      }
    }
  }

  private static HandleTileZero(board: TileInterface[][], tile: TileInterface) {
    if (tile.value !== 0) { return; }

    const row = tile.row;
    const column = tile.column;
    const previousRow = BoardManager.GetPreviousRow(board, row, column);
    const currentRow = BoardManager.GetCurrentRow(board, row, column);
    const nextRow = BoardManager.GetNextRow(board, row, column);
    const nearestTiles = [...previousRow, ...currentRow, ...nextRow];
    nearestTiles.forEach(tile => {
      if (!tile.isAMine && tile.state === 'covered') { 
        TilesManager.UncoverIt(tile);
        BoardManager.HandleTileZero(board, tile);
      }
    });
  }

  private static IsRowResolved(row: TileInterface[]): boolean {
    return row.reduce((result, tile) => {
      const isTileResolved = tile.isAMine 
        ? tile.state === 'covered' || tile.state === 'flagged'
        : tile.state === 'uncovered';
      return result && isTileResolved;
    }, true);
  }

  public static GetFlagsCount(): number {
    return BoardManager.FlagsCount;
  }

  public static InitializateBoard(rows: number, 
                                  columns: number): TileInterface[][] {
    const board: TileInterface[][] = [];
    BoardManager.InitializateTiles(board, rows, columns);
    BoardManager.initializateMines(board, rows, columns);
    BoardManager.InitializateTileValues(board, rows, columns);
    return board;
  }

  public static HandleClick(board: TileInterface[][], tile: TileInterface) {
    this.HandleTileZero(board, tile);    
  }

  public static HandleRightClick(board: TileInterface[][], 
                                 tile: TileInterface) {
    TilesManager.HandleRightClick(tile);

  }

  public static IsThereAnAvailableFlag(): boolean {
    return BoardManager.FlagsCount > 0;
  }

  public static UseAFlag() {
    if (!BoardManager.IsThereAnAvailableFlag()) { return; }
    BoardManager.FlagsCount--;
  }

  public static ReturnAFlag() {
    if (BoardManager.FlagsCount === BoardManager.MinesCount) { return; }
    BoardManager.FlagsCount++;
  }

  public static IsBoardResolved(board: TileInterface[][]): boolean {
    return board.reduce((result, row) => {
      return result && BoardManager.IsRowResolved(row);
    }, true);
  }

  public static ResolveBoard(board: TileInterface[][]) {
    board.forEach(row => {
      row.forEach(tile => TilesManager.ResolveIt(tile));
    });
  }

}

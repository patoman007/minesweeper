import { TileState } from './tile-state.type';

export interface TileInterface {
  row: number;
  column: number;
  state: TileState;
  isAMine: boolean;
  icon: string;
  value?: number;
}

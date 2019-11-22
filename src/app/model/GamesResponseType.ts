import { Game } from './Game';

export interface GamesResponseType {
  _embedded: Embedded;
}
export interface Embedded {
  gameDTOList: Game[];
}

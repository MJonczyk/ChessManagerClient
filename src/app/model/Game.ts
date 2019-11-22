export class Game {
  id: number;
  event: string;
  site: string;
  white: string;
  black: string;
  result: string;
  chessOpening: string;
  date: string;
  round: string;
  moves: string;
  whiteElo: number;
  blackElo: number;

  constructor() {
    this.id = -1;
    this.event = '';
    this.site = '';
    this.white = '';
    this.black = '';
    this.result = '';
    this.chessOpening = '';
    this.date = '';
    this.round = '';
    this.moves = '';
    this.whiteElo = -1;
    this.blackElo = -1;
  }
}

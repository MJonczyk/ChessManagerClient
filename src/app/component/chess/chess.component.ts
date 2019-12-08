import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import * as Chess from 'chess.js';
import Move = ChessJS.Move;

declare var ChessBoard: any;

@Component({
  selector: 'app-chess',
  templateUrl: './chess.component.html',
  styleUrls: ['./chess.component.css']
})
export class ChessComponent implements OnInit, OnChanges {

  @Input() public game;
  private board: ChessBoardInstance;
  private gameEngine: ChessInstance;
  private moves: string[];
  private currentMoveIndex: number;

  static parseMoveForward(move: Move) {
    return move.from + '-' + move.to;
  }

  static parseMoveBackward(move: Move) {
    return move.to + '-' + move.from;
  }

  constructor() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.gameEngine.reset();
    this.board.start();
    console.log(this.moves);
    this.moves = this.game.moves.split(' ');
    console.log(this.moves);
    for (let i = 0; i < this.moves.length; i++) {
      if (this.moves[i].includes('.')) {
        this.moves[i] = this.moves[i].substring(this.moves[i].indexOf('.') + 1);
      }
    }
    console.log(this.moves);
    this.moves.splice(this.moves.length - 1);
    console.log(this.moves);
    this.currentMoveIndex = 0;
  }

  ngOnInit() {
    this.gameEngine = new Chess();
    this.board = this.initBoard();
  }

  initBoard(): ChessBoardInstance {
    const game = this.gameEngine;

    const onDragStartFunc = (source: string, piece: string): boolean => {
      if (game.game_over()) {
        return false;
      }

      if ((game.turn() === 'w' && piece.search(/^b/) !== -1) ||
        (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
        return false;
      }
    };

    const onDropFunc = async (source: string, target: string): Promise<string> => {
      // see if the move is legal
      const move = game.move({
        from: source,
        to: target,
        promotion: 'q' // NOTE: always promote to a queen for example simplicity
      });

      // illegal move
      if (move === null) {
        return 'snapback';
      }

      updateStatus();
    };

    const onSnapEndFunc = () => {
      return this.board.position(game.fen());
    };

    const updateStatus = () => {
      let status = '';

      let moveColor = 'White';
      if (game.turn() === 'b') {
        moveColor = 'Black';
      }

      // checkmate?
      if (game.in_checkmate()) {
        status = 'Game over, ' + moveColor + ' is in checkmate.';
      } else if (game.in_draw()) {
        status = 'Game over, drawn position';
      } else {
        status = moveColor + ' to move';

        // check?
        if (game.in_check()) {
          status += ', ' + moveColor + ' is in check';
        }
      }
    };

    const boardConfig: ChessBoardJS.BoardConfig = {
      draggable: false,
      position: 'start',
      onDragStart: onDragStartFunc,
      onDrop: onDropFunc,
      onSnapEnd: onSnapEndFunc
    };

    const board = ChessBoard('board', boardConfig);
    return board;
  }

  clear() {
    this.gameEngine.reset();
    this.board.start();
    this.currentMoveIndex = 0;
  }

  undo() {
    this.gameEngine.undo();
    this.board.position(this.gameEngine.fen());
    if (this.currentMoveIndex !== 0) {
      this.currentMoveIndex--;
    }
  }

  nextMove() {
    this.gameEngine.move(this.moves[this.currentMoveIndex]);
    this.board.position(this.gameEngine.fen());
    if (this.currentMoveIndex !== this.moves.length - 1) {
      this.currentMoveIndex++;
    }
  }

  playPGN() {
    console.log(this.gameEngine.load_pgn(this.game.moves));
    this.board.position(this.gameEngine.fen());
    this.currentMoveIndex = this.moves.length - 1;
  }

}

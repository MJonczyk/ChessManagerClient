import {Component, Input, OnInit} from '@angular/core';
import * as Chess from 'chess.js';

declare var ChessBoard: any;

@Component({
  selector: 'app-chess',
  templateUrl: './chess.component.html',
  styleUrls: ['./chess.component.css']
})
export class ChessComponent implements OnInit {
  @Input() public game;
  private board: ChessBoardInstance;
  private gameEngine: ChessInstance;

  constructor() { }

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
      draggable: true,
      position: 'start',
      onDragStart: onDragStartFunc,
      onDrop: onDropFunc,
      onSnapEnd: onSnapEndFunc
    };

    const board = ChessBoard('board', boardConfig);
    return board;
  }

}

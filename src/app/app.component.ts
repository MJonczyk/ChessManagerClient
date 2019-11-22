import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'chessmanager-client';
  currentGame = null;

  public handleSelectedGame(selectedGame) {
    this.currentGame = selectedGame;
  }
}

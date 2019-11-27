import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Game} from '../model/Game';
import {Observable, of} from 'rxjs';
import {GamesResponseType} from '../model/GamesResponseType';
import {catchError, map} from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class GameService {
  private gameUrl = 'http://localhost:8080/games';
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json'})
  };

  constructor(private http: HttpClient) { }

  getGames(): Observable<Game[]> {
    return this.http.get<GamesResponseType>(this.gameUrl)
      .pipe(
        map(response => response._embedded.gameDTOList),
        catchError(this.handleError<Game[]>('getGames')),
      );
  }

  getGame(id: number): Observable<Game> {
    const url = `${this.gameUrl}/${id}`;
    return this.http.get<Game>(url)
      .pipe(
        catchError(this.handleError<Game>('getGame')),
      );
  }

  deleteGame(game: Game | number): Observable<Game> {
    const id = typeof game === 'number' ? game : game.id;
    const url = `${this.gameUrl}/${id}`;
    return this.http.delete<Game>(url, this.httpOptions)
      .pipe(
        catchError(this.handleError<Game>('deleteGame')),
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }

}

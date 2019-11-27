import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {BehaviorSubject, Observable} from 'rxjs';
import {Token} from '../model/Token';
import {Router} from '@angular/router';

const url = 'http://localhost:8080';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  public token: string;
  public isLoggedIn = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient, private router: Router) {
    this.token = null;
  }

  public login(username, password): Observable<Token> {
    return this.http.post<Token>(`${url}/login`, {username, password})
      .pipe(
        map(token => {
          console.log(token);
          return token;
        })
      );
  }

  public logout() {
    this.token = null;
    this.isLoggedIn.next(false);
    this.router.navigate(['/login']);
  }

  public getToken(): string {
    // return localStorage.getItem('token');
    return this.token;
  }

  public getIsLoggedIn() {
    return this.isLoggedIn.asObservable();
  }

  // public isAuthenticated(): boolean {
  //   const token = this.getToken();
  //   return tokenNotExpired(token);
  // }
}

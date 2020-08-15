import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { MessageService } from './message.service';
import { Player } from './player';
import { PLAYERS } from './mock-heroes';


@Injectable({
  providedIn: 'root'
})
export class PlayerService {


  private playersUrl = 'http://localhost:5000/players'; 
  private playerUrl_id = 'http://localhost:5000/player-id';
  private playerUrl_name = 'http://localhost:5000/player-name';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient,private messageService: MessageService) { }


    /** GET players from the server */
    getPlayers(): Observable<Player[]> {
      return this.http.get<Player[]>(this.playersUrl)
        .pipe(
          tap(_ => this.log('fetched players')),
          catchError(this.handleError<Player[]>('getPlayers', []))
        );
    }

   /** GET player by id. Will 404 if id not found */
    getPlayer(id: number): Observable<Player> {
       const url = `${this.playerUrl_id}/${id}`;
       return this.http.get<Player>(url)
        .pipe(
           tap(_ => this.log(`fetched player id=${id}`)),
           catchError(this.handleError<Player>(`getPlayer id=${id}`))
     );
    }

  /** PUT: update the player on the server */
   updatePlayer(player: Player | number): Observable<any> {

    const id = typeof player === 'number' ? player : player.id;
    const url = `${this.playerUrl_id}/${id}`;

    return this.http.put(url, player, this.httpOptions).pipe(
     tap(_ => this.log(`updated player id=${id}`)),
     catchError(this.handleError<any>('updatePlayer'))
   );
  }

  /** POST: add a new hero to the server */
   addPlayer(player: Player): Observable<Player> {
    return this.http.post<Player>(this.playersUrl, player, this.httpOptions)
    .pipe(
     tap((newPlayer: Player) => this.log(`added player w/ id=${newPlayer.id}`)),
     catchError(this.handleError<Player>('addPlayer'))
  );
}



/** DELETE: delete the hero from the server */
  deleteHero(player: Player | number): Observable<Player> {
  const id = typeof player === 'number' ? player : player.id;
  const url = `${this.playerUrl_id}/${id}`;

  return this.http.delete<Player>(url, this.httpOptions)
  .pipe(
    tap(_ => this.log(`deleted player id=${id}`)),
    catchError(this.handleError<Player>('deletePlayer'))
  );
}


 /** GET player by name. Will 404 if id not found */
 searchPlayers (name: string): Observable<Player> {
  const url = `${this.playerUrl_name}/${name}`;
  return this.http.get<Player>(url)
   .pipe(
      tap(_ => this.log(`fetched player id=${name}`)),
      catchError(this.handleError<Player>(`getPlayer id=${name}`))
);
}


/* GET heroes whose name contains search term 
searchPlayers(term: string): Observable<Player[]> {
  if (!term.trim()) {
    // if not search term, return empty hero array.
    return of([]);
  }
  return this.http.get<Player[]>(`${this.playerUrl_name}/${term}`)
  .pipe(
    tap(x => x.length ?
       this.log(`found heroes matching "${term}"`) :
       this.log(`no heroes matching "${term}"`)),
    catchError(this.handleError<Player[]>('searchHeroes', []))
  );
}
*/


    /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

 /** Log a HeroService message with the MessageService */
 private log(message: string) {
  this.messageService.add(`PlayerService: ${message}`);
}

}

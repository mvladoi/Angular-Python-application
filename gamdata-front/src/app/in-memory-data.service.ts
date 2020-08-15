import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Player } from './player';

@Injectable({
  providedIn: 'root',
})
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const players = [
      { id: 11, name: 'Dr Nice', score:121},
      { id: 12, name: 'Narco', score:123},
      { id: 13, name: 'Bombasto', score:130},
      { id: 14, name: 'Celeritas', score:140},
      { id: 15, name: 'Magneta', score:150},
      { id: 16, name: 'RubberMan', score:160},
      { id: 17, name: 'Dynama', score:170},
      { id: 18, name: 'Dr IQ', score:180},
      { id: 19, name: 'Magma', score:190},
      { id: 20, name: 'Tornado', score:140}
    ];
    return {players};
  }

  // Overrides the genId method to ensure that a hero always has an id.
  // If the heroes array is empty,
  // the method below returns the initial number (11).
  // if the heroes array is not empty, the method below returns the highest
  // hero id + 1.
  genId(players: Player[]): number {
    return players.length > 0 ? Math.max(...players.map(player => player.id)) + 1 : 11;
  }
}

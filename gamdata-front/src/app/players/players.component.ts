import { Component, OnInit } from '@angular/core';
import {Chart} from '../../../node_modules/chart.js';

import { Player } from '../player';
import { PlayerService } from '../player.service';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.css']
})
export class PlayersComponent implements OnInit {

  
  players: Player[];

  constructor(private playerService: PlayerService) { }

  ngOnInit(): void {
      this.getPlayers();

      
  }

getPlayers(): void {
  this.playerService.getPlayers()
      .subscribe(players => 
        {
          this.players = players

          let labels =[];
          let data = [];

          for (let entry of players){
            labels.push(entry.name);
             data.push(entry.score);
          } 
        
          var myChart = new Chart("myChart", {
            type: 'bar',
            data: {
                
                labels: labels,
                datasets: [{
                    label: '# of points',
                    data: data,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)',
                        'rgba(255, 150, 64, 0.2)',
                        'rgba(155, 155, 64, 0.2)',
                        'rgba(255, 149, 64, 0.2)',
                        'rgba(115, 139, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)',
                        'rgba(255, 150, 64, 1)',
                        'rgba(155, 155, 64, 1)',
                        'rgba(255, 149, 64, 1)',
                        'rgba(115, 139, 64, 1)'
              
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });     
        
        });
}

add(name: string, score: number): void {
  name = name.trim();
  if (!name) { return; }
  this.playerService.addPlayer({ name, score } as Player)
    .subscribe(player => {
      this.players.push(player);
    });
}


delete(player: Player): void {
  this.players = this.players.filter(h => h !== player);
  this.playerService.deleteHero(player).subscribe();
}


}

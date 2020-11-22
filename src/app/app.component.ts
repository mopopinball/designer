import { Component, OnInit } from '@angular/core';
import { RuleComponent } from './rule/rule.component';
import {RuleEngine} from '@mopopinball/engine/src/system/rule-engine/rule-engine';
import hardware from '@mopopinball/engine/src/games/mars/hardware-config.json';
import { GameService } from './game.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'designer';
  root: RuleEngine;
  hardwareConfig: unknown;

  constructor(private gameService: GameService) {

  }

  ngOnInit() {
    this.hardwareConfig = hardware;
    this.root = RuleEngine.load(JSON.parse(localStorage.getItem('mopo')));
    this.root.start();
    this.gameService.setRoot(this.root);
    this.test();
  }

  new(): void {
    this.hardwareConfig = hardware;
    this.root = new RuleEngine('root', true);
    this.root.start();
    this.gameService.setRoot(this.root);
  }

  save(): void {
    localStorage.setItem('mopo', JSON.stringify(this.root));
  }

  test() {
    console.log(this.root.getDevices());
    this.gameService.update();
  }
}

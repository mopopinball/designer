import { Component, Input, OnInit } from '@angular/core';
import { Action } from '@mopopinball/engine/src/system/rule-engine/actions/action';
import { NamedTriggerAction } from '@mopopinball/engine/src/system/rule-engine/actions/named-trigger-action';
import { ActionTriggerType } from '@mopopinball/engine/src/system/rule-engine/actions/trigger';
import { GameService } from '../game.service';

@Component({
  selector: 'named-action',
  templateUrl: './named-action.component.html',
  styleUrls: ['./named-action.component.scss']
})
export class NamedActionComponent implements OnInit {
  @Input()trigger: ActionTriggerType;
  @Input()action: NamedTriggerAction;

  constructor(private gameService: GameService) { }

  ngOnInit(): void {
  }

  onChange(): void {
    this.gameService.update();
  }

}

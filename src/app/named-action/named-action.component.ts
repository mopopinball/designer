import { Component, Input, OnInit } from '@angular/core';
import { NamedTriggerAction } from '@mopopinball/engine/src/system/rule-engine/actions/named-trigger-action';
import { TimedActionStep } from '@mopopinball/engine/src/system/rule-engine/actions/timed-action';
import { TriggerType } from '@mopopinball/engine/src/system/rule-engine/actions/trigger';
import { RuleEngine } from '@mopopinball/engine/src/system/rule-engine/rule-engine';
import { GameService } from '../game.service';

@Component({
  selector: 'named-action',
  templateUrl: './named-action.component.html',
  styleUrls: ['./named-action.component.scss']
})
export class NamedActionComponent implements OnInit {
  @Input() parent: TriggerType | TimedActionStep;
  @Input()action: NamedTriggerAction;
  @Input()ruleEngine: RuleEngine;

  constructor(private gameService: GameService) { }

  ngOnInit(): void {
  }

  onChange(): void {
    this.gameService.update();
  }

  doesTriggerExist(triggerId: string): boolean {
    return this.gameService.doesTriggerExist(triggerId, this.ruleEngine);
  }

}

import { v4 as uuidv4 } from 'uuid';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ConditionalAction } from '@mopopinball/engine/src/system/rule-engine/actions/conditional-action';
import { DataAction } from '@mopopinball/engine/src/system/rule-engine/actions/data-action';
import { DeviceAction } from '@mopopinball/engine/src/system/rule-engine/actions/device-action';
import { NamedTriggerAction } from '@mopopinball/engine/src/system/rule-engine/actions/named-trigger-action';
import { RandomAction } from '@mopopinball/engine/src/system/rule-engine/actions/random-action';
import { StateAction } from '@mopopinball/engine/src/system/rule-engine/actions/state-action';
import { TimedAction, TimedActionStep } from '@mopopinball/engine/src/system/rule-engine/actions/timed-action';
import { TriggerType } from '@mopopinball/engine/src/system/rule-engine/actions/trigger';
import { DesiredOutputState } from '@mopopinball/engine/src/system/rule-engine/desired-output-state';
import { GameService } from '../game.service';
import { MatMenu } from '@angular/material/menu';

@Component({
  selector: 'action-menu',
  templateUrl: './action-menu.component.html',
  styleUrls: ['./action-menu.component.scss']
})
export class ActionMenuComponent implements OnInit {

  @Input() actionParent: TriggerType | TimedActionStep;
  // @ViewChild('addactionmenu', {static: true}) menu: MatMenu;
  constructor(private gameService: GameService) { }

  ngOnInit(): void {
  }

  addDataAction(): void {
    const newAction = new DataAction('', null, null, '');
    this.actionParent.actions.push(newAction);
    this.gameService.update();
  }

  addConditionalAction(): void {
    const newAction = new ConditionalAction([], {});
    this.actionParent.actions.push(newAction);
    this.gameService.update();
  }

  addStateAction(): void {
    const newAction = new StateAction('', '');
    this.actionParent.actions.push(newAction);
    this.gameService.update();
  }

  addDeviceAction(): void {
    const newAction = new DeviceAction(new DesiredOutputState('', null, null));
    this.actionParent.actions.push(newAction);
    this.gameService.update();
  }

  addNamedAction(): void {
    const newAction = new NamedTriggerAction('');
    this.actionParent.actions.push(newAction);
    this.gameService.update();
  }

  addRandomAction(): void {
    const newAction = new RandomAction([]);
    this.actionParent.actions.push(newAction);
    this.gameService.update();
  }

  addTimedAction(): void {
    const newAction = new TimedAction(uuidv4(), []);
    this.actionParent.actions.push(newAction);
    this.gameService.update();
  }

}

import { Component, Input, OnInit } from '@angular/core';
import { Action } from '@mopopinball/engine/src/system/rule-engine/actions/action';
import { ConditionalAction } from '@mopopinball/engine/src/system/rule-engine/actions/conditional-action';
import { DataAction } from '@mopopinball/engine/src/system/rule-engine/actions/data-action';
import { DeviceAction } from '@mopopinball/engine/src/system/rule-engine/actions/device-action';
import { RandomAction } from '@mopopinball/engine/src/system/rule-engine/actions/random-action';
import { StateAction } from '@mopopinball/engine/src/system/rule-engine/actions/state-action';
import { TimedAction, TimedActionStep } from '@mopopinball/engine/src/system/rule-engine/actions/timed-action';
import { TriggerType } from '@mopopinball/engine/src/system/rule-engine/actions/trigger';
import { RuleEngine } from '@mopopinball/engine/src/system/rule-engine/rule-engine';
import { GameService } from 'src/app/game.service';

@Component({
  selector: 'action-list',
  templateUrl: './action-list.component.html',
  styleUrls: ['./action-list.component.scss']
})
export class ActionListComponent implements OnInit {
  @Input() actions: Action[];
  @Input() ruleEngine: RuleEngine;
  @Input() parent: TriggerType | TimedActionStep;
  constructor(private gameService: GameService) { }

  ngOnInit(): void {
  }

  addTimedStep(action: TimedAction): void {
    action.steps.push({intervalMs: 0, actions: []})
    this.gameService.update();
  }

  doesTriggerExist(triggerId: string): boolean {
    return this.gameService.doesTriggerExist(triggerId, this.ruleEngine);
  }

  doesEngineExist(targetId: string, action: StateAction): boolean {
    if (!targetId) {
      return true;
    }
    else {
      return this.ruleEngine.id == targetId || action.doesEngineExist(targetId);
    }
  }

  getActionTitle(action: Action): string {
    if (action instanceof StateAction) {
      if (!action.stopTargetId && action.startTargetId) {
        return 'Start State Action';
      }
      if (action.stopTargetId && !action.startTargetId) {
        return 'Stop State Action';
      }
      if (action.stopTargetId && action.startTargetId) {
        return 'State Action';
      }
    }
    else if (action instanceof DeviceAction) {
      return 'Device Action';
    }
    else if (action instanceof DataAction) {
      return action.expression === undefined ? 'Data Action (Deprecated)' : 'Data Action';
    }
    else if (action instanceof RandomAction) {
      return 'Random Action';
    }
    else if (action instanceof ConditionalAction) {
      return 'Conditional Action';
    }
    else if (action instanceof TimedAction) {
      return 'Timed Action';
    }

    return 'Unknown Action'
  }

  updateTimedActionStepInterval(action: TimedAction): void {
    action.steps.sort((a, b) => a.intervalMs > b.intervalMs ? 1 : -1);
    this.gameService.update()
  }

}

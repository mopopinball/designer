import { Component, Input, OnInit } from '@angular/core';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDialog, throwMatDialogContentAlreadyAttachedError } from '@angular/material/dialog';
import { ConditionalAction } from '@mopopinball/engine/src/system/rule-engine/actions/conditional-action';
import { DataAction } from '@mopopinball/engine/src/system/rule-engine/actions/data-action';
import { DeviceAction } from '@mopopinball/engine/src/system/rule-engine/actions/device-action';
import { RandomAction, RandomActionCandidate } from '@mopopinball/engine/src/system/rule-engine/actions/random-action';
import { IdTrigger } from '@mopopinball/engine/src/system/rule-engine/actions/id-trigger';
import { NamedTriggerAction } from '@mopopinball/engine/src/system/rule-engine/actions/named-trigger-action';
import { StateAction } from '@mopopinball/engine/src/system/rule-engine/actions/state-action';
import { SwitchTrigger } from '@mopopinball/engine/src/system/rule-engine/actions/switch-trigger';
import { TimerTrigger } from '@mopopinball/engine/src/system/rule-engine/actions/timer-trigger';
import { ActionTriggerType, Trigger } from '@mopopinball/engine/src/system/rule-engine/actions/trigger';
import { DesiredOutputState } from '@mopopinball/engine/src/system/rule-engine/desired-output-state';
import { RuleEngine } from '@mopopinball/engine/src/system/rule-engine/rule-engine';
import { TimerTriggerMode, TriggerType } from '@mopopinball/engine/src/system/rule-engine/schema/triggers.schema';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { GameService } from '../game.service';
import { Condition, ConditionClause, DataCondition, SwitchCondition } from '@mopopinball/engine/src/system/rule-engine/actions/condition-clause';
import { Action } from '@mopopinball/engine/src/system/rule-engine/actions/action';

@Component({
  selector: 'trigger',
  templateUrl: './trigger.component.html',
  styleUrls: ['./trigger.component.scss']
})
export class TriggerComponent implements OnInit {
  TimerActionTriggerMode: typeof TimerTriggerMode = TimerTriggerMode;
  @Input() ruleEngine: RuleEngine;
  @Input() trigger: ActionTriggerType;

  constructor(private gameService: GameService, public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  activateTrigger(trigger: SwitchTrigger | IdTrigger | TimerTrigger): void {
    if (!this.ruleEngine.active) {
      return;
    }
    if (trigger.type === TriggerType.SWITCH) {
      this.gameService.onSwitch(trigger.switchId, trigger.holdIntervalMs);
    } else if (trigger.type === TriggerType.ID || trigger.type === TriggerType.TIMER) {
      this.gameService.onTrigger(trigger.id);
    }
    this.gameService.update();
  }

  moveUp(trigger): void {
    const currentPosition = this.ruleEngine.triggers.indexOf(trigger);
    this.ruleEngine.triggers.splice(currentPosition, 1);
    this.ruleEngine.triggers.splice(currentPosition - 1, 0, trigger);
    this.gameService.update();
  }

  moveDown(trigger): void {
    const currentPosition = this.ruleEngine.triggers.indexOf(trigger);
    this.ruleEngine.triggers.splice(currentPosition, 1);
    this.ruleEngine.triggers.splice(currentPosition + 1, 0, trigger);
    this.gameService.update();
  }

  addConditionalAction(trigger: ActionTriggerType): void {
    const newAction = new ConditionalAction([], {});
    trigger.actions.push(newAction);
    this.gameService.update();
  }

  addDataAction(trigger: ActionTriggerType): void {
    const newAction = new DataAction('', null, null, '');
    trigger.actions.push(newAction);
    this.gameService.update();
  }

  addStateAction(trigger: ActionTriggerType): void {
    const newAction = new StateAction('', '');
    trigger.actions.push(newAction);
    this.gameService.update();
  }

  addDeviceAction(trigger: ActionTriggerType): void {
    const newAction = new DeviceAction(new DesiredOutputState('', null, null));
    trigger.actions.push(newAction);
    this.gameService.update();
  }

  addNamedAction(trigger: ActionTriggerType): void {
    const newAction = new NamedTriggerAction('');
    trigger.actions.push(newAction);
    this.gameService.update();
  }

  addRandomAction(trigger: ActionTriggerType): void {
    const newAction = new RandomAction([]);
    trigger.actions.push(newAction);
    this.gameService.update();
  }

  deleteTrigger(trigger): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        action: 'Delete',
        prompt: `Are you sure you want to delete the trigger "${trigger.id}"?`
      }
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.ruleEngine.triggers.splice(this.ruleEngine.triggers.indexOf(trigger), 1);
        this.gameService.update();
      }
    });
  }

  onSwitchTriggerHoldTimeChange(trigger: SwitchTrigger): void {
    if (!trigger.holdIntervalMs) {
      trigger.holdIntervalMs = null;
    }
    this.gameService.update();
  }

  addClause(action): void {
    const clause: ConditionClause = new ConditionClause([], {});
    action.clauses.push(clause);
    this.gameService.update();
  }

  removeClause(action, clause): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        action: 'Delete',
        prompt: `Are you sure you want to delete this clause?`
      }
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        action.clauses.splice(action.clauses.indexOf(clause), 1);
        this.gameService.update();
      }
    });
  }

  addDataCondition(clause): void {
    const dataCondition: DataCondition = {
      conditionType: 'data',
      expression: ''
    };
    clause.conditions.push(dataCondition);
    this.gameService.update();
  }

  addRandomId(action: RandomAction): void {
    const randomCandidate: RandomActionCandidate = {
      clause: new ConditionClause([], {
        triggerId: null
      }),
      weight: 0
    };
    action.candidates.push(randomCandidate);
    this.gameService.update();
  }

  deleteCandidate(action: RandomAction, candidate: RandomActionCandidate): void {
    action.candidates.splice(action.candidates.indexOf(candidate), 1);
    this.gameService.update();
  }

  addSwitchCondition(clause): void {
    const swCondition: SwitchCondition = {
      activated: true,
      switchId: '',
      conditionType: 'switch'
    };
    clause.conditions.push(swCondition);
    this.gameService.update();
  }

  deleteCondition(clause, condition: Condition): void {
    clause.conditions.splice(clause.conditions.indexOf(condition), 1);
    this.gameService.update();
  }

  setTimerMode(trigger: TimerTrigger, checked: boolean): void {
    if (checked) {
      trigger.mode = TimerTriggerMode.INTERVAL;
    } else {
      trigger.mode = TimerTriggerMode.TIMEOUT;
    }
    this.gameService.update();
  }

  onSwitchConditionChanged(condition: SwitchCondition, switchId: string): void {
    condition.switchId = switchId;
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

  copyClause(action: ConditionalAction, clause: ConditionClause): void {
    const copied = clause.toJSON();
    const back = ConditionClause.fromJSON(copied);
    action.clauses.push(back);
  }

  getActionTitle(action: Action): string {
    // if (action.type === 'state') {

    // }
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

    return 'Unknown Action'
  }

}

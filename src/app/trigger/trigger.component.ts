import { Component, Input, OnInit } from '@angular/core';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDialog } from '@angular/material/dialog';
import { ConditionalAction } from '@mopopinball/engine/src/system/rule-engine/actions/conditional-action';
import { DataAction } from '@mopopinball/engine/src/system/rule-engine/actions/data-action';
import { DeviceAction } from '@mopopinball/engine/src/system/rule-engine/actions/device-action';
import { IdTrigger } from '@mopopinball/engine/src/system/rule-engine/actions/id-trigger';
import { NamedTriggerAction } from '@mopopinball/engine/src/system/rule-engine/actions/named-trigger-action';
import { StateAction } from '@mopopinball/engine/src/system/rule-engine/actions/state-action';
import { SwitchTrigger } from '@mopopinball/engine/src/system/rule-engine/actions/switch-trigger';
import { TimerTrigger } from '@mopopinball/engine/src/system/rule-engine/actions/timer-trigger';
import { ActionTriggerType, Trigger } from '@mopopinball/engine/src/system/rule-engine/actions/trigger';
import { RuleEngine } from '@mopopinball/engine/src/system/rule-engine/rule-engine';
import { TimerTriggerMode, TriggerType } from '@mopopinball/engine/src/system/rule-engine/schema/triggers.schema';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { GameService } from '../game.service';

interface SwitchInfo {
  id: string;
  name: string;
}

@Component({
  selector: 'trigger',
  templateUrl: './trigger.component.html',
  styleUrls: ['./trigger.component.scss']
})
export class TriggerComponent implements OnInit {
  TimerActionTriggerMode: typeof TimerTriggerMode = TimerTriggerMode;
  @Input() ruleEngine: RuleEngine;
  @Input() trigger: ActionTriggerType;
  filteredSwitches: SwitchInfo[];

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
    const newAction = new ConditionalAction([], '', '');
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
    const newAction = new DeviceAction(null);
    trigger.actions.push(newAction);
    this.gameService.update();
  }

  addNamedAction(trigger: ActionTriggerType): void {
    const newAction = new NamedTriggerAction('');
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

  onSwitchChange(evt): void {
    this.filteredSwitches = Object.entries(this.gameService.getHardwareConfig().devices.switches)
      .map((entry) => {
        return { id: entry[0], name: entry[1].name };
      })
      .filter((details) => {
        return details.name.toLowerCase().indexOf(evt.target.value?.toLowerCase()) >= 0;
      }).sort((a, b) => {
        return a.name.localeCompare(b.name);
      });
  }

  onSwSelected(evt: MatAutocompleteSelectedEvent): void {
    console.log(evt.option.value);
    (this.trigger as any).switchId = evt.option.value;
    this.gameService.update();
  }

  onSwClosed(): void {
    // TODO: When closing without a selection somehow restore orig value in the text box.
    // (this.trigger as any).switchId =(this.trigger as any).switchId;
  }

  onSwitchTriggerHoldTimeChange(trigger: SwitchTrigger): void {
    if (!trigger.holdIntervalMs) {
      trigger.holdIntervalMs = null;
    }
    this.gameService.update();
  }

}

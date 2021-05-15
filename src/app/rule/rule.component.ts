import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { DesiredOutputState } from '@mopopinball/engine/src/system/rule-engine/desired-output-state';
import { RuleEngine } from '@mopopinball/engine/src/system/rule-engine/rule-engine';
import { MatDialog } from '@angular/material/dialog';
import { CreateDesiredOutputStateDialogComponent } from '../create-desired-output-state-dialog/create-desired-output-state-dialog.component';
import { GameService } from '../game.service';
import { CreateActionData, CreateActionDialogComponent } from '../create-action-dialog/create-action-dialog.component';
import { CreateDataDialogComponent } from '../create-data-dialog/create-data-dialog.component';
import { DataItem, NumberData } from '@mopopinball/engine/src/system/rule-engine/rule-data';
import { Operators } from '../operators';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { SwitchTriggerSchema, TimerTriggerMode, TriggerType } from '@mopopinball/engine/src/system/rule-engine/schema/triggers.schema';
import { IdTrigger } from '@mopopinball/engine/src/system/rule-engine/actions/id-trigger';
import { SwitchTrigger } from '@mopopinball/engine/src/system/rule-engine/actions/switch-trigger';
import { TimerTrigger } from '@mopopinball/engine/src/system/rule-engine/actions/timer-trigger';
import { ActionTriggerType, Trigger } from '@mopopinball/engine/src/system/rule-engine/actions/trigger';
import { ActionType, NamedTriggerActionSchema } from '@mopopinball/engine/src/system/rule-engine/schema/actions.schema';
import {NamedTriggerAction} from '@mopopinball/engine/src/system/rule-engine/actions/named-trigger-action';
import { Condition, ConditionalAction, DataCondition, SwitchCondition } from '@mopopinball/engine/src/system/rule-engine/actions/conditional-action';
import { Action } from '@mopopinball/engine/src/system/rule-engine/actions/action';
import { DataAction } from '@mopopinball/engine/src/system/rule-engine/actions/data-action';
import { StateAction } from '@mopopinball/engine/src/system/rule-engine/actions/state-action';
import { DeviceAction } from '@mopopinball/engine/src/system/rule-engine/actions/device-action';

@Component({
    selector: 'app-rule',
    templateUrl: './rule.component.html',
    styleUrls: ['./rule.component.scss']
})
export class RuleComponent implements OnInit {
    TimerActionTriggerMode: typeof TimerTriggerMode = TimerTriggerMode;
    @Input() isRoot: boolean = false;
    @Input() ruleEngine: RuleEngine;
    @Output() delete = new EventEmitter<void>();
    devices: DesiredOutputState[];
    showBody = true;
    readonly operators = Object.values(Operators);
    constructor(public dialog: MatDialog, protected gameService: GameService) { }
    
    ngOnInit(): void {
        this.updateDevices();
        const show = localStorage.getItem(`mopo-rule-${this.ruleEngine.id}`);
        if (show?.length > 0) {
            this.showBody = localStorage.getItem(`mopo-rule-${this.ruleEngine.id}`) === 'true';
        }
    }

    toggleShow(): void {
        this.showBody = !this.showBody;
        localStorage.setItem(`mopo-rule-${this.ruleEngine.id}`, `${this.showBody}`);
    }

    openInNewTab() {
        this.gameService.newTab.emit(this.ruleEngine);
    }

    addDevice() {
        const dialogRef = this.dialog.open(CreateDesiredOutputStateDialogComponent, {
            width: '50%',
            height: '75%'
        });

        dialogRef.afterClosed().subscribe((result: DesiredOutputState) => {
            this.ruleEngine.devices.set(result.id, result);
            this.updateDevices();
        });
    }

    addData(): void {
        const dialogRef = this.dialog.open(CreateDataDialogComponent, {
        });

        dialogRef.afterClosed().subscribe((result: DataItem) => {
            this.ruleEngine.data.set(result.id, result);
            this.gameService.update();
        });
    }

    private updateDevices(): void {
        this.devices = Array.from(this.ruleEngine.devices.values()).sort((a, b) => a.id.localeCompare(b.id));
        this.gameService.update();
    }

    addChild() {
        this.ruleEngine.children.push(
            new RuleEngine('new child', false, this.ruleEngine)
        );
        if(this.ruleEngine.autoStart) {
            this.ruleEngine.start();
        }
        this.gameService.update();
    }

    onInput() {
        console.log('i');
    }

    deleteChild(child: RuleEngine) {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            data: {
                action: 'Delete',
                prompt: `Are you sure you want to delete the rule "${child.id}"?`
            }
        });

        dialogRef.afterClosed().subscribe((result: boolean) => {
            if (result) {
                localStorage.removeItem(`mopo-rule-${child.id}`);
                this.ruleEngine.children.splice(this.ruleEngine.children.indexOf(child), 1);
                this.gameService.update();
            }
        });
    }

    deleteDevice(device: DesiredOutputState) {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            data: {
                action: 'Delete',
                prompt: `Are you sure you want to delete the device "${device.id}"?`
            }
        });

        dialogRef.afterClosed().subscribe((result: boolean) => {
            if (result) {
                this.ruleEngine.devices.delete(device.id);
                this.updateDevices();
            }
        });
    }

    addTrigger(existingTrigger: IdTrigger | SwitchTrigger | TimerTrigger): void {
        let triggerInfo;
        if (existingTrigger && existingTrigger.type === TriggerType.SWITCH) {
            triggerInfo = {switchId: existingTrigger.switchId, holdIntervalMs: existingTrigger.holdIntervalMs};
        } else if (existingTrigger && (existingTrigger.type === TriggerType.ID || existingTrigger.type === TriggerType.TIMER)) {
            triggerInfo = {id: existingTrigger.id};
        }
        const data: CreateActionData = {
            existingTrigger: existingTrigger,
            ruleEngine: this.ruleEngine
        };
        const dialogRef = this.dialog.open(CreateActionDialogComponent, {
            // width: '50%',
            data
        });

        dialogRef.afterClosed().subscribe((result: SwitchTriggerSchema) => {
            if(result) {
                this.ruleEngine.createTrigger(result);
                this.updateDevices();
            }
        });
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

    addNamedAction(trigger: ActionTriggerType): void {
        const newAction = new NamedTriggerAction('');
        trigger.actions.push(newAction);
        this.updateDevices();
    }

    addConditionalAction(trigger: ActionTriggerType): void {
        const newAction = new ConditionalAction([], '', '');
        trigger.actions.push(newAction);
        this.updateDevices();
    }

    addDataAction(trigger: ActionTriggerType): void {
        const newAction = new DataAction('', null, null, '');
        trigger.actions.push(newAction);
        this.updateDevices();
    }

    addStateAction(trigger: ActionTriggerType): void {
        const newAction = new StateAction('', '');
        trigger.actions.push(newAction);
        this.updateDevices();
    }

    addDeviceAction(trigger: ActionTriggerType): void {
        const newAction = new DeviceAction(null);
        trigger.actions.push(newAction);
        this.updateDevices();
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

    onAutoStartChange() {
        if(this.ruleEngine.autoStart) {
            this.ruleEngine.start();
        }
        else {
            this.ruleEngine.stop();
        }
        this.gameService.update();
    }

    onIdChange(val: string) {
        if (val) {
            localStorage.removeItem(`mopo-rule-${this.ruleEngine.id}`);
            this.ruleEngine.id = val;
            localStorage.setItem(`mopo-rule-${this.ruleEngine.id}`, `${this.showBody}`);
            this.gameService.update(); 
        }
    }

    autoCollapse(): boolean {
        return false;
        // return this.gameService.autoCollapse && !this.ruleEngine.active;
    }

    setTimerMode(trigger: TimerTrigger, checked: boolean): void {
        if (checked) {
            trigger.mode = TimerTriggerMode.INTERVAL;
        } else {
            trigger.mode = TimerTriggerMode.TIMEOUT;
        }
    }

    deleteRule(): void {
        this.delete.emit();
    }

    onSwitchTriggerHoldTimeChange(trigger: SwitchTrigger): void {
        if (!trigger.holdIntervalMs) {
            trigger.holdIntervalMs = null;
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

    addDataCondition(action): void {
        const dataCondition: DataCondition = {
            conditionType: 'data',
            expression: ''
        };
        action.conditions.push(dataCondition);
        this.gameService.update();
    }

    addSwitchCondition(action): void {
        const swCondition: SwitchCondition = {
            activated: true,
            switchId: '',
            conditionType: 'switch'
        };
        action.conditions.push(swCondition);
        this.gameService.update();
    }

    deleteCondition(action, condition: Condition): void {
        action.conditions.splice(action.conditions.indexOf(condition), 1);
        this.gameService.update();
    }

}

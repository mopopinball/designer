import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { DesiredOutputState } from '@mopopinball/engine/src/system/rule-engine/desired-output-state';
import { RuleEngine } from '@mopopinball/engine/src/system/rule-engine/rule-engine';
import { MatDialog } from '@angular/material/dialog';
import { CreateDesiredOutputStateDialogComponent } from '../create-desired-output-state-dialog/create-desired-output-state-dialog.component';
import { GameService } from '../game.service';
import { CreateActionData, CreateActionDialogComponent } from '../create-action-dialog/create-action-dialog.component';
import { StateActionSchema, SwitchActionTriggerSchema, TriggerType } from '@mopopinball/engine/src/system/rule-engine/schema/rule.schema';
import { CreateDataDialogComponent } from '../create-data-dialog/create-data-dialog.component';
import { RuleData } from '@mopopinball/engine/src/system/rule-engine/rule-data';
import { SwitchActionTrigger } from '@mopopinball/engine/src/system/rule-engine/actions/switch-action-trigger';
import { IdActionTrigger } from '@mopopinball/engine/src/system/rule-engine/actions/id-action-trigger';
import { Operators } from '../operators';
import { TimerActionTrigger, TimerActionTriggerMode } from '@mopopinball/engine/src/system/rule-engine/actions/timer-action-trigger';
import { ActionTriggerType } from '@mopopinball/engine/src/system/rule-engine/actions/action-trigger';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
    selector: 'app-rule',
    templateUrl: './rule.component.html',
    styleUrls: ['./rule.component.scss']
})
export class RuleComponent implements OnInit {
    TimerActionTriggerMode: typeof TimerActionTriggerMode = TimerActionTriggerMode;
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

        dialogRef.afterClosed().subscribe((result: RuleData) => {
            this.ruleEngine.data.set(result.id, result);
            this.gameService.update();
        });
    }

    onDataChange(): void {
        this.gameService.update();
    }

    deleteData(key: string): void {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            data: {
                action: 'Delete',
                prompt: `Are you sure you want to delete the data item "${key}"?`
            }
        });

        dialogRef.afterClosed().subscribe((result: boolean) => {
            if (result) {
                this.ruleEngine.data.delete(key);
                this.gameService.update();
            }
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

    addTrigger(existingTrigger: IdActionTrigger | SwitchActionTrigger | TimerActionTrigger): void {
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

        dialogRef.afterClosed().subscribe((result: SwitchActionTriggerSchema) => {
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

    addAction(trigger): void {
        // todo: make better
        this.addTrigger(
            trigger
        );
    }

    activateTrigger(trigger: SwitchActionTrigger | IdActionTrigger | TimerActionTrigger): void {
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

    setDataRoS(data: RuleData, val): void {
        if (!data.attributes) {
            data.attributes = {};
        }
        data.attributes.resetOnStateStop = val;
        this.gameService.update();
    }

    setDataWhole(data: RuleData, val): void {
        if (!data.attributes) {
            data.attributes = {};
        }
        data.attributes.isWholeNumber = val;
        this.gameService.update();
    }

    autoCollapse(): boolean {
        return false;
        // return this.gameService.autoCollapse && !this.ruleEngine.active;
    }

    setTimerMode(trigger: TimerActionTrigger, checked: boolean): void {
        if (checked) {
            trigger.mode = TimerActionTriggerMode.INTERVAL;
        } else {
            trigger.mode = TimerActionTriggerMode.TIMEOUT;
        }
    }

    deleteRule(): void {
        this.delete.emit();
    }

    onSwitchTriggerHoldTimeChange(trigger: SwitchActionTrigger): void {
        if (!trigger.holdIntervalMs) {
            trigger.holdIntervalMs = null;
        }
        this.gameService.update();
    }

}
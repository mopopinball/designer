import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DesiredOutputState } from '@mopopinball/engine/src/system/rule-engine/desired-output-state';
import { RuleEngine } from '@mopopinball/engine/src/system/rule-engine/rule-engine';
import { MatDialog } from '@angular/material/dialog';
import { CreateDesiredOutputStateDialogComponent } from '../create-desired-output-state-dialog/create-desired-output-state-dialog.component';
import { GameService } from '../game.service';
import { CreateActionData, CreateActionDialogComponent } from '../create-action-dialog/create-action-dialog.component';
import { StateActionSchema, SwitchActionTriggerSchema, TriggerType } from '@mopopinball/engine/src/system/rule-engine/schema/rule.schema';
import { ThrowStmt } from '@angular/compiler';
import { CreateDataDialogComponent } from '../create-data-dialog/create-data-dialog.component';
import { RuleData } from '@mopopinball/engine/src/system/rule-engine/rule-data';
import { SwitchActionTrigger } from '@mopopinball/engine/src/system/rule-engine/actions/switch-action-trigger';
import { IdActionTrigger } from '@mopopinball/engine/src/system/rule-engine/actions/id-action-trigger';

@Component({
    selector: 'app-rule',
    templateUrl: './rule.component.html',
    styleUrls: ['./rule.component.scss']
})
export class RuleComponent implements OnInit {
    @Input() isRoot: boolean = false;
    @Input() ruleEngine: RuleEngine;
    @Output() delete = new EventEmitter<void>();
    devices: DesiredOutputState[];
    showBody = true;
    constructor(public dialog: MatDialog, private gameService: GameService) { }

    ngOnInit(): void {
        this.updateDevices();
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

    onDataChange(data: RuleData): void {
        data.initValue = data.value;
        this.gameService.update();
    }

    deleteData(key: string): void {
        this.ruleEngine.data.delete(key);
        this.gameService.update();
    }

    private updateDevices(): void {
        this.devices = Array.from(this.ruleEngine.devices.values());
        this.gameService.update();
    }

    addChild() {
        this.ruleEngine.children.push(
            new RuleEngine('new child', true, this.ruleEngine)
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
        this.ruleEngine.children.splice(this.ruleEngine.children.indexOf(child), 1);
    }

    deleteDevice(device: DesiredOutputState) {
        this.ruleEngine.devices.delete(device.id);
        this.updateDevices();
    }

    addTrigger(existingTrigger: IdActionTrigger | SwitchActionTrigger): void {
        let triggerInfo;
        if (existingTrigger && existingTrigger.type === TriggerType.SWITCH) {
            triggerInfo = {switchId: existingTrigger.switchId};
        } else if (existingTrigger && existingTrigger.type === TriggerType.ID) {
            triggerInfo = {id: existingTrigger.id};
        }
        const data: CreateActionData = {
            triggerInfo: triggerInfo,
            ruleEngine: this.ruleEngine
        };
        const dialogRef = this.dialog.open(CreateActionDialogComponent, {
            // width: '50%',
            data
        });

        dialogRef.afterClosed().subscribe((result: SwitchActionTriggerSchema) => {
            this.ruleEngine.createTrigger(result);
            this.updateDevices();
        });
    }

    deleteTrigger(trigger): void {
        this.ruleEngine.triggers.splice(this.ruleEngine.triggers.indexOf(trigger), 1);
        this.gameService.update();
    }

    deleteAction(trigger, action): void {
        trigger.actions.splice(trigger.actions.indexOf(action), 1);
        this.gameService.update();
    }

    addAction(trigger): void {
        // todo: make better
        this.addTrigger(
            trigger
        );
    }

    activateTrigger(trigger: SwitchActionTrigger | IdActionTrigger): void {
        if (!this.ruleEngine.active) {
            return;
        }
        if (trigger.type === TriggerType.SWITCH) {
            this.gameService.onSwitch(trigger.switchId);
        } else if (trigger.type === TriggerType.ID) {
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

    onIdChange() {
        if(this.ruleEngine.id) {
            this.gameService.update();
        }
    }

}

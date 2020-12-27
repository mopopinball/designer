import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DesiredOutputState } from '@mopopinball/engine/src/system/rule-engine/desired-output-state';
import { RuleEngine } from '@mopopinball/engine/src/system/rule-engine/rule-engine';
import { MatDialog } from '@angular/material/dialog';
import { CreateDesiredOutputStateDialogComponent } from '../create-desired-output-state-dialog/create-desired-output-state-dialog.component';
import { GameService } from '../game.service';
import { CreateActionData, CreateActionDialogComponent } from '../create-action-dialog/create-action-dialog.component';
import { StateActionSchema, SwitchActionTriggerSchema } from '@mopopinball/engine/src/system/rule-engine/schema/rule.schema';
import { ThrowStmt } from '@angular/compiler';
import { CreateDataDialogComponent } from '../create-data-dialog/create-data-dialog.component';
import { RuleData } from '@mopopinball/engine/src/system/rule-engine/rule-data';

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

    onDataChange(): void {
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

    addTrigger(switchId: string): void {
        const data: CreateActionData = {
            switchInfo: {id: switchId, name: null},
            ruleEngine: this.ruleEngine
        };
        const dialogRef = this.dialog.open(CreateActionDialogComponent, {
            width: '50%',
            data
        });

        dialogRef.afterClosed().subscribe((result: SwitchActionTriggerSchema) => {
            this.ruleEngine.createAction(result);
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
            trigger.switchId
        );
    }

    activateTrigger(trigger): void {
        if (!this.ruleEngine.active) {
            return;
        }
        this.gameService.onSwitch(trigger.switchId);
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

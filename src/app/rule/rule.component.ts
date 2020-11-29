import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DesiredOutputState } from '@mopopinball/engine/src/system/rule-engine/desired-output-state';
import { RuleEngine } from '@mopopinball/engine/src/system/rule-engine/rule-engine';
import { MatDialog } from '@angular/material/dialog';
import { CreateDesiredOutputStateDialogComponent } from '../create-desired-output-state-dialog/create-desired-output-state-dialog.component';
import { GameService } from '../game.service';
import { CreateActionDialogComponent } from '../create-action-dialog/create-action-dialog.component';
import { StateActionSchema, SwitchActionTriggerSchema } from '@mopopinball/engine/src/system/rule-engine/schema/rule.schema';
import { ThrowStmt } from '@angular/compiler';

@Component({
    selector: 'app-rule',
    templateUrl: './rule.component.html',
    styleUrls: ['./rule.component.scss']
})
export class RuleComponent implements OnInit {

    @Input() ruleEngine: RuleEngine;
    @Output() delete = new EventEmitter<void>();
    devices: DesiredOutputState[];

    constructor(public dialog: MatDialog, private gameService: GameService) { }

    ngOnInit(): void {
        this.updateDevices();
    }

    addDevice() {
        const dialogRef = this.dialog.open(CreateDesiredOutputStateDialogComponent, {
            width: '50%'
        });

        dialogRef.afterClosed().subscribe((result: DesiredOutputState) => {
            console.log('The dialog was closed');
            this.ruleEngine.devices.set(result.id, result);
            this.updateDevices();
        });
    }

    private updateDevices(): void {
        this.devices = Array.from(this.ruleEngine.devices.values());
        this.gameService.update();
    }

    addChild() {
        this.ruleEngine.children.push(
            new RuleEngine('new child', true)
        );
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

    addTrigger(data?): void {
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
    }

    deleteAction(trigger, action): void {
        trigger.actions.splice(trigger.actions.indexOf(action), 1);
    }

    addAction(trigger): void {
        // todo: make better
        this.addTrigger({
            id: trigger.switchId
        });
    }

    activateTrigger(trigger): void {
        if (!this.ruleEngine.active) {
            return;
        }
        this.gameService.onSwitch(trigger.switchId);
        this.gameService.update();          
    }

}

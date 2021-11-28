import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { DesiredOutputState } from '@mopopinball/engine/src/system/rule-engine/desired-output-state';
import { RuleEngine } from '@mopopinball/engine/src/system/rule-engine/rule-engine';
import { MatDialog } from '@angular/material/dialog';
import { CreateDesiredOutputStateDialogComponent } from '../create-desired-output-state-dialog/create-desired-output-state-dialog.component';
import { GameService } from '../game.service';
import { CreateDataDialogComponent } from '../create-data-dialog/create-data-dialog.component';
import { DataItem, NumberData } from '@mopopinball/engine/src/system/rule-engine/rule-data';
import { Operators } from '../operators';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { SwitchTriggerSchema, TimerTriggerMode } from '@mopopinball/engine/src/system/rule-engine/schema/triggers.schema';
import { IdTrigger } from '@mopopinball/engine/src/system/rule-engine/actions/id-trigger';
import { SwitchTrigger } from '@mopopinball/engine/src/system/rule-engine/actions/switch-trigger';
import { TimerTrigger } from '@mopopinball/engine/src/system/rule-engine/actions/timer-trigger';
import { ActionType, NamedTriggerActionSchema } from '@mopopinball/engine/src/system/rule-engine/schema/actions.schema';
import {NamedTriggerAction} from '@mopopinball/engine/src/system/rule-engine/actions/named-trigger-action';
import { ConditionalAction } from '@mopopinball/engine/src/system/rule-engine/actions/conditional-action';
import { Action } from '@mopopinball/engine/src/system/rule-engine/actions/action';
import { DataAction } from '@mopopinball/engine/src/system/rule-engine/actions/data-action';
import { StateAction } from '@mopopinball/engine/src/system/rule-engine/actions/state-action';
import { DeviceAction } from '@mopopinball/engine/src/system/rule-engine/actions/device-action';
import { RuleSchema } from '@mopopinball/engine/src/system/rule-engine/schema/rule.schema';

@Component({
    selector: 'app-rule',
    templateUrl: './rule.component.html',
    styleUrls: ['./rule.component.scss']
})
export class RuleComponent implements OnInit {
    TimerActionTriggerMode: typeof TimerTriggerMode = TimerTriggerMode;
    @Input() isRoot = false;
    @Input() ruleEngine: RuleEngine;
    @Input() parent?: RuleEngine;
    @Input() isTabRoot = false;
    @Output() delete = new EventEmitter<void>();
    devices: DesiredOutputState[];
    showBody = true;
    readonly operators = Object.values(Operators);
    constructor(protected dialog: MatDialog, public gameService: GameService) { }

    ngOnInit(): void {
        this.updateDevices();
        const show = localStorage.getItem(`mopo-rule-${this.ruleEngine.id}`);
        if (show?.length > 0) {
            this.showBody = this.isTabRoot || localStorage.getItem(`mopo-rule-${this.ruleEngine.id}`) === 'true';
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
        if (this.ruleEngine.autoStart) {
            this.ruleEngine.start();
        }
        this.gameService.update();
    }

    copy(): void {
        const serialization = this.ruleEngine.toJSON() as unknown as RuleSchema;

        const copied = RuleEngine.load(serialization);
        this.parent.children.push(copied);
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

    changeDevice(existingDevice: DesiredOutputState, device: DesiredOutputState): void {
        this.ruleEngine.devices.delete(existingDevice.id);
        this.ruleEngine.devices.set(device.id, device);
        this.updateDevices();
    }

    addNamedTrigger(): void {
        const namedTrigger = new IdTrigger('');
        this.ruleEngine.triggers.push(namedTrigger);
        this.gameService.update();
    }

    addSwitchTrigger(): void {
        const swTrigger = new SwitchTrigger('');
        this.ruleEngine.triggers.push(swTrigger);
        this.gameService.update();
    }

    addTimedTrigger(): void {
        const timedTrigger = new TimerTrigger('', 0, TimerTriggerMode.TIMEOUT);
        this.ruleEngine.triggers.push(timedTrigger);
        this.gameService.update();
    }

    onAutoStartChange() {
        if (this.ruleEngine.autoStart) {
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

    deleteRule(): void {
        this.delete.emit();
    }



}

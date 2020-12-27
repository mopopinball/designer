import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActionType, CoilOutputState, DataActionSchema, DeviceActionSchema, LightOutputState, SoundOutputState, StateActionSchema, SwitchActionTriggerSchema, TriggerType } from '@mopopinball/engine/src/system/rule-engine/schema/rule.schema';
import { SwitchActionTrigger } from '@mopopinball/engine/src/system/rule-engine/actions/switch-action-trigger'
import hardware from '@mopopinball/engine/src/games/mars/hardware-config.json';
import { HardwareConfig } from '@mopopinball/engine/src/system/hardware-config.schema';
import { StateAction } from '@mopopinball/engine/src/system/rule-engine/actions/state-action';
import { CreateDesiredOutputStateDialogComponent } from '../create-desired-output-state-dialog/create-desired-output-state-dialog.component';
import { DesiredOutputState } from '@mopopinball/engine/src/system/rule-engine/desired-output-state';
import { DataOperation } from '@mopopinball/engine/src/system/rule-engine/actions/data-action';
import { SelectDataDialogComponent } from '../select-data-dialog/select-data-dialog.component';
import { RuleEngine } from '@mopopinball/engine/src/system/rule-engine/rule-engine';

export interface CreateActionData {
    switchInfo: SwitchInfo,
    ruleEngine: RuleEngine
}

interface SwitchInfo {
    id: string;
    name: string;
}

@Component({
    selector: 'app-create-action-dialog',
    templateUrl: './create-action-dialog.component.html',
    styleUrls: ['./create-action-dialog.component.scss']
})
export class CreateActionDialogComponent implements OnInit {
    hardwareConfig: HardwareConfig;
    mode = 'switch';
    from = '';
    to = '';
    switchId = '';
    selectedActionTabIndex: number = 0;
    switchHoldTime?: number = null;
    deviceOutputState: LightOutputState | CoilOutputState | SoundOutputState;
    DataOperation: typeof DataOperation = DataOperation;

    filteredSwitches: SwitchInfo[];

    dataActionKey: string;
    dataActionOperand: number;
    dataActionOperation: DataOperation;

    constructor(
        public dialog: MatDialog,
        public dialogRef: MatDialogRef<CreateActionDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: CreateActionData) {
        if (data) {
            this.switchId = data.switchInfo.id;
            this.mode = 'existing';
        }
    }

    ngOnInit(): void {
        this.hardwareConfig = hardware as unknown as HardwareConfig;
        this.onSwitchChange({ target: { value: '' } });
    }

    onSwitchChange(evt): void {
        this.filteredSwitches = Object.entries(this.hardwareConfig.devices.switches)
            .map((entry) => {
                return { id: entry[0], name: entry[1].name };
            })
            .filter((details) => {
                return details.name.toLowerCase().indexOf(evt.target.value?.toLowerCase()) >= 0;
            }).sort((a, b) => {
                return a.name.localeCompare(b.name);
            });
    }

    switchSelected(sw: SwitchInfo): void {
        this.switchId = sw.id;
    }

    create(): void {
        let newAction: DeviceActionSchema | StateActionSchema | DataActionSchema = null;
        if (this.selectedActionTabIndex === 0) {
            newAction = {
                type: ActionType.STATE,
                startTargetId: this.to,
                stopTargetId: this.from,
            };
        } else if (this.selectedActionTabIndex === 1) {
            newAction = {
                type: ActionType.DEVICE,
                state: this.deviceOutputState
            };
        } else if (this.selectedActionTabIndex === 2) {
            newAction = {
                type: ActionType.DATA,
                dataId: this.dataActionKey,
                operand: this.dataActionOperand,
                operation: this.dataActionOperation
            };
        }
        
        const result: SwitchActionTriggerSchema = {
            type: TriggerType.SWITCH,
            switchId: this.switchId,
            holdIntervalMs: this.switchHoldTime,
            actions: [newAction]
        };
        this.dialogRef.close(result);
    }

    selectDevice(): void {
        const dialogRef = this.dialog.open(CreateDesiredOutputStateDialogComponent, {
            width: '50%',
            height: '75%'
        });

        dialogRef.afterClosed().subscribe((result: DesiredOutputState) => {
            this.deviceOutputState = result.toJSON();
        });
    }

    selectData(): void {
        const dialogRef = this.dialog.open(SelectDataDialogComponent, {
            data: this.data.ruleEngine
        });

        dialogRef.afterClosed().subscribe((selectedKey: string) => {
            this.dataActionKey = selectedKey;
        });
    }

}

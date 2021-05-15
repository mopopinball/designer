import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import hardware from '@mopopinball/engine/src/games/mars/hardware-config.json';
import { HardwareConfig } from '@mopopinball/engine/src/system/hardware-config.schema';
import { CreateDesiredOutputStateDialogComponent } from '../create-desired-output-state-dialog/create-desired-output-state-dialog.component';
import { DesiredOutputState } from '@mopopinball/engine/src/system/rule-engine/desired-output-state';
import { DataOperation } from '@mopopinball/engine/src/system/rule-engine/actions/data-action';
import { SelectDataDialogComponent } from '../select-data-dialog/select-data-dialog.component';
import { RuleEngine } from '@mopopinball/engine/src/system/rule-engine/rule-engine';
import { Operators } from '../operators';
import { TimerTrigger } from '@mopopinball/engine/src/system/rule-engine/actions/timer-trigger';
import { IdTrigger } from '@mopopinball/engine/src/system/rule-engine/actions/id-trigger';
import { SwitchTrigger } from '@mopopinball/engine/src/system/rule-engine/actions/switch-trigger';
import { ConditionalActionSchema, DeviceActionSchema, StateActionSchema, DataActionSchema, ActionType } from '@mopopinball/engine/src/system/rule-engine/schema/actions.schema';
import { OutputStateType } from '@mopopinball/engine/src/system/rule-engine/schema/rule.schema';
import { IdTriggerSchema, SwitchTriggerSchema, TimerTriggerMode, TimerTriggerSchema, TriggerType } from '@mopopinball/engine/src/system/rule-engine/schema/triggers.schema';

export interface CreateActionData {
    existingTrigger: SwitchTrigger | IdTrigger |TimerTrigger
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
    TimerActionTriggerMode: typeof TimerTriggerMode = TimerTriggerMode;
    hardwareConfig: HardwareConfig;
    mode: string;
    existing: boolean = false;
    from = '';
    to = '';
    switchId = '';
    triggerId = '';

    triggerTimerMs: number;
    triggerTimerMode: TimerTriggerMode = TimerTriggerMode.TIMEOUT;

    selectedActionTabIndex: number = 0;
    switchHoldTime?: number = null;
    deviceOutputState: OutputStateType;
    DataOperation: typeof DataOperation = DataOperation;
    readonly operators = Object.values(Operators);
    filteredSwitches: SwitchInfo[];

    dataActionKey: string;
    dataActionOperand: number | string;
    dataActionOperation: DataOperation;

    constructor(
        public dialog: MatDialog,
        public dialogRef: MatDialogRef<CreateActionDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: CreateActionData
    ) {
        if (data.existingTrigger?.type === TriggerType.SWITCH) {
            this.switchId = data.existingTrigger.switchId;
            this.switchHoldTime = data.existingTrigger.holdIntervalMs;
            this.mode = 'switch';
            this.existing = true;    
        }
        else if (data.existingTrigger?.type === TriggerType.ID) {
            this.triggerId = data?.existingTrigger.id;
            this.mode = 'named';
            this.existing = true; 
        }
        else if (data.existingTrigger?.type === TriggerType.TIMER) {
            this.triggerId = data?.existingTrigger.id;
            this.triggerTimerMode = data?.existingTrigger.mode;
            this.triggerTimerMs = data?.existingTrigger.valueMs;
            this.mode = 'timed';
            this.existing = true; 
        }
        else {
            this.mode = localStorage.getItem('mopo-last-trigger-type') ?? 'switch';
        }
    }

    onTriggerTypeChange(): void {
        localStorage.setItem('mopo-last-trigger-type', this.mode);
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
        let newAction: ConditionalActionSchema | DeviceActionSchema | StateActionSchema | DataActionSchema = null;
        // if (this.selectedActionTabIndex === 1) {
        //     newAction = {
        //         type: ActionType.DEVICE,
        //         state: this.deviceOutputState
        //     };
        // }
        // if (this.data.existingTrigger) {
        //     this.data.existingTrigger.actions.push(newAction);
        //     this.dialogRef.close();
        // }
        if (this.mode === 'switch') {
            const result: SwitchTriggerSchema = {
                type: TriggerType.SWITCH,
                switchId: this.switchId,
                holdIntervalMs: this.switchHoldTime,
                actions: [newAction]
            };
            this.dialogRef.close(result);
        } else if (this.mode === 'named') {
            const result: IdTriggerSchema = {
                type: TriggerType.ID,
                id: this.triggerId,
                actions: [newAction]
            };
            this.dialogRef.close(result);
        } else if (this.mode === 'timed') {
            const result: TimerTriggerSchema = {
                type: TriggerType.TIMER,
                id: this.triggerId,
                valueMs: this.triggerTimerMs,
                mode: this.triggerTimerMode,
                actions: [newAction]
            }
            this.dialogRef.close(result);
        }
    }

    // selectDevice(): void {
    //     const dialogRef = this.dialog.open(CreateDesiredOutputStateDialogComponent, {
    //         width: '50%',
    //         height: '75%'
    //     });

    //     dialogRef.afterClosed().subscribe((result: DesiredOutputState) => {
    //         this.deviceOutputState = result.toJSON();
    //     });
    // }

    // selectData(): void {
    //     const dialogRef = this.dialog.open(SelectDataDialogComponent, {
    //         data: this.data.ruleEngine
    //     });

    //     dialogRef.afterClosed().subscribe((selectedKey: string) => {
    //         this.dataActionKey = selectedKey;
    //     });
    // }

    selectDataOperand(): void {
        const dialogRef = this.dialog.open(SelectDataDialogComponent, {
            data: this.data.ruleEngine
        });

        dialogRef.afterClosed().subscribe((selectedKey: string) => {
            this.dataActionOperand = selectedKey;
        });
    }

}

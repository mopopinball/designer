import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActionType, SwitchActionTriggerSchema, TriggerType } from '@mopopinball/engine/src/system/rule-engine/schema/rule.schema';
import { SwitchActionTrigger } from '@mopopinball/engine/src/system/rule-engine/actions/switch-action-trigger'
import hardware from '@mopopinball/engine/src/games/mars/hardware-config.json';
import { HardwareConfig } from '@mopopinball/engine/src/system/hardware-config.schema';

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

    filteredSwitches: SwitchInfo[];

    constructor(
        public dialogRef: MatDialogRef<CreateActionDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: SwitchInfo) {
        if (data) {
            this.switchId = data.id;
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
        const result: SwitchActionTriggerSchema = {
            type: TriggerType.SWITCH,
            switchId: this.switchId,
            actions: [{
                type: ActionType.STATE,
                startTargetId: this.to,
                stopTargetId: this.from,
            }]
        };
        this.dialogRef.close(result);
    }

}

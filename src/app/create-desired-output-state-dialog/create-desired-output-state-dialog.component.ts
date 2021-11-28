import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { CoilsSchema, DisplaysSchema, HardwareCoilSchema, HardwareConfig, HardwareDisplaySchema, HardwareLampSchema, HardwareSoundSchema, LampsSchema, SoundsSchema } from '@mopopinball/engine/src/system/hardware-config.schema';
import hardware from '@mopopinball/engine/src/games/mars/hardware-config.json';
import { LightState } from '@mopopinball/engine/src/system/devices/light';
import { DesiredOutputState } from '@mopopinball/engine/src/system/rule-engine/desired-output-state';
import { LampRole } from '@mopopinball/engine/src/system/devices/lamp-role';
import { OutputDeviceType } from '@mopopinball/engine/src/system/devices/output-device-type';

interface KeyValuePair<T> {
    key: string;
    value: T;
}

@Component({
    selector: 'app-create-desired-output-state-dialog',
    templateUrl: './create-desired-output-state-dialog.component.html',
    styleUrls: ['./create-desired-output-state-dialog.component.scss']
})
export class CreateDesiredOutputStateDialogComponent implements OnInit {
    hardwareConfig: HardwareConfig;
    result: DesiredOutputState;
    lamps: LampsSchema = {};
    coils: CoilsSchema;
    sounds: SoundsSchema;
    displays: DisplaysSchema;

    filteredCoils: KeyValuePair<HardwareCoilSchema>[];
    filteredLamps: KeyValuePair<HardwareLampSchema>[];
    filteredDisplays: KeyValuePair<HardwareDisplaySchema>[];
    filteredSounds: KeyValuePair<HardwareSoundSchema>[];

    constructor(
        public dialogRef: MatDialogRef<CreateDesiredOutputStateDialogComponent>
    ) { }

    ngOnInit(): void {
        this.hardwareConfig = hardware as unknown as HardwareConfig;
        this.sounds = this.hardwareConfig.sounds;
        this.displays = this.hardwareConfig.displays;
        this.coils = this.hardwareConfig.devices.coils;
        for (const lampEntry of Object.entries(this.hardwareConfig.devices.lamps)) {
            if (lampEntry[1].role === LampRole.COIL) {
                this.coils[lampEntry[0]] = lampEntry[1];
            }
            else if (lampEntry[1].role === LampRole.LAMP) {
                this.lamps[lampEntry[0]] = lampEntry[1];
            }
        }
        this.onSwitchChange({ target: { value: '' } });
    }

    newLamp(lamp: KeyValuePair<HardwareLampSchema>, state: LightState) {
        const result = new DesiredOutputState(lamp.key, OutputDeviceType.LIGHT, state);
        this.dialogRef.close(result);
    }

    newCoil(coil: KeyValuePair<HardwareCoilSchema>, state: boolean) {
        const result = new DesiredOutputState(coil.key, OutputDeviceType.COIL, state);
        this.dialogRef.close(result);
    }

    newDisplay(display: KeyValuePair<HardwareDisplaySchema>): void {
        const result = new DesiredOutputState(display.key, OutputDeviceType.DISPLAY, '');
        this.dialogRef.close(result);
    }

    newSound(sound: KeyValuePair<HardwareSoundSchema>): void {
        const result = new DesiredOutputState(sound.key, OutputDeviceType.SOUND, true);
        this.dialogRef.close(result);
    }

    onSwitchChange(evt): void {
        this.filteredCoils = Object.entries(this.coils)
            .map((entry) => {
                return { key: entry[0], value: entry[1] };
            })
            .filter((details) => {
                return details.value.name.toLowerCase().indexOf(evt.target.value?.toLowerCase()) >= 0;
            }).sort((a, b) => {
                return a.value.name.localeCompare(b.value.name);
            });

        this.filteredLamps = Object.entries(this.lamps)
            .map((entry) => {
                return { key: entry[0], value: entry[1] };
            })
            .filter((details) => {
                return details.value.name.toLowerCase().indexOf(evt.target.value?.toLowerCase()) >= 0;
            }).sort((a, b) => {
                return a.value.name.localeCompare(b.value.name);
            });
        this.filteredDisplays = Object.entries(this.displays)
            .map((entry) => {
                return { key: entry[0], value: entry[1] };
            })
            .filter((details) => {
                return details.value.name.toLowerCase().indexOf(evt.target.value?.toLowerCase()) >= 0;
            }).sort((a, b) => {
                return a.value.name.localeCompare(b.value.name);
            });
        this.filteredSounds = Object.entries(this.sounds)
            .map((entry) => {
                return { key: entry[0], value: entry[1] };
            })
            .filter((details) => {
                return details.value.description.toLowerCase().indexOf(evt.target.value?.toLowerCase()) >= 0;
            }).sort((a, b) => {
                return a.value.description.localeCompare(b.value.description);
            });
    }

}

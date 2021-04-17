import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LightState } from '@mopopinball/engine/src/system/devices/light';
import { OutputDeviceType } from '@mopopinball/engine/src/system/devices/output-device-type';
import { BlinkLightStyle } from '@mopopinball/engine/src/system/devices/styles/blink-light-style';
import {BlinkDisplayStyle} from '@mopopinball/engine/src/system/devices/styles/blink-display-style';
import { Style } from '@mopopinball/engine/src/system/devices/styles/style';
import { DesiredOutputState } from '@mopopinball/engine/src/system/rule-engine/desired-output-state';

@Component({
    selector: 'app-style-dialog',
    templateUrl: './style-dialog.component.html',
    styleUrls: ['./style-dialog.component.scss']
})
export class StyleDialogComponent implements OnInit {
    selectedOption: string = 'none';
    style: Style;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: DesiredOutputState,
        public dialogRef: MatDialogRef<StyleDialogComponent>
    ) { }

    ngOnInit(): void {
        if (!this.data.styles) {
            return;
        }
        this.style = this.data.styles[0];
        if (this.style && this.style instanceof BlinkLightStyle) {
            this.selectedOption = 'blink';
        } else if (this.style && this.style instanceof BlinkDisplayStyle) {
            this.selectedOption = 'blink';
        }
    }

    onStyleChange(value: string): void {
        switch(value) {
            case 'none':
                this.style = null;
                break;
            case 'blink':
                if (this.data.type === OutputDeviceType.LIGHT) {
                    this.style = new BlinkLightStyle(250, LightState.OFF);
                }
                else if (this.data.type === OutputDeviceType.DISPLAY) {
                    this.style = new BlinkDisplayStyle(250, this.data.getState() as string);
                }
                break;
        }
    }

    confirm(): void {
        this.dialogRef.close(this.style);
    }

}

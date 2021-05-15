import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DesiredOutputState, DesiredOutputStateType } from '@mopopinball/engine/src/system/rule-engine/desired-output-state';
import { GameService } from '../game.service';
import { OutputDeviceType } from '@mopopinball/engine/src/system/devices/output-device-type';
import { LightState } from '@mopopinball/engine/src/system/devices/light';
import { MatDialog } from '@angular/material/dialog';
import { StyleDialogComponent } from '../style-dialog/style-dialog.component';
import { DeviceAction } from '@mopopinball/engine/src/system/rule-engine/actions/device-action';
import { CreateDesiredOutputStateDialogComponent } from '../create-desired-output-state-dialog/create-desired-output-state-dialog.component';

@Component({
    selector: 'app-desired-output-state',
    templateUrl: './desired-output-state.component.html',
    styleUrls: ['./desired-output-state.component.scss']
})
export class DesiredOutputStateComponent implements OnInit {
    OutputDeviceType: typeof OutputDeviceType = OutputDeviceType;
    LightState: typeof LightState = LightState;
    engineState: DesiredOutputStateType;

    @Input() parentActive: boolean;
    @Input() state: DesiredOutputState;
    @Output() stateChange = new EventEmitter<DesiredOutputState>();
    @Input() deleteable: boolean;
    @Output() delete = new EventEmitter<void>();
    constructor(
        public dialog: MatDialog, private gameService: GameService) { }

    ngOnInit(): void {
        this.gameService.tick.subscribe((deviceStates) => {
            if (deviceStates.has(this.state.id)) {
                this.engineState = deviceStates.get(this.state.id).getState();
            }
        });
    }

    selectDevice(): void {
        const dialogRef = this.dialog.open(CreateDesiredOutputStateDialogComponent, {
            width: '50%',
            height: '75%'
        });

        dialogRef.afterClosed().subscribe((result: DesiredOutputState) => {
            if (result) {
                this.stateChange.emit(result);
            }
        });
    }

    formatState(state: DesiredOutputStateType): string {
        if (state === true || state === LightState.ON) {
            return 'On';
        }
        else if (state === false || state === LightState.OFF) {
            return 'Off'
        }
        else if (state === LightState.BLINK) {
            return 'Blink';
        }
        else {
            return '';
        }
    }

    onChangeState(newState) {
        this.state.setInitialState(newState);
        this.gameService.update();
    }

    showStyleDialog(state: DesiredOutputState): void {
        const dialogRef = this.dialog.open(StyleDialogComponent, {
            data: state
        });

        dialogRef.afterClosed().subscribe((style) => {
            this.state.styles = [];
            if (style) {
                this.state.styles.push(style);
            }
            this.gameService.update();
        });
    }

    getStyleCount(): number {
        return this.state.styles.length || null;
    }

}

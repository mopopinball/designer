import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DesiredOutputState, DesiredOutputStateType } from '@mopopinball/engine/src/system/rule-engine/desired-output-state';
import { GameService } from '../game.service';
import { OutputDeviceType } from '@mopopinball/engine/src/system/devices/output-device-type';
import { LightState } from '@mopopinball/engine/src/system/devices/light';

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
  @Input() deleteable: boolean;
  @Output() delete = new EventEmitter<void>();
  constructor(private gameService: GameService) { }

  ngOnInit(): void {
    this.gameService.tick.subscribe((deviceStates) => {
      if (deviceStates.has(this.state.id)) {
        this.engineState = deviceStates.get(this.state.id).getState();
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

}

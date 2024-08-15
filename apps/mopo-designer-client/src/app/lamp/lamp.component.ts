import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  DesiredOutputState,
  HardwareConfig,
  LightState,
  PlayfieldLamp,
} from '@mopopinball/engine';
import {
  MatButtonToggleChange,
  MatButtonToggleModule,
} from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { LAMP_ICON } from '../icons-constants';

@Component({
  selector: 'mopo-lamp',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './lamp.component.html',
  styleUrl: './lamp.component.scss',
})
export class LampComponent implements OnInit {
  @Input() state: DesiredOutputState;
  @Input() hardwareConfig: HardwareConfig;
  @Output() lampChange = new EventEmitter<DesiredOutputState>();
  number: number;
  name: string;

  LAMP_ICON = LAMP_ICON;

  ngOnInit(): void {
    this.number = this.hardwareConfig.devices.lamps[this.state.id].number;
    this.name = this.hardwareConfig.devices.lamps[this.state.id].name;
  }

  setInitialState(evt: MatButtonToggleChange): void {
    this.state.setInitialState(evt.value);
    if (evt.value === LightState.ON || evt.value === LightState.OFF) {
      this.state.blinkRate = null;
      this.state.styles = [];
    }

    this.lampChange.emit(this.state);
  }

  setBlinkState(evt): void {
    this.state.blinkRate = parseInt(evt.target.value);
    this.lampChange.emit(this.state);
  }
}

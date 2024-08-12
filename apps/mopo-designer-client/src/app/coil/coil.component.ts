import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  DesiredOutputState,
  HardwareCoilSchema,
  HardwareConfig,
} from '@mopopinball/engine';
import { MatButtonToggleChange, MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'mopo-coil',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './coil.component.html',
  styleUrl: './coil.component.scss',
})
export class CoilComponent implements OnInit {
  @Input() state: DesiredOutputState;
  @Input() hardwareConfig: HardwareConfig;
  @Output() coilChange = new EventEmitter<DesiredOutputState>();

  dvivenBy: 'Coil' | 'Lamp';
  coil: HardwareCoilSchema;

  ngOnInit(): void {
    this.coil = this.hardwareConfig.devices.coils[this.state.id];
    this.dvivenBy = 'Coil';
    // some coils are driven by lamps. If this is the case load it.
    if (!this.coil) {
      this.coil = this.hardwareConfig.devices.lamps[
        this.state.id
      ] as HardwareCoilSchema;
      this.dvivenBy = 'Lamp';
    }
  }

  onChange(evt: MatButtonToggleChange): void {
    this.state.setInitialState(evt.value);
    this.coilChange.emit(this.state);
  }
}

import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  DesiredOutputState,
  HardwareConfig,
  RuleEngine,
} from '@mopopinball/engine';
import { MatIconModule } from '@angular/material/icon';
import { LampComponent } from '../lamp/lamp.component';
import { CoilComponent } from '../coil/coil.component';

@Component({
  selector: 'mopo-devices',
  standalone: true,
  imports: [
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    MatIconModule,
    LampComponent,
    CoilComponent,
  ],
  templateUrl: './devices.component.html',
  styleUrl: './devices.component.scss',
})
export class DevicesComponent implements OnInit, OnChanges {
  @Input() selectedEngine: RuleEngine;
  @Input() hardwareConfig: HardwareConfig;

  deviceSearchTerm = '';
  lamps: DesiredOutputState[] = [];
  coils: DesiredOutputState[] = [];

  ngOnInit(): void {
    this.searchDevices();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.['selectedEngine']) {
      this.searchDevices();
    }
  }

  clearDeviceSearch(): void {
    this.deviceSearchTerm = '';
    this.searchDevices();
  }

  searchDevices(): void {
    this.lamps = Array.from(this.selectedEngine.devices.values())
      .filter((dos) => dos.forLight)
      .filter((l: DesiredOutputState) =>
        l.id.toLowerCase().includes(this.deviceSearchTerm.toLowerCase())
      )
      .sort((a, b) => a.id.localeCompare(b.id));

    this.coils = Array.from(this.selectedEngine.devices.values())
      .filter((dos) => dos.forCoil)
      .filter((l: DesiredOutputState) =>
        l.id.toLowerCase().includes(this.deviceSearchTerm.toLowerCase())
      )
      .sort((a, b) => a.id.localeCompare(b.id));
  }
}

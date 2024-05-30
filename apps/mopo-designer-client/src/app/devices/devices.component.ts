import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DesiredOutputState, RuleEngine } from '@mopopinball/engine';
import { MatIconModule } from '@angular/material/icon';
import { LampComponent } from '../lamp/lamp.component';

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
  ],
  templateUrl: './devices.component.html',
  styleUrl: './devices.component.scss',
})
export class DevicesComponent implements OnInit {
  @Input() selectedEngine: RuleEngine;

  deviceSearchTerm = '';
  lamps: DesiredOutputState[] = [];

  ngOnInit(): void {
    this.searchDevices();
  }

  clearDeviceSearch(): void {
    this.deviceSearchTerm = '';
    this.searchDevices();
  }

  searchDevices(): void {
    this.lamps = Array.from(this.selectedEngine.devices.values())
      .filter((l: DesiredOutputState) =>
        l.id.toLowerCase().includes(this.deviceSearchTerm.toLowerCase())
      )
      .sort((a, b) => a.id.localeCompare(b.id));
  }
}

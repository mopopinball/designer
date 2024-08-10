import { v4 as uuidv4 } from 'uuid';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PropertiesComponent } from '../properties/properties.component';
import {
  DesiredOutputState,
  HardwareConfig,
  HardwareLampSchema,
  LightState,
  OutputDeviceType,
} from '@mopopinball/engine';
import { DeviceAction } from '@mopopinball/engine/dist/src/system/rule-engine/actions/device-action';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { LampComponent } from '../lamp/lamp.component';

@Component({
  selector: 'mopo-device-action-properties',
  standalone: true,
  imports: [
    CommonModule,
    PropertiesComponent,
    MatSelectModule,
    MatInputModule,
    FormsModule,
    MatIconModule,
    LampComponent
  ],
  templateUrl: './device-action-properties.component.html',
  styleUrl: './device-action-properties.component.scss',
})
export class DeviceActionPropertiesComponent implements OnInit {
  @Input() hardwareConfig: HardwareConfig;
  @Input() deviceAction: DeviceAction;
  @Output() actionChange = new EventEmitter();
  @Output() removeAction = new EventEmitter();

  devices: { label: string; value: string }[] = [];

  deviceId: string = null;

  ngOnInit(): void {
    this.deviceId = this.deviceAction.state?.id;

    this.devices = Array.from(Object.entries(this.hardwareConfig.devices.lamps))
      .map((entry: [string, HardwareLampSchema]) => {
        return {
          label: entry[1].name,
          value: entry[0],
        };
      })
      .sort((a, b) => a.label.localeCompare(b.label));
  }

  onSelectionChange(evt: MatSelectChange): void {
    this.deviceAction.state = new DesiredOutputState(
      evt.value,
      OutputDeviceType.LIGHT,
      LightState.ON
    );
    this.actionChange.emit();
  }
}

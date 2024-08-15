import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PropertiesComponent } from '../properties/properties.component';
import {
  DesiredOutputState,
  HardwareCoilSchema,
  HardwareConfig,
  HardwareLampSchema,
  LampRole,
  LightState,
  OutputDeviceType,
} from '@mopopinball/engine';
import { DeviceAction } from '@mopopinball/engine/dist/src/system/rule-engine/actions/device-action';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { LampComponent } from '../lamp/lamp.component';
import { CoilComponent } from '../coil/coil.component';
import { CoilType } from '@mopopinball/engine/dist/src/system/devices/coil-type';
import { COIL_ICON, LAMP_ICON, RELAY_ICON } from '../icons-constants';

export interface DeviceOption {
  label: string;
  value: string;
  icon: string;
  type: LampRole;
}

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
    LampComponent,
    CoilComponent,
  ],
  templateUrl: './device-action-properties.component.html',
  styleUrl: './device-action-properties.component.scss',
})
export class DeviceActionPropertiesComponent implements OnInit {
  @Input() hardwareConfig: HardwareConfig;
  @Input() deviceAction: DeviceAction;
  @Output() actionChange = new EventEmitter();
  @Output() removeAction = new EventEmitter();

  devices: DeviceOption[] = [];

  deviceId: string = null;
  selectedItem: DeviceOption;

  ngOnInit(): void {
    this.devices = [];

    const lamps = Array.from(Object.entries(this.hardwareConfig.devices.lamps))
      .filter((d) => d[1].role === LampRole.LAMP)
      .map((entry: [string, HardwareLampSchema]) => {
        return {
          label: entry[1].name,
          value: entry[0],
          icon: LAMP_ICON,
          type: LampRole.LAMP,
        };
      });
    this.devices.push(...lamps);

    const lampDrivenCoils = Array.from(
      Object.entries(this.hardwareConfig.devices.lamps)
    )
      .filter((d) => d[1].role === LampRole.COIL)
      .map((entry: [string, HardwareLampSchema]) => {
        return {
          label: entry[1].name,
          value: entry[0],
          icon: entry[1].coilType === CoilType.COIL ? COIL_ICON : RELAY_ICON,
          type: LampRole.COIL,
        };
      });
    this.devices.push(...lampDrivenCoils);

    const coils = Array.from(
      Object.entries(this.hardwareConfig.devices.coils)
    ).map((entry: [string, HardwareCoilSchema]) => {
      return {
        label: entry[1].name,
        value: entry[0],
        icon: COIL_ICON,
        type: LampRole.COIL,
      };
    });

    this.devices.push(...coils);

    this.devices.sort((a, b) => a.label.localeCompare(b.label));

    this.deviceId = this.deviceAction.state?.id;
    this.selectedItem = this.devices.find((d) => d.value === this.deviceId);
  }

  onSelectionChange(evt: MatSelectChange): void {
    this.selectedItem = this.devices.find((d) => d.value === evt.value);

    if (this.selectedItem.type === LampRole.LAMP) {
      this.deviceAction.state = new DesiredOutputState(
        evt.value,
        OutputDeviceType.LIGHT,
        LightState.ON
      );
    } else if (this.selectedItem.type === LampRole.COIL) {
      this.deviceAction.state = new DesiredOutputState(
        evt.value,
        OutputDeviceType.COIL,
        true
      );
    }

    this.actionChange.emit();
  }
}

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SwitchTrigger } from '@mopopinball/engine/dist/src/system/rule-engine/actions/switch-trigger';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { HardwareConfig } from '@mopopinball/engine';

@Component({
  selector: 'mopo-switch-trigger-properties',
  standalone: true,
  imports: [CommonModule, MatSelectModule, MatInputModule, FormsModule],
  templateUrl: './switch-trigger-properties.component.html',
  styleUrl: './switch-trigger-properties.component.scss',
})
export class SwitchTriggerPropertiesComponent implements OnInit {
  @Input() hardwareConfig: HardwareConfig;
  @Input() switchTrigger: SwitchTrigger;
  @Output() triggerChange = new EventEmitter();

  switches: {label: string, value: string}[] = [];

  ngOnInit(): void {
    this.switches = Array.from(
      Object.entries(this.hardwareConfig.devices.switches)
    ).map((entry) => {
      return {
        label: entry[1].name,
        value: entry[0],
      };
    });
  }

  onSelectionChange(): void {
    this.triggerChange.emit();
  }
}

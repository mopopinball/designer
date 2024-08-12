import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { PropertiesComponent } from '../properties/properties.component';
import { HardwareConfig, SwitchTrigger } from '@mopopinball/engine';
import { TimerTrigger } from '@mopopinball/engine/dist/src/system/rule-engine/actions/timer-trigger';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

@Component({
  selector: 'mopo-timer-trigger-properties',
  standalone: true,
  imports: [
    CommonModule,
    MatSelectModule,
    MatInputModule,
    FormsModule,
    PropertiesComponent,
    MatButtonToggleModule,
  ],
  templateUrl: './timer-trigger-properties.component.html',
  styleUrl: './timer-trigger-properties.component.scss',
})
export class TimerTriggerPropertiesComponent {
  @Input() hardwareConfig: HardwareConfig;
  @Input() timerTrigger: TimerTrigger;
  @Output() triggerChange = new EventEmitter();
  @Output() removeTrigger = new EventEmitter();

  onSelectionChange(): void {
    // this.swNumber =
    //   this.hardwareConfig.devices.switches[this.switchTrigger.switchId].number;

    // if (!this.switchTrigger.holdIntervalMs) {
    //   this.switchTrigger.holdIntervalMs = undefined;
    // }

    this.triggerChange.emit();
  }

  onChange(evt): void {
    this.timerTrigger.mode = evt.value;

    this.triggerChange.emit();
  }
}

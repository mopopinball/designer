import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PropertiesComponent } from '../properties/properties.component';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { HardwareConfig, RuleEngine } from '@mopopinball/engine';
import { StateAction } from '@mopopinball/engine/dist/src/system/rule-engine/actions/state-action';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'mopo-state-action-properties',
  standalone: true,
  imports: [
    CommonModule,
    PropertiesComponent,
    MatSelectModule,
    MatInputModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './state-action-properties.component.html',
  styleUrl: './state-action-properties.component.scss',
})
export class StateActionPropertiesComponent implements OnInit {
  @Input() hardwareConfig: HardwareConfig;
  @Input() stateAction: StateAction;
  @Input() rootEngine: RuleEngine;

  @Output() actionChange = new EventEmitter();
  @Output() removeAction = new EventEmitter();

  engines: RuleEngine[] = [];

  ngOnInit(): void {
    this.engines = Array.from(this.rootEngine.getAllEngines().values());
  }

  onSelectionChange(): void {
    this.actionChange.emit();
  }
}

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { HardwareConfig, RuleEngine } from '@mopopinball/engine';
import { StateAction } from '@mopopinball/engine/dist/src/system/rule-engine/actions/state-action';
import { PropertiesComponent } from '../properties/properties.component';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { DataItem } from '@mopopinball/engine/dist/src/system/rule-engine/rule-data';
import { DataAction } from '@mopopinball/engine/dist/src/system/rule-engine/actions/data-action';

@Component({
  selector: 'mopo-data-action-properties',
  standalone: true,
  imports: [
    CommonModule,
    PropertiesComponent,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    NgFor,
  ],
  templateUrl: './data-action-properties.component.html',
  styleUrl: './data-action-properties.component.scss',
})
export class DataActionPropertiesComponent implements OnInit {
  @Input() hardwareConfig: HardwareConfig;
  @Input() dataAction: DataAction;
  @Input() selectedEngine: RuleEngine;

  @Output() actionChange = new EventEmitter();
  @Output() removeAction = new EventEmitter();

  dataKeys: string[] = [];
  selectedDataKey: string;

  ngOnInit(): void {
    this.dataKeys = Array.from(this.selectedEngine.getData().keys());
  }

  onDataKeyChange(key: string): void {
    this.dataAction.dataKey = key;
  }

  onExpressionChange(): void {
    this.actionChange.emit();
  }
}

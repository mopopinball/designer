import { Component, Input, OnInit } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { RuleEngine, HardwareConfig } from '@mopopinball/engine';
import {
  DataItem,
  NumberData,
  StringData,
} from '@mopopinball/engine/dist/src/system/rule-engine/rule-data';
import {
  MatChipEditedEvent,
  MatChipInputEvent,
  MatChipsModule,
} from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

@Component({
  selector: 'mopo-data',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatChipsModule,
    NgFor,
    MatIconModule,
  ],
  templateUrl: './data.component.html',
  styleUrl: './data.component.scss',
})
export class DataComponent implements OnInit {
  @Input() selectedEngine: RuleEngine;
  @Input() hardwareConfig: HardwareConfig;

  dataList: DataItem[] = [];

  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  ngOnInit(): void {
    this.loadDataList();
  }

  private loadDataList(): void {
    this.dataList = Array.from(this.selectedEngine.data.values());
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value) {
      this.selectedEngine.data.set(value, {
        type: 'string',
        id: value,
      } as StringData);
    }

    // Clear the input value
    event.chipInput!.clear();
    this.loadDataList();
  }

  remove(data: DataItem): void {
    this.selectedEngine.data.delete(data.id);
    this.loadDataList();
  }
}

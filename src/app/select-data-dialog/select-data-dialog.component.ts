import { Component, Inject, OnInit } from '@angular/core';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RuleEngine } from '@mopopinball/engine/src/system/rule-engine/rule-engine';
import { GameService } from '../game.service';

@Component({
  selector: 'app-select-data-dialog',
  templateUrl: './select-data-dialog.component.html',
  styleUrls: ['./select-data-dialog.component.scss']
})
export class SelectDataDialogComponent implements OnInit {
  allData: string[];
  availableData: string[];
  selectedKey: string;

  constructor(
    public dialogRef: MatDialogRef<SelectDataDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RuleEngine) { }

  ngOnInit(): void {
    this.allData = Array.from(this.data.getInheritedData().keys()).sort();
    this.onSwitchChange({target: {value: ''}});
  }

  onSwitchChange(evt): void {
    this.availableData = this.allData
      .filter((details) => {
        return details.toLowerCase().indexOf(evt.target.value?.toLowerCase()) >= 0;
      }).sort((a, b) => {
        return a.localeCompare(b);
      });
  }

  selectData(evt: MatAutocompleteSelectedEvent): void {
    this.dialogRef.close(evt.option.value);
  }

}

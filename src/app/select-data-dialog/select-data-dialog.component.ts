import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RuleEngine } from '@mopopinball/engine/src/system/rule-engine/rule-engine';
import { GameService } from '../game.service';

@Component({
  selector: 'app-select-data-dialog',
  templateUrl: './select-data-dialog.component.html',
  styleUrls: ['./select-data-dialog.component.scss']
})
export class SelectDataDialogComponent implements OnInit {
  availableData: string[];
  selectedKey: string;

  constructor(
    public dialogRef: MatDialogRef<SelectDataDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RuleEngine) { }

  ngOnInit(): void {
    this.availableData = Array.from(this.data.getInheritedData().keys());
  }

  selectData(): void {
    this.dialogRef.close(this.selectedKey);
  }

}

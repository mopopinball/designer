import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { RuleData } from '@mopopinball/engine/src/system/rule-engine/rule-data';

@Component({
  selector: 'app-create-data-dialog',
  templateUrl: './create-data-dialog.component.html',
  styleUrls: ['./create-data-dialog.component.scss']
})
export class CreateDataDialogComponent implements OnInit {
  dataId: string;
  dataValue: number;

  constructor(
    public dialogRef: MatDialogRef<CreateDataDialogComponent>
  ) { }

  ngOnInit(): void {
  }

  create(): void {
    const result: RuleData = {
      id: this.dataId,
      value: this.dataValue,
      initValue: this.dataValue
    };
    this.dialogRef.close(result);
  }

}

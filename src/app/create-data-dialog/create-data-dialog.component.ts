import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { NumberData } from '@mopopinball/engine/src/system/rule-engine/rule-data';

@Component({
  selector: 'app-create-data-dialog',
  templateUrl: './create-data-dialog.component.html',
  styleUrls: ['./create-data-dialog.component.scss']
})
export class CreateDataDialogComponent implements OnInit {
  dataId: string;
  dataValue: string;

  constructor(
    public dialogRef: MatDialogRef<CreateDataDialogComponent>
  ) { }

  ngOnInit(): void {
  }

  create(): void {
    const numberRegex = /^\d+$/;
    if (numberRegex.test(this.dataValue)) {
      this.dialogRef.close(
      {
        type: 'number',
        id: this.dataId,
        value: this.dataValue,
        initValue: this.dataValue
      });
    }
    else {
      this.dialogRef.close(
        {
          type: 'string',
          id: this.dataId,
          value: this.dataValue,
          initValue: this.dataValue
        });
      }
  }

}

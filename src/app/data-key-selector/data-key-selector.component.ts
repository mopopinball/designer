import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RuleEngine } from '@mopopinball/engine/src/system/rule-engine/rule-engine';
import { SelectDataDialogComponent } from '../select-data-dialog/select-data-dialog.component';

@Component({
  selector: 'app-data-key-selector',
  templateUrl: './data-key-selector.component.html',
  styleUrls: ['./data-key-selector.component.scss']
})
export class DataKeySelectorComponent implements OnInit {
  @Input() ruleEngine: RuleEngine;
  @Input() dataKey: string;
  @Output() key = new EventEmitter<string>();

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  selectData(): void {
    const dialogRef = this.dialog.open(SelectDataDialogComponent, {
        data: this.ruleEngine,
        autoFocus: true
    });

    dialogRef.afterClosed().subscribe((selectedKey: string) => {
      if (selectedKey) {
        this.dataKey = selectedKey;
        this.key.emit(this.dataKey);
      }
    });
}

}

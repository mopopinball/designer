import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import hardware from '@mopopinball/engine/src/games/mars/hardware-config.json';
import { HardwareConfig } from '@mopopinball/engine/src/system/hardware-config.schema';
import { RuleSchema } from '@mopopinball/engine/src/system/rule-engine/schema/rule.schema';

@Component({
  selector: 'app-select-hardware-dialog',
  templateUrl: './select-hardware-dialog.component.html',
  styleUrls: ['./select-hardware-dialog.component.scss']
})
export class SelectHardwareDialogComponent implements OnInit {
  hardwareFiles: HardwareConfig[] = [];
  constructor(public dialogRef: MatDialogRef<SelectHardwareDialogComponent>) { }

  ngOnInit(): void {
    // TODO: Load all hardware files.
    this.hardwareFiles.push(hardware as unknown as HardwareConfig);
    
    // const dir = readdirSync('@mopopinball/engine/src/games');
    // console.log(dir);
  }

  select(hw: HardwareConfig): void {
    this.dialogRef.close(hw);
  }

}

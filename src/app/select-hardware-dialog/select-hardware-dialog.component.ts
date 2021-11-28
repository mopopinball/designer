import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSelectionListChange } from '@angular/material/list/selection-list';
import gameMars from '@mopopinball/engine/src/games/mars/hardware-config.json';
import gamePanth from '@mopopinball/engine/src/games/panthera/hardware-config.json';
import { HardwareConfig } from '@mopopinball/engine/src/system/hardware-config.schema';

@Component({
  selector: 'select-hardware-dialog',
  templateUrl: './select-hardware-dialog.component.html',
  styleUrls: ['./select-hardware-dialog.component.scss']
})
export class SelectHardwareDialogComponent implements OnInit {
  hardwareFiles: HardwareConfig[] = [];
  constructor(public dialogRef: MatDialogRef<SelectHardwareDialogComponent>) { }

  ngOnInit(): void {
    // TODO: Load all hardware files.
    this.addGame(gameMars);
    this.addGame(gamePanth);

    // const dir = readdirSync('@mopopinball/engine/src/games');
    // console.log(dir);
  }

  private addGame(game: unknown): void {
    this.hardwareFiles.push(game as HardwareConfig);
  }

  select(evt: MatSelectionListChange): void {
    this.dialogRef.close(evt.options[0].value);
  }

  getSwCount(hw: HardwareConfig): number {
    return Object.values(hw.devices.switches).length;
  }

  getLampCount(hw: HardwareConfig): number {
    return Object.values(hw.devices.lamps).length;
  }

  getCoilCount(hw: HardwareConfig): number {
    return Object.values(hw.devices.coils).length;
  }

}

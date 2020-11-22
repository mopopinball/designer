import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DesiredOutputState } from '@mopopinball/engine/src/system/rule-engine/desired-output-state';
import {RuleEngine} from '@mopopinball/engine/src/system/rule-engine/rule-engine';
import { MatDialog } from '@angular/material/dialog';
import { CreateDesiredOutputStateDialogComponent } from '../create-desired-output-state-dialog/create-desired-output-state-dialog.component';
import { GameService } from '../game.service';

@Component({
  selector: 'app-rule',
  templateUrl: './rule.component.html',
  styleUrls: ['./rule.component.scss']
})
export class RuleComponent implements OnInit {

  @Input() ruleEngine: RuleEngine;
  @Output() delete = new EventEmitter<void>();
  devices: DesiredOutputState[];

  constructor(public dialog: MatDialog, private gameService: GameService) { }

  ngOnInit(): void {
    this.updateDevices();
  }

  addDevice() {
    const dialogRef = this.dialog.open(CreateDesiredOutputStateDialogComponent, {
      width: '50%'
    });

    dialogRef.afterClosed().subscribe((result: DesiredOutputState) => {
      console.log('The dialog was closed');
      this.ruleEngine.devices.set(result.id, result);
      this.updateDevices();
    });
  }

  private updateDevices(): void {
    this.devices = Array.from(this.ruleEngine.devices.values());
    this.gameService.update();
  }

  addChild() {
    this.ruleEngine.children.push(
      new RuleEngine('new child', true)
    );
  }

  onInput() {
    console.log('i');
  }

  deleteChild(child: RuleEngine) {
    this.ruleEngine.children.splice(this.ruleEngine.children.indexOf(child), 1);
  }

  deleteDevice(device: DesiredOutputState) {
    this.ruleEngine.devices.delete(device.id);
    this.updateDevices();
  }

}

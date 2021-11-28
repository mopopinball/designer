import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NumberData } from '@mopopinball/engine/src/system/rule-engine/rule-data';
import { DataItemComponent } from '../data-item.component';
import { GameService } from '../game.service';

@Component({
  selector: 'number-data',
  templateUrl: './number-data.component.html',
  styleUrls: ['./number-data.component.scss']
})
export class NumberDataComponent extends DataItemComponent implements OnInit {
  @Input() id: string;
  @Input() numberData: NumberData;

  constructor(gameService: GameService, public dialog: MatDialog) {
    super(gameService, dialog);
  }

  ngOnInit(): void {
  } 

  setDataWhole(data: NumberData, val): void {
      if (!data.attributes) {
          data.attributes = {};
      }
      data.attributes.isWholeNumber = val;
      this.gameService.update();
  }
}

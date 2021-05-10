import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { StringData } from '@mopopinball/engine/src/system/rule-engine/rule-data';
import { DataItemComponent } from '../data-item.component';
import { GameService } from '../game.service';

@Component({
  selector: 'string-data',
  templateUrl: './string-data.component.html',
  styleUrls: ['./string-data.component.scss']
})
export class StringDataComponent extends DataItemComponent  implements OnInit {

  @Input() id: string;
  @Input() data: StringData;
  
  constructor(gameService: GameService, public dialog: MatDialog) {
    super(gameService, dialog);
  }

  ngOnInit(): void {
  }

}

import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { GameService } from '../game.service';

@Component({
  selector: 'app-export-dialog',
  templateUrl: './export-dialog.component.html',
  styleUrls: ['./export-dialog.component.scss']
})
export class ExportDialogComponent implements OnInit {
  ruleConfigString: string;

  constructor(
    public dialogRef: MatDialogRef<ExportDialogComponent>,
    private gameService: GameService) {
    this.ruleConfigString = JSON.stringify(gameService.getRoot(), null, 4);
  }

  ngOnInit(): void {
  }

}

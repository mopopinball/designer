import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { GameService } from '../game.service';

@Component({
  selector: 'app-export-dialog',
  templateUrl: './export-dialog.component.html',
  styleUrls: ['./export-dialog.component.scss']
})
export class ExportDialogComponent implements OnInit {
  ruleConfigString: string;
  downloadHref: SafeUrl;

  constructor(
    private domSanatizer: DomSanitizer,
    public dialogRef: MatDialogRef<ExportDialogComponent>,
    private gameService: GameService) {
  }

  ngOnInit(): void {
    this.ruleConfigString = JSON.stringify(this.gameService.getRoot(), null, 4);
    this.downloadHref = this.domSanatizer.bypassSecurityTrustUrl("data:text/json;charset=utf-8," + encodeURIComponent(this.ruleConfigString));
        
  }

}

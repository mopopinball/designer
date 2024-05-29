import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatTreeModule } from '@angular/material/tree';
import { MatCardModule } from '@angular/material/card';

import { CommonModule } from '@angular/common';
import { EngineBuilderService } from './engine-builder.service';
import {
  DesiredOutputState,
  HardwareConfig,
  RuleEngine,
  panthera,
} from '@mopopinball/engine';
import { LampComponent } from './lamp/lamp.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DesignerFilesService } from './designer-files.service';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogModule,
} from '@angular/material/dialog';
import { NewFileDialogComponent } from './new-file-dialog/new-file-dialog.component';
import { ToolbarComponent } from './toolbar/toolbar.component';

@Component({
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    MatTreeModule,
    MatIconModule,
    MatToolbarModule,
    MatFormFieldModule,
    FormsModule,
    MatSidenavModule,
    MatDividerModule,
    MatButtonToggleModule,
    MatListModule,
    MatCardModule,
    MatSelectModule,
    LampComponent,
    ToolbarComponent,
    MatInputModule,
    MatMenuModule,
    MatExpansionModule,
    MatCheckboxModule,
    MatDialogModule,
  ],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  hardwareConfig: HardwareConfig = panthera as unknown as HardwareConfig;

  rootEngine: RuleEngine;
  selectedEngine: RuleEngine;
  allEngines: RuleEngine[] = [];

  deviceSearchTerm = '';

  lamps: DesiredOutputState[] = [];

  step = 0;

  constructor(public files: DesignerFilesService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.files.fileLoaded.subscribe((engine) => this.loadEngine(engine));
  }

  private loadEngine(engine: RuleEngine): void {
    if (!engine) {
      return;
    }
    this.rootEngine = engine;
    this.allEngines = [engine];
    this.setEngine(this.allEngines[0]);
  }

  private setEngine(engine: RuleEngine): void {
    this.selectedEngine = engine;
    this.searchDevices();
  }

  clearDeviceSearch(): void {
    this.deviceSearchTerm = '';
    this.searchDevices();
  }

  searchDevices(): void {
    this.lamps = Array.from(this.selectedEngine.devices.values())
      .filter((l: DesiredOutputState) =>
        l.id.toLowerCase().includes(this.deviceSearchTerm.toLowerCase())
      )
      .sort((a, b) => a.id.localeCompare(b.id));
  }

  setStep(index: number) {
    this.step = index;
  }
}

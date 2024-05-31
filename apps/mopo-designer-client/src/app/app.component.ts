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
import { HardwareConfig, RuleEngine, panthera } from '@mopopinball/engine';
import { LampComponent } from './lamp/lamp.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormsModule, Validators } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DesignerFilesService } from './designer-files.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { AttributesComponent } from './attributes/attributes.component';
import { DevicesComponent } from './devices/devices.component';
import { MatButtonModule } from '@angular/material/button';
import {
  InputDialogComponent,
  InputDialogData,
} from './input-dialog/input-dialog.component';
import { EngineBuilderService } from './engine-builder.service';
import {
  ConfirmDialogComponent,
  ConfirmDialogData,
} from './confirm-dialog/confirm-dialog.component';
import { MopoValidators } from './mopo-validators';

@Component({
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    MatTreeModule,
    MatIconModule,
    MatButtonModule,
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
    AttributesComponent,
    DevicesComponent,
    InputDialogComponent,
    ConfirmDialogComponent,
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

  step = 0;

  constructor(
    public files: DesignerFilesService,
    public dialog: MatDialog,
    private engineBuilder: EngineBuilderService
  ) {}

  ngOnInit(): void {
    this.files.fileLoaded.subscribe((engine) => this.loadEngine(engine));
  }

  private loadEngine(engine: RuleEngine): void {
    if (!engine) {
      return;
    }
    this.rootEngine = engine;
    this.updateAllEngines();
    this.setEngine(this.allEngines[0]);
  }

  private updateAllEngines(): void {
    this.allEngines = Array.from(this.rootEngine.getAllEngines().values());
  }

  setEngine(engine: RuleEngine): void {
    this.selectedEngine = engine;
  }

  setStep(index: number) {
    this.step = index;
  }

  addChild(): void {
    const dialogRef = this.dialog.open<InputDialogComponent, InputDialogData>(
      InputDialogComponent,
      {
        data: {
          title: 'New Engine',
          field: 'Name',
          formControl: new FormControl('', [
            Validators.required,
            MopoValidators.distinct(
              Array.from(this.rootEngine.getAllEngines().keys())
            ),
          ]),
        },
      }
    );

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) {
        return;
      }

      const newEngine = new RuleEngine(result, false, this.selectedEngine);
      this.selectedEngine.children.push(newEngine);

      this.updateAllEngines();

      this.setEngine(newEngine);
    });
  }

  removeEngine(): void {
    const dialogRef = this.dialog.open<
      ConfirmDialogComponent,
      ConfirmDialogData
    >(ConfirmDialogComponent, {
      data: {
        title: `Delete Confirm`,
        body: `Are you sure you want to delete "${this.selectedEngine.id}"?`,
        confirmAction: 'Delete',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) {
        return;
      }

      for (const engine of this.allEngines) {
        if (engine.children.includes(this.selectedEngine)) {
          engine.children.splice(
            engine.children.indexOf(this.selectedEngine),
            1
          );
        }
      }
      this.updateAllEngines();
      this.setEngine(this.rootEngine);
    });
  }
}

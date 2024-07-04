import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EngineBuilderService } from '../engine-builder.service';
import { NewFileDialogComponent } from '../new-file-dialog/new-file-dialog.component';
import { DesignerFilesService } from '../designer-files.service';
import { MatDialog } from '@angular/material/dialog';
import { HardwareConfig, RuleEngine, panthera } from '@mopopinball/engine';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { EngineDiagramDialogComponent } from '../engine-diagram-dialog/engine-diagram-dialog.component';

@Component({
  selector: 'mopo-toolbar',
  standalone: true,
  imports: [
    CommonModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatMenuModule,
    MatToolbarModule,
  ],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss',
})
export class ToolbarComponent {
  hardwareConfig: HardwareConfig = panthera as unknown as HardwareConfig;

  @Input() rootEngine: RuleEngine;
  @Input() selectedEngine: RuleEngine;
  @Input() allEngines: RuleEngine[] = [];
  @Output() selectedEngineChanged = new EventEmitter<RuleEngine>();

  constructor(
    private engineBuilder: EngineBuilderService,
    public files: DesignerFilesService,
    public dialog: MatDialog
  ) {
    // kind of a hack
    setInterval(() => this.saveFile());
  }

  newFile(): void {
    const dialogRef = this.dialog.open(NewFileDialogComponent, {});

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) {
        return;
      }

      const newEngine = this.engineBuilder.create(this.hardwareConfig);
      this.files.save(result, newEngine);
      this.files.load(this.files.selectedFile);
    });
  }

  loadFile(file: string): void {
    this.files.load(file);
  }

  saveFile(): void {
    this.files.save(this.files.selectedFile, this.rootEngine);
  }

  exportJson(): void {
    const json = this.rootEngine.toJSON();
    console.log(json);
  }

  setEngine(engine: RuleEngine): void {
    this.selectedEngineChanged.emit(engine);
  }

  showEngineDiagram(): void {
    const dialogRef = this.dialog.open(EngineDiagramDialogComponent, {
      data: this.rootEngine,
    });
    dialogRef.afterClosed().subscribe((result: RuleEngine) => {
      if (!result) {
        return;
      }

      this.setEngine(result);
    });
  }
}

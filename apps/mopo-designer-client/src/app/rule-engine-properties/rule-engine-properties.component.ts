import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HardwareConfig, RuleEngine } from '@mopopinball/engine';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { FormControl, FormsModule, Validators } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTreeModule } from '@angular/material/tree';
import { DevicesComponent } from '../devices/devices.component';
import { AttributesComponent } from '../attributes/attributes.component';
import { PropertiesComponent } from '../properties/properties.component';
import { DataComponent } from '../data/data.component';
import { RuleSchema } from '@mopopinball/engine/dist/src/system/rule-engine/schema/rule.schema';
import {
  InputDialogComponent,
  InputDialogData,
} from '../input-dialog/input-dialog.component';
import { MopoValidators } from '../mopo-validators';
import { EngineBuilderService } from '../engine-builder.service';

@Component({
  selector: 'mopo-rule-engine-properties',
  standalone: true,
  imports: [
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
    MatInputModule,
    MatMenuModule,
    MatExpansionModule,
    MatCheckboxModule,
    MatDialogModule,
    DevicesComponent,
    AttributesComponent,
    PropertiesComponent,
    DataComponent,
  ],
  templateUrl: './rule-engine-properties.component.html',
  styleUrl: './rule-engine-properties.component.scss',
})
export class RuleEnginePropertiesComponent {
  rootEngine: RuleEngine;
  @Input() selectedEngine: RuleEngine;
  @Input() hardwareConfig: HardwareConfig;
  @Output() addChild = new EventEmitter<void>();
  @Output() removeEngine = new EventEmitter();

  step = 0;

  constructor(
    public dialog: MatDialog,
    private engineBuilder: EngineBuilderService
  ) {}

  onAddChild(): void {
    this.addChild.emit();
  }

  setStep(index: number) {
    this.step = index;
  }

  onClone(): void {
    const dialogRef = this.dialog.open<InputDialogComponent, InputDialogData>(
      InputDialogComponent,
      {
        data: {
          title: 'New Name',
          field: 'Name',
          formControl: new FormControl('', [
            Validators.required,
            MopoValidators.distinct(this.engineBuilder.getAllEngineIds()),
          ]),
        },
      }
    );

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) {
        return;
      }

      const json = this.selectedEngine.toJSON();
      const clone = RuleEngine.load(json, this.selectedEngine.parent);
      clone.id = result;
      this.selectedEngine.parent.children.push(clone);
    });
  }
}

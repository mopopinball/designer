import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RuleEngine } from '@mopopinball/engine';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { InputDialogComponent } from '../input-dialog/input-dialog.component';
import { MopoValidators } from '../mopo-validators';
import { EngineBuilderService } from '../engine-builder.service';

@Component({
  selector: 'mopo-attributes',
  standalone: true,
  imports: [
    CommonModule,
    MatCheckboxModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
  ],
  templateUrl: './attributes.component.html',
  styleUrl: './attributes.component.scss',
})
export class AttributesComponent {
  @Input() selectedEngine: RuleEngine;
  @Input() autoStartDisabled = false;
  @Input() nameDisabled = false;

  constructor(
    public dialog: MatDialog,
    private engineBuilder: EngineBuilderService
  ) {}

  editId(): void {
    const dialogRef = this.dialog.open(InputDialogComponent, {
      data: {
        title: 'Change Engine Id',
        field: 'Id',
        formControl: new FormControl('', [
          Validators.required,
          MopoValidators.distinct(this.engineBuilder.getAllEngineIds()),
        ]),
        value: this.selectedEngine.id
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) {
        return;
      }

      this.selectedEngine.id = result;
    });
  }
}

import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogModule,
} from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

export interface InputDialogData {
  title: string;
  field: string;
}

@Component({
  selector: 'mopo-input-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
  ],
  templateUrl: './input-dialog.component.html',
  styleUrl: './input-dialog.component.scss',
})
export class InputDialogComponent {
  fileName = '';

  constructor(
    public dialogRef: MatDialogRef<InputDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: InputDialogData
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}

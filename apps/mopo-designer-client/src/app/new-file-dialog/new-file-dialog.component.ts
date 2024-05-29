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

@Component({
  selector: 'mopo-new-file-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatInputModule, FormsModule],
  templateUrl: './new-file-dialog.component.html',
  styleUrl: './new-file-dialog.component.scss',
})
export class NewFileDialogComponent {
  fileName = '';

  constructor(public dialogRef: MatDialogRef<NewFileDialogComponent>) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}

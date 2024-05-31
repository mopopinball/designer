import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RuleEngine } from '@mopopinball/engine';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

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
  ],
  templateUrl: './attributes.component.html',
  styleUrl: './attributes.component.scss',
})
export class AttributesComponent {
  @Input() selectedEngine: RuleEngine;
  @Input() autoStartDisabled = false;
  @Input() nameDisabled = false;

  // todo: support id edit via input dialog with distinct id valitator
}

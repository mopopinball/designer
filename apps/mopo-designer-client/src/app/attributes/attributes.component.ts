import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RuleEngine } from '@mopopinball/engine';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'mopo-attributes',
  standalone: true,
  imports: [
    CommonModule,
    MatCheckboxModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
  ],
  templateUrl: './attributes.component.html',
  styleUrl: './attributes.component.scss',
})
export class AttributesComponent {
  @Input() selectedEngine: RuleEngine;
}

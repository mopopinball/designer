import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomReactWrapperComponent } from '../react-diagram';
import { MatToolbar, MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { RuleEngine } from '@mopopinball/engine';

@Component({
  selector: 'mopo-triggers',
  standalone: true,
  imports: [
    CommonModule,
    CustomReactWrapperComponent,
    MatMenuModule,
    MatToolbarModule,
    MatButtonModule,
  ],
  templateUrl: './triggers.component.html',
  styleUrl: './triggers.component.scss',
})
export class TriggersComponent implements OnInit {
  @Input() engine: RuleEngine;

  ngOnInit(): void {
    // t
  }
}

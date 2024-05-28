import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  DesiredOutputState,
} from '@mopopinball/engine';
import {
  MatButtonToggleChange,
  MatButtonToggleModule,
} from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'mopo-lamp',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './lamp.component.html',
  styleUrl: './lamp.component.scss',
})
export class LampComponent {
  @Input() state: DesiredOutputState;

  setInitialState(evt: MatButtonToggleChange): void {
    this.state.setInitialState(evt.value);
  }

  setBlinkState(evt): void {
    this.state.blinkRate = parseInt(evt.target.value);
  }
}

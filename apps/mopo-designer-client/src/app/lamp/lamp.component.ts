import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DesiredOutputState, DesiredOutputStateType } from '@mopopinball/engine';
import {MatButtonToggleChange, MatButtonToggleModule} from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'mopo-lamp',
  standalone: true,
  imports: [CommonModule, MatButtonToggleModule, MatCardModule, MatIconModule],
  templateUrl: './lamp.component.html',
  styleUrl: './lamp.component.scss',
})
export class LampComponent {
  @Input() state: DesiredOutputState;

  setInitialState(evt: MatButtonToggleChange): void {
    this.state.setInitialState(evt.value);
  }
}

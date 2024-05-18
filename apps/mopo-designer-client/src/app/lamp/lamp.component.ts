import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DesiredOutputState } from '@mopopinball/engine';
import {MatButtonToggleModule} from '@angular/material/button-toggle';


@Component({
  selector: 'mopo-lamp',
  standalone: true,
  imports: [CommonModule, MatButtonToggleModule],
  templateUrl: './lamp.component.html',
  styleUrl: './lamp.component.scss',
})
export class LampComponent {
  @Input() state: DesiredOutputState;
}

import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatDividerModule} from '@angular/material/divider';
import {MatListModule} from '@angular/material/list';
import {MatSelectModule} from '@angular/material/select';
import {MatIconModule} from '@angular/material/icon';

import { RuleEngine } from '@mopopinball/engine/src/system/rule-engine/rule-engine';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [RouterModule, CommonModule, MatIconModule, MatToolbarModule, MatSidenavModule, MatDividerModule, MatListModule, MatSelectModule],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  engines: RuleEngine[] = [
    new RuleEngine('root', true, null),
    new RuleEngine('attract', true, null)
  ];
  engine: RuleEngine = null;  
}

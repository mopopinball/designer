import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatTreeModule } from '@angular/material/tree';
import { MatCardModule } from '@angular/material/card';

import { CommonModule } from '@angular/common';
import { EngineBuilderService } from './engine-builder.service';
import { HardwareConfig, RuleEngine, panthera } from '@mopopinball/engine';
import { LampComponent } from './lamp/lamp.component';

@Component({
  standalone: true,
  imports: [RouterModule, CommonModule, MatTreeModule, MatIconModule, MatToolbarModule, MatSidenavModule, MatDividerModule
    , MatListModule, MatCardModule, MatSelectModule, LampComponent],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  hardwareConfig: HardwareConfig = panthera as unknown as HardwareConfig;

  engines: RuleEngine[] = [

  ];
  engine: RuleEngine = null;

  constructor(private engineBuilder: EngineBuilderService) { }

  ngOnInit(): void {
    this.engines = [this.engineBuilder.create(this.hardwareConfig)];
    this.engine = this.engines[0];
  }

  setEngine(engine: RuleEngine): void {
    this.engine = engine;
  }
}

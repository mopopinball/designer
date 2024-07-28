import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HardwareConfig, RuleEngine } from '@mopopinball/engine';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTreeModule } from '@angular/material/tree';
import { DevicesComponent } from '../devices/devices.component';
import { AttributesComponent } from '../attributes/attributes.component';
import { PropertiesComponent } from '../properties/properties.component';

@Component({
  selector: 'mopo-rule-engine-properties',
  standalone: true,
  imports: [
    CommonModule,
    MatTreeModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatFormFieldModule,
    FormsModule,
    MatSidenavModule,
    MatDividerModule,
    MatButtonToggleModule,
    MatListModule,
    MatCardModule,
    MatSelectModule,
    MatInputModule,
    MatMenuModule,
    MatExpansionModule,
    MatCheckboxModule,
    MatDialogModule,
    DevicesComponent,
    AttributesComponent,
    PropertiesComponent
  ],
  templateUrl: './rule-engine-properties.component.html',
  styleUrl: './rule-engine-properties.component.scss',
})
export class RuleEnginePropertiesComponent {
  rootEngine: RuleEngine;
  @Input() selectedEngine: RuleEngine;
  @Input() hardwareConfig: HardwareConfig;
  @Output() addChild = new EventEmitter<void>();
  @Output() removeEngine = new EventEmitter<void>();

  step = 0;

  onAddChild(): void {
    this.addChild.emit();
  }

  onRemoveEngine(): void {
    this.removeEngine.emit();
  }

  setStep(index: number) {
    this.step = index;
  }
}

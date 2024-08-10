import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  NO_ERRORS_SCHEMA,
  OnInit,
  ViewChild,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatTreeModule } from '@angular/material/tree';
import { MatCardModule } from '@angular/material/card';

import { CommonModule } from '@angular/common';
import {
  Action,
  HardwareConfig,
  RuleEngine,
  panthera,
} from '@mopopinball/engine';
import { LampComponent } from './lamp/lamp.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormsModule, Validators } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DesignerFilesService } from './designer-files.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { AttributesComponent } from './attributes/attributes.component';
import { DevicesComponent } from './devices/devices.component';
import { MatButtonModule } from '@angular/material/button';
import {
  InputDialogComponent,
  InputDialogData,
} from './input-dialog/input-dialog.component';
import { EngineBuilderService } from './engine-builder.service';
import {
  ConfirmDialogComponent,
  ConfirmDialogData,
} from './confirm-dialog/confirm-dialog.component';
import { MopoValidators } from './mopo-validators';

import { TriggersComponent } from './triggers/triggers.component';
import { Trigger } from '@mopopinball/engine/dist/src/system/rule-engine/actions/trigger';
import { RuleEnginePropertiesComponent } from './rule-engine-properties/rule-engine-properties.component';
import { SwitchTriggerPropertiesComponent } from './switch-trigger-properties/switch-trigger-properties.component';
import { SwitchTrigger } from '@mopopinball/engine/dist/src/system/rule-engine/actions/switch-trigger';
import { AsPipe } from './as.pipe';
import { SimulationComponent } from './simulation/simulation.component';
import { DeviceAction } from '@mopopinball/engine/dist/src/system/rule-engine/actions/device-action';
import { DeviceActionPropertiesComponent } from './device-action-properties/device-action-properties.component';
import { DataAction } from '@mopopinball/engine/dist/src/system/rule-engine/actions/data-action';
import { StateActionPropertiesComponent } from './state-action-properties/state-action-properties.component';
import { StateAction } from '@mopopinball/engine/dist/src/system/rule-engine/actions/state-action';

@Component({
  standalone: true,
  imports: [
    RouterModule,
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
    MatSelectModule,
    LampComponent,
    ToolbarComponent,
    AttributesComponent,
    DevicesComponent,
    InputDialogComponent,
    ConfirmDialogComponent,
    TriggersComponent,
    RuleEnginePropertiesComponent,
    SwitchTriggerPropertiesComponent,
    AsPipe,
    SimulationComponent,
    DeviceActionPropertiesComponent,
    StateActionPropertiesComponent,
  ],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  schemas: [NO_ERRORS_SCHEMA],
})
export class AppComponent implements OnInit {
  @ViewChild('drawer', { static: true }) simulation!: MatSidenav;
  @ViewChild(TriggersComponent, { static: true })
  triggersComponent: TriggersComponent;
  hardwareConfig: HardwareConfig = panthera as unknown as HardwareConfig;

  SwitchTrigger: SwitchTrigger;
  DeviceAction: DeviceAction;
  StateAction: StateAction;
  DataAction: DataAction;

  rootEngine: RuleEngine;
  selectedEngine: RuleEngine;
  allEngines: RuleEngine[] = [];

  selectedTrigger: Trigger;
  selectedAction: Action;

  constructor(
    public files: DesignerFilesService,
    public dialog: MatDialog,
    private engineBuilder: EngineBuilderService
  ) {}

  ngOnInit(): void {
    this.files.fileLoaded.subscribe((engine) => this.loadEngine(engine));
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.ctrlKey && event.key === 's') {
      event.preventDefault();
      this.files.save(this.files.selectedFile, this.rootEngine);
    } else if (event.ctrlKey && event.key === 'r') {
      event.preventDefault();
      this.simulation.open();
    }
  }

  private loadEngine(engine: RuleEngine): void {
    if (!engine) {
      return;
    }
    this.rootEngine = engine;
    this.updateAllEngines();
    this.setEngine(this.allEngines[0]);
    this.engineBuilder.rootEngine = this.rootEngine;
  }

  private updateAllEngines(): void {
    this.allEngines = Array.from(this.rootEngine.getAllEngines().values());
  }

  setEngine(engine: RuleEngine): void {
    this.selectedEngine = engine;
    this.selectedAction = null;
    this.selectedTrigger = null;
  }

  addChild(): void {
    const dialogRef = this.dialog.open<InputDialogComponent, InputDialogData>(
      InputDialogComponent,
      {
        data: {
          title: 'New Engine',
          field: 'Name',
          formControl: new FormControl('', [
            Validators.required,
            MopoValidators.distinct(this.engineBuilder.getAllEngineIds()),
          ]),
        },
      }
    );

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) {
        return;
      }

      const newEngine = this.engineBuilder.create(
        result,
        this.selectedEngine,
        this.hardwareConfig
      );
      this.selectedEngine.children.push(newEngine);

      this.updateAllEngines();

      this.setEngine(newEngine);
    });
  }

  removeEngine(): void {
    const dialogRef = this.dialog.open<
      ConfirmDialogComponent,
      ConfirmDialogData
    >(ConfirmDialogComponent, {
      data: {
        title: `Delete Confirm`,
        body: `Are you sure you want to delete "${this.selectedEngine.id}"?`,
        confirmAction: 'Delete',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) {
        return;
      }

      for (const engine of this.allEngines) {
        if (engine.children.includes(this.selectedEngine)) {
          engine.children.splice(
            engine.children.indexOf(this.selectedEngine),
            1
          );
        }
      }
      this.updateAllEngines();
      this.setEngine(this.rootEngine);
    });
  }

  onTriggerChanged(trigger: Trigger): void {
    this.selectedTrigger = trigger;
    this.selectedAction = null;
  }

  onActionChanged(action: Action): void {
    this.selectedTrigger = null;
    this.selectedAction = action;
  }

  onTriggerDetailsChange(): void {
    this.triggersComponent.render();
  }

  onActionDetailsChange(): void {
    this.triggersComponent.render();
  }

  removeTrigger(): void {
    const dialogRef = this.dialog.open<
      ConfirmDialogComponent,
      ConfirmDialogData
    >(ConfirmDialogComponent, {
      data: {
        title: `Delete Confirm`,
        body: `Are you sure you want to delete the trigger "${this.selectedTrigger}"?`,
        confirmAction: 'Delete',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) {
        return;
      }

      const index = this.selectedEngine.triggers.indexOf(
        this.selectedTrigger as never
      );
      this.selectedEngine.triggers.splice(index, 1);
      this.selectedTrigger = null;
      this.onTriggerDetailsChange();
    });
  }

  removeAction(): void {
    const dialogRef = this.dialog.open<
      ConfirmDialogComponent,
      ConfirmDialogData
    >(ConfirmDialogComponent, {
      data: {
        title: `Delete Confirm`,
        body: `Are you sure you want to delete the action "${this.selectedAction}"?`,
        confirmAction: 'Delete',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) {
        return;
      }

      // const unassignedIndex = this.unassignedActions.indexOf(
      //   this.selectedAction
      // );
      // if (unassignedIndex >= 0) {
      //   this.unassignedActions.splice(unassignedIndex, 1);
      // }

      for (const trigger of this.selectedEngine.triggers) {
        const index = trigger.actions.indexOf(this.selectedAction as never);
        if (index >= 0) {
          trigger.actions.splice(index, 1);
        }
      }
      this.selectedAction = null;
      this.onActionDetailsChange();
    });
  }
}

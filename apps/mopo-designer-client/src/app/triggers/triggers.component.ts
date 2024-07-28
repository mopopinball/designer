import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomReactWrapperComponent } from '../react-diagram/react-diagram';
import { MatToolbar, MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { HardwareConfig, RuleEngine } from '@mopopinball/engine';
import createEngine, {
  DefaultLinkModel,
  DefaultNodeModel,
  DiagramEngine,
  DiagramModel,
  NodeModel,
} from '@projectstorm/react-diagrams';
import { SwitchTrigger } from '@mopopinball/engine/dist/src/system/rule-engine/actions/switch-trigger';
import { Trigger } from '@mopopinball/engine/dist/src/system/rule-engine/actions/trigger';
import { DataAction } from '@mopopinball/engine/dist/src/system/rule-engine/actions/data-action';
import { TriggerNodeModel } from '../node-models/trigger-node-model';
import { ActionNodeModel } from '../node-models/action-node-model';
import { Action } from '@mopopinball/engine/dist/src/system/rule-engine/actions/action';
import { v4 as uuidv4 } from 'uuid';
import {
  ConfirmDialogComponent,
  ConfirmDialogData,
} from '../confirm-dialog/confirm-dialog.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DeviceAction } from '@mopopinball/engine/dist/src/system/rule-engine/actions/device-action';
import { MatIconModule } from '@angular/material/icon';
import { DesignerAttributes } from '@mopopinball/engine/dist/src/system/rule-engine/designer-attributes';

@Component({
  selector: 'mopo-triggers',
  standalone: true,
  imports: [
    CommonModule,
    CustomReactWrapperComponent,
    MatMenuModule,
    MatToolbarModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
  ],
  templateUrl: './triggers.component.html',
  styleUrl: './triggers.component.scss',
})
export class TriggersComponent implements OnInit, OnChanges {
  @Input() engine: RuleEngine;
  @Input() hardwareConfig: HardwareConfig;
  @Output() triggerChanged = new EventEmitter<Trigger>();
  @Output() actionChanged = new EventEmitter<Action>();

  diagramEngine: DiagramEngine;

  unassignedActions: Action[] = [];
  selectedTrigger: Trigger;
  selectedAction: Action;

  get diagramModel(): DiagramModel {
    return this.diagramEngine.getModel();
  }

  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {
    const engine = createEngine();
    this.diagramEngine = engine;
    this.render();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.render();
  }

  addSwitchTrigger(): void {
    const trigger = new SwitchTrigger(null);
    trigger.designer = this.getDefaultTriggerDesigner();
    this.engine.triggers.push(trigger);

    this.render();
  }

  addDataAction(): void {
    const dataAction = new DataAction(null);
    this.addAction(dataAction);
  }

  addDeviceAction(): void {
    const deviceAction = new DeviceAction(null);
    this.addAction(deviceAction);
  }

  private addAction(action: Action): void {
    action.designer = this.getDefaultActionDesigner();
    this.unassignedActions.push(action);

    this.render();
  }

  private getDefaultTriggerDesigner(): DesignerAttributes {
    return {
      id: uuidv4(),
      x: 50,
      y: 50,
    };
  }

  private getDefaultActionDesigner(): DesignerAttributes {
    return {
      id: uuidv4(),
      x: 100,
      y: 100,
    };
  }

  render(): void {
    if (!this.diagramEngine) {
      return;
    }
    this.diagramEngine.setModel(new DiagramModel());

    // listen for linking a trigger to a action
    this.diagramModel.registerListener({
      eventDidFire: (a) => {
        if (a['isCreated'] && a.function === 'linksUpdated') {
          const link: DefaultLinkModel = a['link'];
          link.registerListener({
            eventDidFire: (a2) => {
              if (a2.firing && a2.function === 'targetPortChanged') {
                const e: DefaultLinkModel = a2['entity'];
                if (e.getSourcePort() && e.getTargetPort()) {
                  const sourceTrigger = e
                    .getSourcePort()
                    .getParent() as TriggerNodeModel<Trigger>;
                  const targetAction = e
                    .getTargetPort()
                    .getParent() as ActionNodeModel<DataAction>;

                  sourceTrigger.trigger.actions.push(targetAction.action);
                }
              }
            },
          });
        }
      },
    });

    for (const trigger of this.engine.triggers) {
      const triggerModel = this.renderTrigger(trigger);
      for (const a of trigger.actions) {
        const actionModel = this.renderAction(a);

        const link = triggerModel
          .getOutPorts()[0]
          .link(actionModel.getInPorts()[0]);
        this.diagramModel.addLink(link);
      }
    }

    for (const ua of this.unassignedActions) {
      this.renderAction(ua);
    }

    this.diagramEngine.repaintCanvas();
  }

  private renderTrigger<T extends Trigger>(trigger: T): TriggerNodeModel<T> {
    const triggerModel = new TriggerNodeModel(trigger, this.hardwareConfig);
    if (!trigger.designer) {
      trigger.designer = this.getDefaultTriggerDesigner();
    }

    triggerModel.onSelected((selectedTrigger) => {
      this.selectTrigger(selectedTrigger);
    });

    this.diagramModel.addNode(triggerModel);

    return triggerModel;
  }

  private selectTrigger(trigger: Trigger): void {
    this.selectedTrigger = trigger;
    this.triggerChanged.emit(trigger);
  }

  private renderAction<A extends Action>(a: A): ActionNodeModel<A> {
    let actionModel: ActionNodeModel<A>;
    if (!a.designer) {
      a.designer = this.getDefaultActionDesigner();
    }

    actionModel = this.diagramModel
      .getNodes()
      .find(
        (n) => a.designer.id === (n as ActionNodeModel<A>).getID()
      ) as ActionNodeModel<A>;

    if (!actionModel) {
      actionModel = new ActionNodeModel<A>(a, this.hardwareConfig);
    }

    actionModel.onSelected((selectedAction) => {
      this.selectAction(selectedAction);
    });

    this.diagramModel.addNode(actionModel);
    return actionModel;
  }

  private selectAction(action: Action): void {
    this.selectedAction = action;
    this.actionChanged.emit(action);
  }

  deleteSelectedTrigger(): void {
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

      const index = this.engine.triggers.indexOf(this.selectedTrigger as never);
      this.engine.triggers.splice(index, 1);
      this.selectedTrigger = null;
      this.render();
    });
  }

  deleteSelectedAction(): void {
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

      const unassignedIndex = this.unassignedActions.indexOf(
        this.selectedAction
      );
      if (unassignedIndex >= 0) {
        this.unassignedActions.splice(unassignedIndex, 1);
      }

      for (const trigger of this.engine.triggers) {
        const index = trigger.actions.indexOf(this.selectedAction as never);
        if (index >= 0) {
          trigger.actions.splice(index, 1);
        }
      }
      this.selectedAction = null;
      this.render();
    });
  }
}

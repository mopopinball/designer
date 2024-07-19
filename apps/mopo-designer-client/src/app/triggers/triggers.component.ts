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
import { RuleEngine } from '@mopopinball/engine';
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
import { link } from 'fs';
import { ActionNodeModel } from '../node-models/action-node-model';
import { Action } from '@mopopinball/engine/dist/src/system/rule-engine/actions/action';

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
export class TriggersComponent implements OnInit, OnChanges {
  @Input() engine: RuleEngine;
  @Output() triggerChanged = new EventEmitter<Trigger>();

  diagramEngine: DiagramEngine;

  unassignedActions: Action[] = [];

  get diagramModel(): DiagramModel {
    return this.diagramEngine.getModel();
  }

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
    this.engine.triggers.push(trigger);

    this.render();
  }

  addDataAction(): void {
    const dataAction = new DataAction('test');
    this.unassignedActions.push(dataAction);

    this.render();
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
    let triggerModel: TriggerNodeModel<T>;
    if (trigger instanceof SwitchTrigger) {
      triggerModel = new TriggerNodeModel(trigger, {
        name: 'Switch Trigger',
        color: 'rgb(0,192,255)',
      });
      if (trigger.switchId) {
        if (trigger.holdIntervalMs) {
          triggerModel.addOutPort(
            `${trigger.switchId} (${trigger.holdIntervalMs}ms)`
          );
        } else {
          triggerModel.addOutPort(trigger.switchId);
        }
      } else {
        triggerModel.addOutPort('(Select switch)');
      }
    } else {
      throw new Error('Not implemented');
    }

    triggerModel.registerListener({
      eventDidFire: (a) => {
        if (a['isSelected'] && a['function'] === 'selectionChanged') {
          this.triggerChanged.emit(trigger);
        } else if (!a['isSelected'] && a['function'] === 'selectionChanged') {
          this.triggerChanged.emit(null);
        }
      },
    });

    this.diagramModel.addNode(triggerModel);

    return triggerModel;
  }

  private renderAction<A extends Action>(a: A): ActionNodeModel<A> {
    let actionModel: ActionNodeModel<A>;
    if (a instanceof DataAction) {
      // have we already rendered it? Match based on datakey

      actionModel = this.diagramModel
        .getNodes()
        .find(
          (n) =>
            n instanceof ActionNodeModel &&
            n.action instanceof DataAction &&
            a.dataKey === a.dataKey
        ) as ActionNodeModel<A>;

      if (!actionModel) {
        actionModel = new ActionNodeModel<A>(a, {
          name: `Data Action - ${a.dataKey}`,
          color: 'rgb(0,292,255)',
        });
        actionModel.addInPort(a.expression ?? '(Enter expression)');
      }
    } else {
      throw new Error('Not implemented');
    }

    this.diagramModel.addNode(actionModel);
    return actionModel;
  }
}

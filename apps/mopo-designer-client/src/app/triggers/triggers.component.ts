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

  ngOnInit(): void {
    //1) setup the diagram engine
    const engine = createEngine();
    //2) setup the diagram model
    const model = new DiagramModel();
    //3-A) create a default node
    // const node1 = new DefaultNodeModel({
    //   name: 'Trigger Node 1',
    //   color: 'rgb(0,192,255)',
    // });
    // node1.setPosition(100, 100);
    // const port1 = node1.addOutPort('Out');
    // //3-B) create another default node
    // const node2 = new DefaultNodeModel('Node 2', 'rgb(192,255,0)');
    // const port2 = node2.addInPort('In');
    // node2.setPosition(400, 100);
    // // link the ports
    // const link1 = port1.link<DefaultLinkModel>(port2);
    // // link1.getOptions().testName = 'Test';
    // // link1.addLabel('Hello World!');
    // //4) add the models to the root graph
    // model.addAll(node1, node2, link1);
    //5) load model into engine
    engine.setModel(model);

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

  render(): void {
    for (const node of this.diagramEngine.getModel().getNodes()) {
      this.diagramEngine.getModel().removeNode(node);
    }

    for (const trigger of this.engine.triggers) {
      let node: DefaultNodeModel;
      if (trigger instanceof SwitchTrigger) {
        node = new DefaultNodeModel({
          name: 'Switch Trigger',
          color: 'rgb(0,192,255)',
        });
        node.addOutPort(trigger.switchId ?? '(Select Switch)');
      }

      node.registerListener({
        eventDidFire: (a) => {
          if (a['isSelected'] && a['function'] === 'selectionChanged') {
            this.triggerChanged.emit(trigger);
          } else if (!a['isSelected'] && a['function'] === 'selectionChanged') {
            this.triggerChanged.emit(null);
          }
        },
      });
      this.diagramEngine.getModel().addNode(node);
    }

    this.diagramEngine.repaintCanvas();
  }
}

import { Action } from '@mopopinball/engine/dist/src/system/rule-engine/actions/action';
import {
  DefaultNodeModel,
  DefaultNodeModelOptions,
} from '@projectstorm/react-diagrams';
import { Point } from '@projectstorm/geometry';
import { DataAction } from '@mopopinball/engine/dist/src/system/rule-engine/actions/data-action';
import { DeviceAction } from '@mopopinball/engine/dist/src/system/rule-engine/actions/device-action';
import { MopoNodeModel } from './mopo-node-model';

export class ActionNodeModel<A extends Action> extends MopoNodeModel<A> {
  model: A;

  get action(): A {
    return this.model;
  }

  constructor(action: A) {
    super({
      name: 'Action',
      color: 'rgb(0,292,255)',
      id: action.designer.id,
      position: new Point(action.designer.x, action.designer.y),
    });
    this.model = action;
    this.options.name = this.getTitle();

    this.addActionInPort();

    this.registerPositionListener();
  }

  private getTitle(): string {
    // https://stackoverflow.com/a/54286277
    switch (true) {
      case this.action instanceof DataAction:
        return `Data Action - ${this.action.dataKey}`;
      case this.action instanceof DeviceAction:
        return `Device Action - ${this.action.state?.id}`;
      default:
        return 'Action';
    }
  }

  private addActionInPort(): void {
    // https://stackoverflow.com/a/54286277
    switch (true) {
      case this.action instanceof DataAction: {
        this.addInPort(this.action.expression ?? '(Enter expression)');
      }
    }
  }
}

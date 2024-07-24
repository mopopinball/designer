import { Action } from '@mopopinball/engine/dist/src/system/rule-engine/actions/action';
import {
  DefaultNodeModel,
  DefaultNodeModelOptions,
} from '@projectstorm/react-diagrams';

export class ActionNodeModel<A extends Action> extends DefaultNodeModel {
  constructor(
    public readonly action: A,
    options?: DefaultNodeModelOptions
  ) {
    super(options);

    this.registerListener({
      eventDidFire: (a2) => {
        if(a2.function === 'positionChanged') {
          this.action.designer.x = this.position.x;
          this.action.designer.y = this.position.y;
        }
      },
    });
  }
}

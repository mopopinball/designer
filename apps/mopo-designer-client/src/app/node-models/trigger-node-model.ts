import { Trigger } from '@mopopinball/engine/dist/src/system/rule-engine/actions/trigger';
import {
  DefaultNodeModel,
  DefaultNodeModelOptions,
} from '@projectstorm/react-diagrams';

export class TriggerNodeModel<T extends Trigger> extends DefaultNodeModel {
  constructor(
    public readonly trigger: T,
    options?: DefaultNodeModelOptions
  ) {
    super(options);

    this.registerListener({
      eventDidFire: (a2) => {
        if(a2.function === 'positionChanged') {
          this.trigger.designer.x = this.position.x;
          this.trigger.designer.y = this.position.y;
        }
      },
    });
  }
}

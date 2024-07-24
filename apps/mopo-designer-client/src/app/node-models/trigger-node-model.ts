import { Trigger } from '@mopopinball/engine/dist/src/system/rule-engine/actions/trigger';
import { DefaultNodeModelOptions } from '@projectstorm/react-diagrams';
import { MopoNodeModel } from './mopo-node-model';
import { SwitchTrigger } from '@mopopinball/engine';
import { Point } from '@projectstorm/geometry';

export class TriggerNodeModel<T extends Trigger> extends MopoNodeModel<T> {
  public readonly model: T;

  get trigger(): T {
    return this.model;
  }

  constructor(trigger: T) {
    super({
      name: 'Trigger',
      color: 'rgb(0,192,255)',
      id: trigger.designer.id,
      position: new Point(trigger.designer.x, trigger.designer.y),
    });
    this.options.name = this.getTitle();
    this.model = trigger;

    this.addTriggerOutPort();

    this.registerPositionListener();
  }

  private getTitle(): string {
    switch (true) {
      case this.trigger instanceof SwitchTrigger: {
        return 'Switch Trigger';
      }
      default:
        return 'Trigger';
    }
  }

  private addTriggerOutPort(): void {
    switch (true) {
      case this.trigger instanceof SwitchTrigger: {
        if (this.trigger.switchId) {
          if (this.trigger.holdIntervalMs) {
            this.addOutPort(
              `${this.trigger.switchId} (${this.trigger.holdIntervalMs}ms)`
            );
          } else {
            this.addOutPort(this.trigger.switchId);
          }
        } else {
          this.addOutPort('(Select switch)');
        }
      }
    }
  }
}

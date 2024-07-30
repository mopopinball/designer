import { Trigger } from '@mopopinball/engine/dist/src/system/rule-engine/actions/trigger';
import { MopoNodeModel } from './mopo-node-model';
import { HardwareConfig, SwitchTrigger } from '@mopopinball/engine';
import { Point } from '@projectstorm/geometry';

export class TriggerNodeModel<T extends Trigger> extends MopoNodeModel<T> {
  public readonly model: T;

  get trigger(): T {
    return this.model;
  }

  constructor(trigger: T, private readonly hardwareConfig: HardwareConfig) {
    super({
      name: '',
      color: 'rgb(0,192,255)',
      id: trigger.designer.id,
      position: new Point(trigger.designer.x, trigger.designer.y),
    });
    this.model = trigger;
    this.options.name = this.getTitle();

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
          const sw = this.hardwareConfig.devices.switches[this.trigger.switchId];
          const swName = `${sw.name} (#${sw.number})`;
          if (this.trigger.holdIntervalMs) {
            this.addOutPort(
              `${swName} (${this.trigger.holdIntervalMs}ms)`
            );
          } else {
            this.addOutPort(swName);
          }
        } else {
          this.addOutPort('(Select switch)');
        }
      }
    }
  }
}

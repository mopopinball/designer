import { Action } from '@mopopinball/engine/dist/src/system/rule-engine/actions/action';
import {
  DefaultNodeModel,
  DefaultNodeModelOptions,
} from '@projectstorm/react-diagrams';
import { Point } from '@projectstorm/geometry';
import { DataAction } from '@mopopinball/engine/dist/src/system/rule-engine/actions/data-action';
import { DeviceAction } from '@mopopinball/engine/dist/src/system/rule-engine/actions/device-action';
import { MopoNodeModel } from './mopo-node-model';
import { HardwareConfig, Light, LightState } from '@mopopinball/engine';
import { StateAction } from '@mopopinball/engine/dist/src/system/rule-engine/actions/state-action';

export class ActionNodeModel<A extends Action> extends MopoNodeModel<A> {
  model: A;

  get action(): A {
    return this.model;
  }

  constructor(action: A, private readonly hardwareConfig: HardwareConfig) {
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
      case this.action instanceof DeviceAction: {
        const type = this.action.state?.forLight ? 'Lamp' : 'Device';
        const deviceName =
          this.hardwareConfig.devices.lamps[this.action.state?.id]?.name ??
          this.hardwareConfig.devices.coils[this.action.state?.id]?.name;
        return `${type} Action - ${deviceName}`;
      }
      case this.action instanceof StateAction: {
        return 'State Action';
      }
      default:
        return 'Action';
    }
  }

  private addActionInPort(): void {
    // https://stackoverflow.com/a/54286277
    switch (true) {
      case this.action instanceof DataAction: {
        this.addInPort(this.action.expression ?? '(Enter expression)');
        break;
      }
      case this.action instanceof DeviceAction: {
        if (this.action.state?.forLight) {
          switch (this.action?.state.lightState) {
            case LightState.ON:
              this.addInPort('On');
              break;
            case LightState.OFF:
              this.addInPort('Off');
              break;
            case 'BLINK' as never:
              this.addInPort(`Blink at ${this.action.state.blinkRate}ms`);
          }
        } else if (this.action.state?.forCoil) {
          if (this.action.state.coilState) {
            this.addInPort('On');
          } else {
            this.addInPort('Off');
          }
        }

        break;
      }
      case this.action instanceof StateAction: {
        if (this.action.startTargetId && this.action.stopTargetId) {
          this.addInPort(
            `Start ${this.action.startTargetId}; Stop ${this.action.stopTargetId}`
          );
        } else if (this.action.startTargetId) {
          this.addInPort(`Start ${this.action.startTargetId}`);
        } else if (this.action.stopTargetId) {
          this.addInPort(`Stop ${this.action.stopTargetId}`);
        } else {
          this.addInPort(`(Select Start/Stop states)`);
        }
      }
    }
  }
}

import { Point } from '@angular/cdk/drag-drop';
import { OutputDeviceType } from '@mopopinball/engine';
import { OutputDevice } from '@mopopinball/engine/dist/src/system/devices/output-device';

export class SimulationOutputDevice {
  icon: string;
  number: number;

  get id(): string {
    return this.outputDevice.id;
  }

  get type(): OutputDeviceType {
    return this.outputDevice.type;
  }

  get isOn(): boolean {
    return this.outputDevice.isOn;
  }

  constructor(
    private readonly outputDevice: OutputDevice,
    public position: Point
  ) {
    this.number = outputDevice.getNumber();

    switch (outputDevice.type) {
      case OutputDeviceType.LIGHT:
        this.icon = 'lightbulb';
    }
  }

  update(): void {
    this.outputDevice.update();
  }
}

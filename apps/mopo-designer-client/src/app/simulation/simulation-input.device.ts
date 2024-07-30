import { Point } from '@angular/cdk/drag-drop';
import { PlayfieldSwitch } from '@mopopinball/engine';

export class SimulationInputDevice {
  icon = 'compress';

  get id(): string {
    return this.sw.id;
  }

  get number(): number {
    return this.sw.number;
  }

  constructor(private readonly sw: PlayfieldSwitch, public position: Point) {}
}

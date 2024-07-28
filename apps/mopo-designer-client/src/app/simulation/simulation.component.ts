import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import {
  CdkDrag,
  CdkDragEnd,
  CdkDragRelease,
  Point,
} from '@angular/cdk/drag-drop';
import {
  DesiredOutputState,
  HardwareConfig,
  HardwareLampSchema,
  LampRole,
  LightState,
  OutputDeviceType,
  PlayfieldLamp,
  RuleEngine,
} from '@mopopinball/engine';
import { GameClock } from '@mopopinball/engine/dist/src/system/game-clock';
import { OutputDevice } from '@mopopinball/engine/dist/src/system/devices/output-device';
import { MatBadgeModule } from '@angular/material/badge';
import { SimulationOutputDevice } from './simulation-output-device';
import { DragDropModule } from '@angular/cdk/drag-drop';

@Component({
  selector: 'mopo-simulation',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatBadgeModule, CdkDrag],
  templateUrl: './simulation.component.html',
  styleUrl: './simulation.component.scss',
})
export class SimulationComponent implements OnInit, OnDestroy {
  @Input() hardwareConfig: HardwareConfig;
  @Input() rootEngine: RuleEngine;

  clock: GameClock = GameClock.getInstance();

  interval: NodeJS.Timer;
  devices: DesiredOutputState[] = [];

  // lamp ids to lamps
  private lamps: Map<string, PlayfieldLamp> = new Map();

  // all devices (lamps, coils, sounds, ...) not by id.
  outputDevices: SimulationOutputDevice[] = [];

  ngOnInit(): void {
    this.setup();
    this.interval = setInterval(() => this.loop(), 100);
  }

  private setup(): void {
    this.lamps.clear();
    Object.entries(this.hardwareConfig.devices.lamps)
      .filter((lampEntry) => lampEntry[1].role === LampRole.LAMP)
      .forEach((lampEntry) => {
        const lamp = new PlayfieldLamp(
          lampEntry[0],
          lampEntry[1].number,
          lampEntry[1].role,
          lampEntry[1].name,
          LightState.OFF
        );
        this.lamps.set(lampEntry[0], lamp);
      });

    this.outputDevices = this.outputDevices.concat(
      Array.from(this.lamps.values()).map(
        (l) =>
          new SimulationOutputDevice(
            l,
            this.getSavedOutputDevicePosition(l.id, l.type)
          )
      )
    );
  }

  private getSavedOutputDevicePosition(
    id: string,
    type: OutputDeviceType
  ): Point {
    const saved = this.rootEngine.designer.outputDevices.find(
      (od) => od.id === id && od.type === type
    );
    return saved ? { x: saved.x, y: saved.y } : { x: 10, y: 10 };
  }

  ngOnDestroy(): void {
    clearInterval(this.interval);
  }

  private loop(): void {
    this.clock.startLoop();

    try {
      this.update();
    } catch (e) {
      console.error(`${e.message} ${e.stack}`);
    }

    try {
      for (const outputDevice of this.outputDevices) {
        outputDevice.update();
      }
      // this.displays.update();
    } catch (e) {
      console.error(`${e.message} ${e.stack}`);
    }

    this.clock.endLoop();
  }

  private update(): void {
    // compute data once
    const data = this.rootEngine.getData();

    const desiredDeviceStates = this.rootEngine.getDevices().values();
    for (const desiredState of desiredDeviceStates) {
      if (desiredState.forLight) {
        const lamp = this.lamps.get(desiredState.id);
        if (lamp.getState() !== desiredState.lightState) {
          lamp.setState(desiredState.lightState);
        }
        lamp.setStyles(desiredState.styles);
      }
      // else if (desiredState.type === OutputDeviceType.COIL) {
      //     const coil = this.coils.get(desiredState.id);
      //     if (coil instanceof Relay && coil.isRelayOn() && desiredState.getState() === false) {
      //         coil.off();
      //     }
      //     else if (coil instanceof Relay && !coil.isRelayOn() && desiredState.getState() === true) {
      //         coil.on();
      //     }
      //     else if (coil instanceof Relay === false && desiredState.getState() === true) {
      //         coil.on();
      //         desiredState.setState(false, false); // makes the coil fire once
      //     }
      // }
      // else if (desiredState.type === OutputDeviceType.SOUND) {
      //     const sound = this.sounds.get(desiredState.id);
      //     if (desiredState.getState() as boolean === true) {
      //         sound.on();
      //         desiredState.setState(false, false); // makes the sound play once
      //     }
      // }
      // else if (desiredState.type === OutputDeviceType.DISPLAY) {
      //     const formattedString = DataFormatter.format(
      //         desiredState.getState() as string,
      //         data
      //     );

      //     for(const style of desiredState.styles) {
      //         (style as BlinkDisplayStyle).updateInitState(formattedString);
      //     }

      //     switch(desiredState.id) {
      //     case DisplayId.PLAYER1:
      //         this.displays.setPlayerDisplay(1, formattedString, desiredState.styles);
      //         break;
      //     case DisplayId.PLAYER2:
      //         this.displays.setPlayerDisplay(2, formattedString, desiredState.styles);
      //         break;
      //     case DisplayId.PLAYER3:
      //         this.displays.setPlayerDisplay(3, formattedString, desiredState.styles);
      //         break;
      //     case DisplayId.PLAYER4:
      //         this.displays.setPlayerDisplay(4, formattedString, desiredState.styles);
      //         break;
      //     case DisplayId.BALLNUM:
      //         this.displays.setBall(formattedString, desiredState.styles);
      //         break;
      //     case DisplayId.CREDITS:
      //         this.displays.setCredits(formattedString, desiredState.styles);
      //         break;
      //     }
      // }
    }
  }

  onDropped(evt: CdkDragEnd<SimulationOutputDevice>): void {
    evt.source.data.position = evt.source.getFreeDragPosition();

    // update the persisted collection.
    this.rootEngine.designer.outputDevices = this.outputDevices.map((od) => {
      return {
        id: od.id,
        type: od.type,
        x: od.position.x,
        y: od.position.y,
      };
    });
  }
}

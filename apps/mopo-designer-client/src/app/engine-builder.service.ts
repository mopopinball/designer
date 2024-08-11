import { Injectable } from '@angular/core';
// import { LampRole } from '@mopopinball/engine/src/system/devices/lamp-role';

// import * as LampRole from '@mopopinball/engine/src/system/devices/lamp-role';
// import { LightState } from '@mopopinball/engine/src/system/devices/light';
// import { OutputDeviceType } from '@mopopinball/engine/src/system/devices/output-device-type';
// import { HardwareCoilSchema, HardwareConfig, HardwareLampSchema } from '@mopopinball/engine/src/system/hardware-config.schema';
// import { DesiredOutputState } from '@mopopinball/engine/src/system/rule-engine/desired-output-state';
// import { RuleEngine } from '@mopopinball/engine/src/system/rule-engine/rule-engine';

import {
  RuleEngine,
  HardwareConfig,
  LampRole,
  HardwareLampSchema,
  HardwareCoilSchema,
  DesiredOutputState,
  LightState,
  OutputDeviceType,
  CoilsSchema,
} from '@mopopinball/engine';

@Injectable({
  providedIn: 'root',
})
export class EngineBuilderService {
  rootEngine: RuleEngine;

  create(
    id: string,
    parent: RuleEngine,
    hardwareConfig: HardwareConfig
  ): RuleEngine {
    const engine = new RuleEngine(id, id === 'root', parent);
    engine.name = id === 'root' ? 'Untitled New Game' : 'Untitled Engine';

    this.resetEngineDevices(engine, hardwareConfig);

    return engine;
  }

  resetEngineDevices(engine: RuleEngine, hardwareConfig: HardwareConfig): void {
    engine.devices.clear();

    for (const entry of Object.entries(hardwareConfig.devices.lamps)) {
      const value: HardwareLampSchema | HardwareCoilSchema = entry[1];
      if (value.role === LampRole.LAMP) {
        this.addLightDevice(engine, entry[0]);
      } else if (value.role === LampRole.COIL) {
        this.addCoilDevice(engine, entry[0]);
      }
    }

    for (const entry of Object.entries(hardwareConfig.devices.coils)) {
      this.addCoilDevice(engine, entry[0]);
    }
  }

  addLightDevice(engine: RuleEngine, id: string): void {
    engine.devices.set(
      id,
      new DesiredOutputState(id, OutputDeviceType.LIGHT, LightState.OFF)
    );
  }

  addCoilDevice(engine: RuleEngine, id: string): void {
    engine.devices.set(
      id,
      new DesiredOutputState(id, OutputDeviceType.COIL, false)
    );
  }

  getAllEngineIds(): string[] {
    return Array.from(this.rootEngine.getAllEngines().keys());
  }
}

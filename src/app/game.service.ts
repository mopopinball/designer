import { EventEmitter, Injectable } from '@angular/core';
import { HardwareConfig } from '@mopopinball/engine/src/system/hardware-config.schema';
import { DesiredOutputState } from '@mopopinball/engine/src/system/rule-engine/desired-output-state';
import { RuleEngine } from '@mopopinball/engine/src/system/rule-engine/rule-engine';
import { TriggerTypeEnum } from '@mopopinball/engine/src/system/rule-engine/schema/triggers.schema';
import { BehaviorSubject, VirtualTimeScheduler } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class GameService {
    private root: RuleEngine;
    private tickSubject = new BehaviorSubject<Map<string, DesiredOutputState>>(new Map());
    tick = this.tickSubject.asObservable();
    public autoCollapse: boolean;
    private hardwareConfig: HardwareConfig;

    newTab: EventEmitter<RuleEngine> = new EventEmitter();

    constructor() { }

    setRoot(root: RuleEngine) {
        this.root = root;
    }

    getRoot(): RuleEngine {
        return this.root;
    }

    update(): void {
        if (!this.root) {
            return;
        }
        this.tickSubject.next(this.root.getDevices());
    }

    onSwitch(id: string, holdIntervalMs?: number): void {
        this.root.onSwitch(id, holdIntervalMs);
    }

    onTrigger(id: string): void {
        this.root.onTrigger(id);
    }

    setHardwareConfig(hwConfig: HardwareConfig): void {
        this.hardwareConfig = hwConfig;
    }

    getHardwareConfig(): HardwareConfig {
        return this.hardwareConfig;
    }

    doesTriggerExist(triggerId: string, ruleEngine: RuleEngine): boolean {
        if (!triggerId) {
          return true;
        }

        return ruleEngine.triggers
          .some((trigger) => trigger.type === TriggerTypeEnum.ID && trigger.id === triggerId);
      }
}

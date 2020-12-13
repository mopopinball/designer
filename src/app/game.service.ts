import { EventEmitter, Injectable } from '@angular/core';
import { DesiredOutputState } from '@mopopinball/engine/src/system/rule-engine/desired-output-state';
import { RuleEngine } from '@mopopinball/engine/src/system/rule-engine/rule-engine';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private root: RuleEngine;
  private tickSubject = new BehaviorSubject<Map<string, DesiredOutputState>>(new Map());
  tick = this.tickSubject.asObservable();

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

  onSwitch(id: string): void {
    this.root.onSwitch(id);
  }
}

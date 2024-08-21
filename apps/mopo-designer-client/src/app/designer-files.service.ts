import { EventEmitter, Injectable } from '@angular/core';
import { RuleEngine } from '@mopopinball/engine';
import { BehaviorSubject } from 'rxjs';

type Storage = {
  files: Record<string, string>;
  selectedFile: string;
  selectedEngineId: string;
};

@Injectable({
  providedIn: 'root',
})
export class DesignerFilesService {
  files: Map<string, string> = new Map();
  selectedFile: string;
  selectedEngineId: string;

  fileLoaded = new BehaviorSubject<[RuleEngine, string]>([null, null]);

  constructor() {
    const storage = JSON.parse(
      localStorage.getItem('mopo-pinball-designer')
    ) as Storage;

    if (!storage) {
      return;
    }

    this.selectedFile = storage.selectedFile;
    for (const entry of Object.entries<string>(storage.files)) {
      this.files.set(entry[0], entry[1]);
    }
    this.selectedEngineId = storage.selectedEngineId;

    this.load(this.selectedFile);
  }

  get fileNames(): Set<string> {
    return new Set(this.files.keys());
  }

  save(fileName: string, engine: RuleEngine): void {
    this.files.set(fileName, JSON.stringify(engine.toJSON()));
    this.selectedFile = fileName;

    const storage = {
      files: {},
      selectedFile: this.selectedFile,
      selectedEngineId: this.selectedEngineId,
    };

    for (const k of Array.from(this.files.keys())) {
      storage.files[k] = this.files.get(k);
    }

    localStorage.setItem('mopo-pinball-designer', JSON.stringify(storage));
  }

  load(fileName: string): void {
    try {
      const schemaData = JSON.parse(this.files.get(fileName));
      const engine = RuleEngine.load(schemaData);
      this.selectedFile = fileName;

      if (!engine.designer) {
        engine.designer = {
          outputDevices: [],
          inputDevices: [],
        };
      }

      this.fileLoaded.next([engine, this.selectedEngineId]);

      this.save(fileName, engine);
    } catch (e) {
      console.error(e);
    }
  }

  setSelectedEngineId(engineId: string): void {
    this.selectedEngineId = engineId;
  }
}

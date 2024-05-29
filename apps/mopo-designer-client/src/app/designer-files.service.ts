import { EventEmitter, Injectable } from '@angular/core';
import { RuleEngine } from '@mopopinball/engine';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DesignerFilesService {
  files: Map<string, string> = new Map();
  selectedFile: string;

  fileLoaded = new BehaviorSubject<RuleEngine>(null);

  constructor() {
    const storage = JSON.parse(localStorage.getItem('mopo-pinball-designer'));
    this.selectedFile = storage.selectedFile;
    for (const entry of Object.entries<string>(storage.files)) {
      this.files.set(entry[0], entry[1]);
    }

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
    };

    for (const k of Array.from(this.files.keys())) {
      storage.files[k] = this.files.get(k);
    }

    localStorage.setItem('mopo-pinball-designer', JSON.stringify(storage));
  }

  load(fileName: string): void {
    const schemaData = JSON.parse(this.files.get(fileName));
    const engine = RuleEngine.load(schemaData);
    this.selectedFile = fileName;
    this.fileLoaded.next(engine);

    this.save(fileName, engine);
  }
}

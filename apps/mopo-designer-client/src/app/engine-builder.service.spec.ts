import { TestBed } from '@angular/core/testing';

import { EngineBuilderService } from './engine-builder.service';

describe('EngineBuilderService', () => {
  let service: EngineBuilderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EngineBuilderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

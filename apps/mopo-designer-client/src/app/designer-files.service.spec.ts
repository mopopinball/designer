import { TestBed } from '@angular/core/testing';

import { DesignerFilesService } from './designer-files.service';

describe('DesignerFilesService', () => {
  let service: DesignerFilesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DesignerFilesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

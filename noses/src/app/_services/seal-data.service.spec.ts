import { TestBed } from '@angular/core/testing';

import { SealDataService } from './seal-data.service';

describe('SealDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SealDataService = TestBed.get(SealDataService);
    expect(service).toBeTruthy();
  });
});

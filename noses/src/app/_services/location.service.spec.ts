import { TestBed } from '@angular/core/testing';

import { NumberCounterService } from './location.service';

describe('LocationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NumberCounterService = TestBed.get(NumberCounterService);
    expect(service).toBeTruthy();
  });
});

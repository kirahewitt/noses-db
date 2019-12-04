import { TestBed } from '@angular/core/testing';

import { NewObservationModelService } from './new-observation-model.service';

describe('NewObservationModelService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NewObservationModelService = TestBed.get(NewObservationModelService);
    expect(service).toBeTruthy();
  });
});

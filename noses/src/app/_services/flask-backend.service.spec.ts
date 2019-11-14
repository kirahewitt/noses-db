import { TestBed } from '@angular/core/testing';

import { FlaskBackendService } from './flask-backend.service';

describe('FlaskBackendService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FlaskBackendService = TestBed.get(FlaskBackendService);
    expect(service).toBeTruthy();
  });
});

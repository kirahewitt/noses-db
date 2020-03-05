import { TestBed } from '@angular/core/testing';

import { PasswordHasherService } from './password-hasher.service';

describe('PasswordHasherService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PasswordHasherService = TestBed.get(PasswordHasherService);
    expect(service).toBeTruthy();
  });
});

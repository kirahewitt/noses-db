import { TestBed } from '@angular/core/testing';

import { DossierViewHelperService } from './dossier-view-helper.service';

describe('DossierViewHelperService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DossierViewHelperService = TestBed.get(DossierViewHelperService);
    expect(service).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkUploadObservationViewComponent } from './bulk-upload-observation-view.component';

describe('BulkUploadObservationViewComponent', () => {
  let component: BulkUploadObservationViewComponent;
  let fixture: ComponentFixture<BulkUploadObservationViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BulkUploadObservationViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkUploadObservationViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

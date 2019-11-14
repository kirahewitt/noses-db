import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CitizenSciBulkUploadDataPreviewComponent } from './citizen-sci-bulk-upload-data-preview.component';

describe('CitizenSciBulkUploadDataPreviewComponent', () => {
  let component: CitizenSciBulkUploadDataPreviewComponent;
  let fixture: ComponentFixture<CitizenSciBulkUploadDataPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CitizenSciBulkUploadDataPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CitizenSciBulkUploadDataPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

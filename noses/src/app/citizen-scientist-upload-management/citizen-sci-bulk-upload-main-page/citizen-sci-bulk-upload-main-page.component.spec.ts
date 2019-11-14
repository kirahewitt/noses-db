import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CitizenSciBulkUploadMainPageComponent } from './citizen-sci-bulk-upload-main-page.component';

describe('CitizenSciBulkUploadMainPageComponent', () => {
  let component: CitizenSciBulkUploadMainPageComponent;
  let fixture: ComponentFixture<CitizenSciBulkUploadMainPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CitizenSciBulkUploadMainPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CitizenSciBulkUploadMainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

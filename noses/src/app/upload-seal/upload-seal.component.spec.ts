import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadSealComponent } from './upload-seal.component';

describe('UploadSealComponent', () => {
  let component: UploadSealComponent;
  let fixture: ComponentFixture<UploadSealComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadSealComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadSealComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

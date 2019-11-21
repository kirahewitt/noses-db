import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormModalSingleObservationComponent } from './form-modal-single-observation.component';

describe('FormModalSingleObservationComponent', () => {
  let component: FormModalSingleObservationComponent;
  let fixture: ComponentFixture<FormModalSingleObservationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormModalSingleObservationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormModalSingleObservationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

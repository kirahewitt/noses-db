import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObsFormWeighingDataSubformComponent } from './obs-form-weighing-data-subform.component';

describe('ObsFormWeighingDataSubformComponent', () => {
  let component: ObsFormWeighingDataSubformComponent;
  let fixture: ComponentFixture<ObsFormWeighingDataSubformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObsFormWeighingDataSubformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObsFormWeighingDataSubformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

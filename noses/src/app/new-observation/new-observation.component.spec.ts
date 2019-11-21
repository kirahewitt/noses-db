import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewObservationComponent } from './new-observation.component';

describe('NewObservationComponent', () => {
  let component: NewObservationComponent;
  let fixture: ComponentFixture<NewObservationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewObservationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewObservationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

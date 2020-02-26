import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObsFormAnimalIDSubformComponent } from './obs-form-animal-idsubform.component';

describe('ObsFormAnimalIDSubformComponent', () => {
  let component: ObsFormAnimalIDSubformComponent;
  let fixture: ComponentFixture<ObsFormAnimalIDSubformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObsFormAnimalIDSubformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObsFormAnimalIDSubformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

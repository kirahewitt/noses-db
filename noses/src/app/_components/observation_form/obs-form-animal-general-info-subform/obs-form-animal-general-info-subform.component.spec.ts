import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObsFormAnimalGeneralInfoSubformComponent } from './obs-form-animal-general-info-subform.component';

describe('ObsFormAnimalGeneralInfoSubformComponent', () => {
  let component: ObsFormAnimalGeneralInfoSubformComponent;
  let fixture: ComponentFixture<ObsFormAnimalGeneralInfoSubformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObsFormAnimalGeneralInfoSubformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObsFormAnimalGeneralInfoSubformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

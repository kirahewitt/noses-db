import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObsFormObserverCredentialsDisplayComponent } from './obs-form-observer-credentials-display.component';

describe('ObsFormObserverCredentialsDisplayComponent', () => {
  let component: ObsFormObserverCredentialsDisplayComponent;
  let fixture: ComponentFixture<ObsFormObserverCredentialsDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObsFormObserverCredentialsDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObsFormObserverCredentialsDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

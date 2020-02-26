import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObsFormMainComponent } from './obs-form-main.component';

describe('ObsFormMainComponent', () => {
  let component: ObsFormMainComponent;
  let fixture: ComponentFixture<ObsFormMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObsFormMainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObsFormMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

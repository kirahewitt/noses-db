import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveObservationsComponent } from './approve-observations.component';

describe('ApproveObservationsComponent', () => {
  let component: ApproveObservationsComponent;
  let fixture: ComponentFixture<ApproveObservationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApproveObservationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApproveObservationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveObsComponent } from './approve-obs.component';

describe('ApproveObsComponent', () => {
  let component: ApproveObsComponent;
  let fixture: ComponentFixture<ApproveObsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApproveObsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApproveObsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

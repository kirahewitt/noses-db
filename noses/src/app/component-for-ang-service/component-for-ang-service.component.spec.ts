import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponentForAngServiceComponent } from './component-for-ang-service.component';

describe('ComponentForAngServiceComponent', () => {
  let component: ComponentForAngServiceComponent;
  let fixture: ComponentFixture<ComponentForAngServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComponentForAngServiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComponentForAngServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

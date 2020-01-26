import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginStateComponent } from './login-state.component';

describe('LoginStateComponent', () => {
  let component: LoginStateComponent;
  let fixture: ComponentFixture<LoginStateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginStateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

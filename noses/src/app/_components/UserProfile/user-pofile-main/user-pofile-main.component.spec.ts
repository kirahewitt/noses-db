import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPofileMainComponent } from './user-pofile-main.component';

describe('UserPofileMainComponent', () => {
  let component: UserPofileMainComponent;
  let fixture: ComponentFixture<UserPofileMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserPofileMainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserPofileMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

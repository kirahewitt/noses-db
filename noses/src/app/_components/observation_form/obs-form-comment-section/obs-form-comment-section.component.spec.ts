import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObsFormCommentSectionComponent } from './obs-form-comment-section.component';

describe('ObsFormCommentSectionComponent', () => {
  let component: ObsFormCommentSectionComponent;
  let fixture: ComponentFixture<ObsFormCommentSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObsFormCommentSectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObsFormCommentSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

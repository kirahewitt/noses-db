import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObsFormMetadataSubformComponent } from './obs-form-metadata-subform.component';

describe('ObsFormMetadataSubformComponent', () => {
  let component: ObsFormMetadataSubformComponent;
  let fixture: ComponentFixture<ObsFormMetadataSubformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObsFormMetadataSubformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObsFormMetadataSubformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

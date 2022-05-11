import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditBacklogComponent } from './edit-backlog.component';

describe('EditObservationComponent', () => {
  let component: EditBacklogComponent;
  let fixture: ComponentFixture<EditBacklogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditBacklogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditBacklogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterTypeSelectorComponent } from './filter-type-selector.component';

describe('FilterTypeSelectorComponent', () => {
  let component: FilterTypeSelectorComponent;
  let fixture: ComponentFixture<FilterTypeSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterTypeSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterTypeSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

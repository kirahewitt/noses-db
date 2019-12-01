import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TtlAngMaterialDialogComponent } from './ttl-ang-material-dialog.component';

describe('TtlAngMaterialDialogComponent', () => {
  let component: TtlAngMaterialDialogComponent;
  let fixture: ComponentFixture<TtlAngMaterialDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TtlAngMaterialDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TtlAngMaterialDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TtlAngMaterialStartPageComponent } from './ttl-ang-material-start-page.component';

describe('TtlAngMaterialStartPageComponent', () => {
  let component: TtlAngMaterialStartPageComponent;
  let fixture: ComponentFixture<TtlAngMaterialStartPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TtlAngMaterialStartPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TtlAngMaterialStartPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

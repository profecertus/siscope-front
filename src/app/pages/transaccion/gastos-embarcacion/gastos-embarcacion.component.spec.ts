import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GastosEmbarcacionComponent } from './gastos-embarcacion.component';

describe('GastosEmbarcacionComponent', () => {
  let component: GastosEmbarcacionComponent;
  let fixture: ComponentFixture<GastosEmbarcacionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GastosEmbarcacionComponent]
    });
    fixture = TestBed.createComponent(GastosEmbarcacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

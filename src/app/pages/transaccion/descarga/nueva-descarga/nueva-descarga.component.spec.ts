import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevaDescargaComponent } from './nueva-descarga.component';

describe('NuevaDescargaComponent', () => {
  let component: NuevaDescargaComponent;
  let fixture: ComponentFixture<NuevaDescargaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NuevaDescargaComponent]
    });
    fixture = TestBed.createComponent(NuevaDescargaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevoArriboComponent } from './nuevo-arribo.component';

describe('NuevoArriboComponent', () => {
  let component: NuevoArriboComponent;
  let fixture: ComponentFixture<NuevoArriboComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NuevoArriboComponent]
    });
    fixture = TestBed.createComponent(NuevoArriboComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

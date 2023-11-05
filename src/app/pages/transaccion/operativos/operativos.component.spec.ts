import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperativosComponent } from './operativos.component';

describe('OperativosComponent', () => {
  let component: OperativosComponent;
  let fixture: ComponentFixture<OperativosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OperativosComponent]
    });
    fixture = TestBed.createComponent(OperativosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

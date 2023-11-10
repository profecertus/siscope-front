import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PetroleoComponent } from './petroleo.component';

describe('PetroleoComponent', () => {
  let component: PetroleoComponent;
  let fixture: ComponentFixture<PetroleoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PetroleoComponent]
    });
    fixture = TestBed.createComponent(PetroleoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

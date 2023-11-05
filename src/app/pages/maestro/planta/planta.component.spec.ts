import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlantaComponent } from './planta.component';

describe('PlantaComponent', () => {
  let component: PlantaComponent;
  let fixture: ComponentFixture<PlantaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PlantaComponent]
    });
    fixture = TestBed.createComponent(PlantaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

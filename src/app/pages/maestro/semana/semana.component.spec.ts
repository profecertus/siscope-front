import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SemanaComponent } from './semana.component';

describe('SemanaComponent', () => {
  let component: SemanaComponent;
  let fixture: ComponentFixture<SemanaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SemanaComponent]
    });
    fixture = TestBed.createComponent(SemanaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

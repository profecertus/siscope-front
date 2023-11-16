import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmbarcacionComponent } from './embarcacion.component';

describe('EmbarcacionComponent', () => {
  let component: EmbarcacionComponent;
  let fixture: ComponentFixture<EmbarcacionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmbarcacionComponent]
    });
    fixture = TestBed.createComponent(EmbarcacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

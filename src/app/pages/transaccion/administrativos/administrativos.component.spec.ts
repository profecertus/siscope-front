import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministrativosComponent } from './administrativos.component';

describe('AdministrativosComponent', () => {
  let component: AdministrativosComponent;
  let fixture: ComponentFixture<AdministrativosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdministrativosComponent]
    });
    fixture = TestBed.createComponent(AdministrativosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

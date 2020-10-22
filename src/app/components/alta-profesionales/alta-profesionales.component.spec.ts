import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AltaProfesionalesComponent } from './alta-profesionales.component';

describe('AltaProfesionalesComponent', () => {
  let component: AltaProfesionalesComponent;
  let fixture: ComponentFixture<AltaProfesionalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AltaProfesionalesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AltaProfesionalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

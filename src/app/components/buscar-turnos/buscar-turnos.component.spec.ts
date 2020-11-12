import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuscarTurnosComponent } from './buscar-turnos.component';

describe('BuscarTurnosComponent', () => {
  let component: BuscarTurnosComponent;
  let fixture: ComponentFixture<BuscarTurnosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuscarTurnosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BuscarTurnosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

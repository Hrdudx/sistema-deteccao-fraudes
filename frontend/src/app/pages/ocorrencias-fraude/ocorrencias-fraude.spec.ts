import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OcorrenciasFraude } from './ocorrencias-fraude';

describe('OcorrenciasFraude', () => {
  let component: OcorrenciasFraude;
  let fixture: ComponentFixture<OcorrenciasFraude>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OcorrenciasFraude]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OcorrenciasFraude);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

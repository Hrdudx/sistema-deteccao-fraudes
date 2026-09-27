
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { AlertaFraude } from '../models/alerta-fraude.model';

export interface FiltrosAlertaFraude {
  status?: string;
  severidade?: string;
  tipoFraude?: string;
  dataInicial?: string;
  dataFinal?: string;
  busca?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AlertaFraudeService {
  private readonly baseUrl = `${environment.apiUrl}/alertas-fraude`;

  constructor(private http: HttpClient) {}

  listarTodos(): Observable<AlertaFraude[]> {
    return this.http.get<AlertaFraude[]>(this.baseUrl);
  }

  filtrar(
    filtros: FiltrosAlertaFraude
  ): Observable<AlertaFraude[]> {
    let params = new HttpParams();

    Object.entries(filtros).forEach(([chave, valor]) => {
      if (valor?.trim()) {
        params = params.set(chave, valor);
      }
    });

    return this.http.get<AlertaFraude[]>(
      `${this.baseUrl}/filtros`,
      { params }
    );
  }
}
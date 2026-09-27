import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { ClienteApi, ClienteHistoricoApi } from '../models/backend.model';
import { ResultadoConsulta } from '../models/resultado-consulta.model';
import { CLIENTES_DEMONSTRACAO, historicoDemonstracao } from './dados-demonstracao';

// Consome a funcionalidade de Clientes do backend (Eduarda):
//   GET /api/clientes               -> lista
//   GET /api/clientes/{id}/historico -> dados + contas, transações e ocorrências
@Injectable({ providedIn: 'root' })
export class ClientesService {
  private readonly baseUrl = `${environment.apiUrl}/clientes`;

  constructor(private http: HttpClient) {}

  listar(): Observable<ResultadoConsulta<ClienteApi[]>> {
    return this.http.get<ClienteApi[]>(this.baseUrl).pipe(
      map((dados) => ({ dados: dados ?? [], demonstracao: false })),
      catchError(() => of({ dados: CLIENTES_DEMONSTRACAO, demonstracao: true })),
    );
  }

  // 404 do backend significa "cliente não encontrado" (critério de aceitação da
  // história de consulta de cliente) e é repassado para a tela tratar. Qualquer
  // outra falha de comunicação cai nos dados de demonstração.
  historico(id: string): Observable<ResultadoConsulta<ClienteHistoricoApi | null>> {
    return this.http.get<ClienteHistoricoApi>(`${this.baseUrl}/${encodeURIComponent(id)}/historico`).pipe(
      map((dados) => ({ dados, demonstracao: false })),
      catchError((erro: HttpErrorResponse) => {
        if (erro.status === 404) {
          return of({ dados: null, demonstracao: false });
        }
        if (erro.status === 0 || erro.status >= 500) {
          return of({ dados: historicoDemonstracao(id), demonstracao: true });
        }
        return throwError(() => erro);
      }),
    );
  }
}

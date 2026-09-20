import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { IndicadoresHome } from '../models/indicadores-home.model';

// Serviço Angular equivalente à camada de "Controle" do backend.
// Consome o endpoint que a HomeService (Spring, do lado do backend) deve expor —
// o Angular NUNCA acessa o Databricks diretamente, só o backend (regra do DMS, seção 3.2).

@Injectable({ providedIn: 'root' })
export class HomeService {
  private readonly baseUrl = `${environment.apiUrl}/home`;

  // Dados de demonstração, usados enquanto o endpoint real do backend não existe
  // (Sprint 3 ainda não exige integração completa — isso fica pra Sprint 4).
  private readonly indicadoresMock: IndicadoresHome = {
    ocorrenciasAbertas: 128,
    ocorrenciasCriticas: 12,
    ocorrenciasAltas: 37,
    tratativasConcluidasHoje: 94,
    slaPercentualDentroPrazo: 87,
    slaVencidas: 17,
    ocorrenciasPorTipo: {
      PLD: 52,
      Chargeback: 31,
      KYC: 24,
      Fraude: 21,
    },
    resumoDoMes: [
      { prioridade: 'Alta', ocorrencia: 'PLD', cliente: 'Mariana Alves', valor: 48900, slaRestante: '01h 12m' },
      { prioridade: 'Media', ocorrencia: 'Chargeback', cliente: 'Empresa Delta Ltda.', valor: 7450, slaRestante: '03h 40m' },
    ],
    resumoDoDia: [
      { prioridade: 'Alta', ocorrencia: 'PLD', cliente: 'Mariana Alves', valor: 48900, slaRestante: '01h 12m' },
      { prioridade: 'Media', ocorrencia: 'Chargeback', cliente: 'Empresa Delta Ltda.', valor: 7450, slaRestante: '03h 40m' },
    ],
  };

  constructor(private http: HttpClient) { }

  // Endpoint proposto: GET /api/home/indicadores
  // Se o Diogo ainda não tiver criado esse endpoint agregado, combine com ele o contrato
  // antes de implementar — evita ficar calculando regra de negócio no frontend.
  //
  // Enquanto o backend não responde (ainda não existe ou não está rodando), cai
  // automaticamente nos dados mockados em vez de quebrar a tela com erro. Assim
  // que o endpoint real existir, esse fallback deixa de ser acionado sozinho.
  obterIndicadores(): Observable<IndicadoresHome> {
    return this.http.get<IndicadoresHome>(`${this.baseUrl}/indicadores`).pipe(
      catchError(() => of(this.indicadoresMock))
    );
  }
}

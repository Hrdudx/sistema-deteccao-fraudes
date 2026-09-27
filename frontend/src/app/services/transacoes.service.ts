import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { TransacaoApi } from '../models/backend.model';
import { ResultadoConsulta } from '../models/resultado-consulta.model';
import { TRANSACOES_DEMONSTRACAO } from './dados-demonstracao';

// Consome GET /api/transacoes (fato_transacao). Transações NÃO são categoria de
// ocorrência (DRE RN08): aparecem na tela de Ocorrências como contexto financeiro
// da análise, nas visões "Movimentações" e "Transacional".
@Injectable({ providedIn: 'root' })
export class TransacoesService {
  private readonly baseUrl = `${environment.apiUrl}/transacoes`;

  constructor(private http: HttpClient) {}

  listar(): Observable<ResultadoConsulta<TransacaoApi[]>> {
    return this.http.get<TransacaoApi[]>(this.baseUrl).pipe(
      map((dados) => ({ dados: dados ?? [], demonstracao: false })),
      catchError(() => of({ dados: TRANSACOES_DEMONSTRACAO, demonstracao: true })),
    );
  }
}

// Score a partir do qual a transação entra na visão "Transacional". O dicionário
// define score_transacao de 0 a 100; o limite pode ser ajustado pela equipe.
export const SCORE_TRANSACAO_SUSPEITA = 60;

// Sinais de risco existentes em fato_transacao, exibidos como etiquetas.
export function sinaisDeRisco(t: TransacaoApi): string[] {
  const sinais: string[] = [];
  if (t.foraPerfil) sinais.push('Fora do perfil');
  if (t.novoFavorecido) sinais.push('Favorecido novo');
  if (t.horarioAtipico) sinais.push('Horário atípico');
  if ((t.reputacaoDispositivo ?? '').toUpperCase() === 'RUIM') sinais.push('Dispositivo com reputação ruim');
  if (t.ufIp && t.clienteOrigem?.uf && t.ufIp !== t.clienteOrigem.uf) sinais.push(`IP de outra UF (${t.ufIp})`);
  return sinais;
}

// Visão "Transacional": transações que merecem atenção do analista.
export function transacaoSuspeita(t: TransacaoApi): boolean {
  const status = (t.statusTransacao ?? '').toUpperCase();
  return (t.scoreTransacao ?? 0) >= SCORE_TRANSACAO_SUSPEITA || !!t.foraPerfil || status === 'EM_ANALISE' || status === 'NEGADA';
}

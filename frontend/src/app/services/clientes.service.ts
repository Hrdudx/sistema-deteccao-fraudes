import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { ClienteApi, ClienteHistoricoApi } from '../models/backend.model';
import { ResultadoConsulta } from '../models/resultado-consulta.model';

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
          const cliente = CLIENTES_DEMONSTRACAO.find((c) => c.idCliente === id);
          return of({ dados: cliente ? historicoDemonstracao(cliente) : null, demonstracao: true });
        }
        return throwError(() => erro);
      }),
    );
  }
}

export const CLIENTES_DEMONSTRACAO: ClienteApi[] = [
  { idCliente: 'CLI-0001', tipoPessoa: 'PF', nomeRazaoSocial: 'Mariana Alves de Souza', documentoFicticio: '***.***.***-42', cidade: 'Goiânia', uf: 'GO', dataCadastro: '2024-04-12', statusCliente: 'ATIVO', segmento: 'Varejo', rendaFaturamentoMensal: 8500, profissaoAtividade: 'Analista administrativa', origemCadastro: 'App' },
  { idCliente: 'CLI-0002', tipoPessoa: 'PF', nomeRazaoSocial: 'Rafael Nunes', documentoFicticio: '***.***.***-18', cidade: 'Anápolis', uf: 'GO', dataCadastro: '2023-11-02', statusCliente: 'ATIVO', segmento: 'Varejo', rendaFaturamentoMensal: 6200, profissaoAtividade: 'Autônomo', origemCadastro: 'Agência' },
  { idCliente: 'CLI-0003', tipoPessoa: 'PJ', nomeRazaoSocial: 'Empresa Delta Ltda.', documentoFicticio: '**.***.***/0001-07', cidade: 'Brasília', uf: 'DF', dataCadastro: '2022-06-20', statusCliente: 'ATIVO', segmento: 'Empresas', rendaFaturamentoMensal: 185000, profissaoAtividade: 'Comércio varejista', origemCadastro: 'Internet Banking' },
  { idCliente: 'CLI-0004', tipoPessoa: 'PF', nomeRazaoSocial: 'João Martins', documentoFicticio: '***.***.***-77', cidade: 'Trindade', uf: 'GO', dataCadastro: '2026-08-30', statusCliente: 'EM_ANALISE', segmento: 'Varejo', rendaFaturamentoMensal: 3100, profissaoAtividade: 'Vendedor', origemCadastro: 'App' },
  { idCliente: 'CLI-0005', tipoPessoa: 'PF', nomeRazaoSocial: 'Camila Rocha', documentoFicticio: '***.***.***-05', cidade: 'Goiânia', uf: 'GO', dataCadastro: '2026-07-14', statusCliente: 'BLOQUEADO', segmento: 'Varejo', rendaFaturamentoMensal: 2400, profissaoAtividade: 'Estudante', origemCadastro: 'App' },
];

function historicoDemonstracao(cliente: ClienteApi): ClienteHistoricoApi {
  return {
    cliente,
    contas: [
      { idConta: '000874-2', tipoConta: 'Conta corrente', dataAbertura: cliente.dataCadastro, statusConta: 'ATIVA', limiteTransacionalDiario: 20000, saldoMedio30d: 4350 },
    ],
    transacoes: [
      { idTransacao: 'TRX-99812', dataHoraTransacao: '2026-09-26T09:14:00', tipoTransacao: 'PIX', valor: 48900, canal: 'App', nomeContraparte: 'Favorecido novo', scoreTransacao: 82, statusTransacao: 'EM_ANALISE' },
      { idTransacao: 'TRX-99640', dataHoraTransacao: '2026-09-20T15:02:00', tipoTransacao: 'TED', valor: 1250, canal: 'Internet Banking', nomeContraparte: 'Imobiliária Centro', scoreTransacao: 12, statusTransacao: 'APROVADA' },
    ],
    alertasPld: [],
    alertasFraude: [],
    chargebacks: [],
    kycs: [],
    riscoCliente: { scoreRiscoGeral: 71, nivelRisco: 'Alto', qtdAlertasFraude: 0, qtdAlertasPld: 1, qtdChargebacks: 0, qtdFraudesConfirmadas: 0, valorPerdas: 0, dataUltimaAvaliacao: '2026-09-26' },
  };
}

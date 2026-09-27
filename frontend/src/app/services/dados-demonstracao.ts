import {
  AlertaFraudeApi,
  AlertaPldApi,
  ChargebackApi,
  ClienteApi,
  ClienteHistoricoApi,
  ContaApi,
  KycApi,
  TransacaoApi,
} from '../models/backend.model';

// ---------------------------------------------------------------------------
// Base de DEMONSTRAÇÃO usada somente quando a API não responde (apresentação
// sem backend no ar). Os registros seguem o dicionário de dados do projeto
// (formatos da camada Gold: CLI0001, PLDALT0001, severidade MEDIA/ALTA/CRITICA,
// status ABERTO/EM_ANALISE/FECHADO, origem APP/WEB, moeda BRL...) e as regras
// de negócio RN01–RN08: instituição 100% digital, PF/PJ, conta corrente, sem
// cartão/saque/exterior e ocorrências somente de PLD, Chargeback, KYC e Fraude.
//
// Tudo é gerado de forma determinística (mesma semente => mesmos dados) e com
// datas relativas a hoje, para que Home, Ocorrências e Clientes mostrem
// números coerentes entre si em qualquer dia da apresentação.
// ---------------------------------------------------------------------------

function geradorAleatorio(semente: number) {
  let a = semente;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const aleatorio = geradorAleatorio(20260928);
const escolher = <T>(lista: readonly T[]): T => lista[Math.floor(aleatorio() * lista.length)];
const inteiro = (min: number, max: number) => min + Math.floor(aleatorio() * (max - min + 1));
const valor = (min: number, max: number) => Math.round((min + aleatorio() * (max - min)) * 100) / 100;
const codigo = (prefixo: string, n: number, digitos = 4) => `${prefixo}${String(n).padStart(digitos, '0')}`;

const agora = new Date();

function dataRelativa(diasAtras: number, hora = inteiro(8, 19)): Date {
  const d = new Date(agora);
  d.setDate(d.getDate() - diasAtras);
  d.setHours(hora, inteiro(0, 59), 0, 0);
  // Ocorrências de hoje nunca ficam no futuro
  return d > agora ? new Date(agora.getTime() - inteiro(5, 90) * 60000) : d;
}

// LocalDateTime do Spring (sem fuso) e LocalDate
const isoDataHora = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}T${String(
    d.getHours(),
  ).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:00`;
const isoData = (d: Date) => isoDataHora(d).slice(0, 10);
const somarHoras = (d: Date, horas: number) => new Date(d.getTime() + horas * 3600000);

// ---------------------------------------------------------------- Clientes
const NOMES = ['Ana', 'Bruno', 'Camila', 'Diego', 'Eduarda', 'Felipe', 'Gabriela', 'Heitor', 'Isabela', 'João', 'Larissa', 'Lucas', 'Mariana', 'Mateus', 'Natália', 'Otávio', 'Patrícia', 'Rafael', 'Sofia', 'Thiago', 'Vinícius', 'Yasmin'];
const SOBRENOMES = ['Alves', 'Barbosa', 'Cardoso', 'Costa', 'Dias', 'Ferreira', 'Gomes', 'Lima', 'Martins', 'Nunes', 'Oliveira', 'Pereira', 'Ribeiro', 'Rocha', 'Santos', 'Silva', 'Souza', 'Teixeira'];
const EMPRESAS = ['Delta', 'Alfa', 'Horizonte', 'Cerrado', 'Aurora', 'Vértice', 'Planalto', 'Atlas', 'Nexo', 'Prisma'];
const RAMOS = ['Comércio', 'Serviços', 'Distribuidora', 'Tecnologia', 'Logística', 'Alimentos'];
const CIDADES: [string, string][] = [['Goiânia', 'GO'], ['Anápolis', 'GO'], ['Trindade', 'GO'], ['Aparecida de Goiânia', 'GO'], ['Brasília', 'DF'], ['São Paulo', 'SP'], ['Uberlândia', 'MG'], ['Cuiabá', 'MT']];
const PROFISSOES = ['Analista administrativo', 'Autônomo', 'Professor', 'Estudante', 'Vendedor', 'Enfermeira', 'Engenheiro', 'Empresário'];

// Nomes do protótipo de telas, para os exemplos da apresentação baterem com as imagens
const NOMES_PROTOTIPO = ['Mariana Alves de Souza', 'Rafael Nunes', 'Empresa Delta Ltda.', 'João Martins', 'Camila Rocha', 'Lucas Ferreira', 'Ana Ribeiro', 'Comercial Alfa Ltda.', 'Bruno Costa'];

export const CLIENTES_DEMONSTRACAO: ClienteApi[] = Array.from({ length: 245 }, (_, i) => {
  const n = i + 1;
  const prototipo = NOMES_PROTOTIPO[i];
  const pj = prototipo ? /Ltda/.test(prototipo) : aleatorio() < 0.2;
  const [cidade, uf] = escolher(CIDADES);
  const cadastro = dataRelativa(inteiro(20, 900));
  const status = aleatorio();
  return {
    idCliente: codigo('CLI', n),
    tipoPessoa: pj ? 'PJ' : 'PF',
    nomeRazaoSocial:
      prototipo ?? (pj ? `${escolher(RAMOS)} ${escolher(EMPRESAS)} Ltda.` : `${escolher(NOMES)} ${escolher(SOBRENOMES)} ${escolher(SOBRENOMES)}`),
    documentoFicticio: codigo('DOC-FICT-', n),
    dataNascimentoAbertura: isoData(dataRelativa(pj ? inteiro(400, 6000) : inteiro(6600, 22000))),
    cidade,
    uf,
    dataCadastro: isoData(cadastro),
    statusCliente: status < 0.9 ? 'ATIVO' : status < 0.96 ? 'BLOQUEADO' : 'INATIVO',
    segmento: pj ? 'EMPRESAS' : aleatorio() < 0.15 ? 'ALTA_RENDA' : 'VAREJO',
    rendaFaturamentoMensal: pj ? valor(40000, 900000) : valor(1800, 25000),
    profissaoAtividade: pj ? escolher(RAMOS) : escolher(PROFISSOES),
    origemCadastro: aleatorio() < 0.72 ? 'APP' : 'WEB',
  };
});

// ------------------------------------------------------------- Ocorrências
const ANALISTAS = ['ANA.SILVA', 'BRUNO.LIMA', 'CARLA.DIAS', 'DIEGO.ROCHA'];

// Status coerente com a idade do alerta: o que já passou do prazo quase sempre
// está encerrado; os recentes ficam, em sua maioria, em aberto.
function statusPorIdade(dias: number, prazoHoras: number, abertos: readonly string[], fechado: string): string {
  const prazoDias = prazoHoras / 24;
  const chanceFechado = dias > prazoDias ? 0.93 : (dias / prazoDias) * 0.5;
  if (aleatorio() < chanceFechado) return fechado;
  return escolher(abertos);
}

// Idade do alerta: concentra no mês corrente e sempre gera alguns no dia de hoje.
const idadeAlerta = (i: number) => (i % 9 === 0 ? 0 : aleatorio() < 0.7 ? inteiro(0, agora.getDate() - 1) : inteiro(agora.getDate(), 75));

const clienteDoIndice = (i: number) => CLIENTES_DEMONSTRACAO[(i * 7 + 3) % CLIENTES_DEMONSTRACAO.length];

// Prazos usados SOMENTE para simular o SLA na demonstração (o backend ainda não os define).
const PRAZO_DEMO_HORAS = { PLD: 72, Chargeback: 120, KYC: 48, Fraude: 24 };

export const TRANSACOES_DEMONSTRACAO: TransacaoApi[] = [];
const BANCOS = ['Banco Digital Alfa', 'Banco Horizonte', 'Cooperativa Cerrado', 'Banco Nacional Beta', 'Instituição Interna'];

// Registra uma transação em fato_transacao. As ligadas a alertas nascem com sinais
// de risco (score alto, favorecido novo, fora do perfil...); as demais, normais.
function transacaoPara(cliente: ClienteApi, data: Date, valorTransacao: number, suspeita = true): string {
  const id = codigo('TRX', TRANSACOES_DEMONSTRACAO.length + 1, 6);
  const externo = aleatorio() < 0.7;
  const hora = somarHoras(data, -inteiro(1, 20) / 10);
  TRANSACOES_DEMONSTRACAO.push({
    idTransacao: id,
    dataHoraTransacao: isoDataHora(hora),
    tipoTransacao: escolher(['PIX', 'PIX', 'PIX', 'TED', 'BOLETO', 'TRANSFERENCIA_INTERNA']),
    valor: valorTransacao,
    moeda: 'BRL',
    canal: cliente.origemCadastro,
    clienteOrigem: cliente,
    contaOrigem: { idConta: codigo('CTA', Number(cliente.idCliente.replace(/\D/g, ''))) },
    clienteDestino: externo ? null : escolher(CLIENTES_DEMONSTRACAO),
    nomeContraparte: aleatorio() < 0.6 ? `${escolher(NOMES)} ${escolher(SOBRENOMES)}` : `${escolher(EMPRESAS)} Pagamentos Ltda.`,
    documentoContraparteFicticio: codigo('DOC-EXT-', inteiro(1, 999)),
    bancoContraparte: externo ? escolher(BANCOS.slice(0, 4)) : 'Instituição Interna',
    ufIp: aleatorio() < 0.8 ? cliente.uf : escolher(['SP', 'RJ', 'PR', 'BA', 'PA']),
    idDispositivo: codigo('DEV', inteiro(1, 400)),
    reputacaoDispositivo: suspeita ? escolher(['NEUTRA', 'RUIM', 'RUIM']) : escolher(['BOA', 'BOA', 'BOA', 'NEUTRA']),
    horarioAtipico: suspeita ? aleatorio() < 0.5 : aleatorio() < 0.05,
    novoFavorecido: suspeita ? aleatorio() < 0.7 : aleatorio() < 0.15,
    foraPerfil: suspeita ? aleatorio() < 0.6 : false,
    scoreTransacao: suspeita ? inteiro(60, 98) : inteiro(2, 45),
    statusTransacao: suspeita ? escolher(['EM_ANALISE', 'EM_ANALISE', 'NEGADA', 'APROVADA']) : 'APROVADA',
  });
  return id;
}

function encerramento(status: string, data: Date, prazoHoras: number): string | null {
  if (status !== 'FECHADO' && status !== 'ENCERRADO') return null;
  // ~85% das tratativas terminam dentro do prazo
  const horas = aleatorio() < 0.85 ? inteiro(2, prazoHoras - 1) : inteiro(prazoHoras + 1, prazoHoras * 2);
  const d = somarHoras(data, horas);
  return isoData(d > agora ? agora : d);
}

export const ALERTAS_PLD_DEMONSTRACAO: AlertaPldApi[] = Array.from({ length: 60 }, (_, i): AlertaPldApi => {
  const cliente = i === 0 ? CLIENTES_DEMONSTRACAO[0] : i === 1 ? CLIENTES_DEMONSTRACAO[1] : clienteDoIndice(i);
  const dias = i < 2 ? 0 : idadeAlerta(i);
  const data = dataRelativa(dias);
  const status = i < 2 ? (i === 0 ? 'ABERTO' : 'EM_ANALISE') : statusPorIdade(dias, PRAZO_DEMO_HORAS.PLD, ['ABERTO', 'EM_ANALISE'], 'FECHADO');
  const valorRelacionado = i === 0 ? 48900 : valor(3000, 95000);
  const fechado = status === 'FECHADO';
  return {
    idAlertaPld: codigo('PLDALT', 1028 - i),
    dataAlerta: isoDataHora(data),
    clienteAnalisado: cliente,
    tipoAlerta: i === 0 ? 'MOVIMENTACAO_ATIPICA' : escolher(['INCOMPATIBILIDADE_RENDA', 'FRACIONAMENTO', 'ENTRADA_SAIDA_RAPIDA', 'MOVIMENTACAO_ATIPICA']),
    valorRelacionado,
    scorePld: inteiro(30, 95),
    severidade: i === 0 ? 'ALTA' : escolher(['MEDIA', 'MEDIA', 'ALTA', 'ALTA', 'CRITICA']),
    statusAnalise: status,
    resultado: fechado ? escolher(['SEM_INDICIO', 'COM_INDICIO', 'INCONCLUSIVO']) : 'EM_ANALISE',
    analistaResponsavel: status === 'ABERTO' ? null : escolher(ANALISTAS),
    dataEncerramento: encerramento(status, data, PRAZO_DEMO_HORAS.PLD),
    observacao: i === 0 ? 'Movimentação monitorada: valor acima do padrão recente do cliente.' : null,
    prazoSla: isoDataHora(somarHoras(data, PRAZO_DEMO_HORAS.PLD)),
    transacaoReferencia: { idTransacao: transacaoPara(cliente, data, valorRelacionado) },
  };
});

export const CHARGEBACKS_DEMONSTRACAO: ChargebackApi[] = Array.from({ length: 36 }, (_, i): ChargebackApi => {
  const cliente = i === 0 ? CLIENTES_DEMONSTRACAO[2] : clienteDoIndice(i + 60);
  const dias = i === 0 ? 0 : idadeAlerta(i + 3);
  const data = dataRelativa(dias);
  const status = i === 0 ? 'EM_ANALISE' : statusPorIdade(dias, PRAZO_DEMO_HORAS.Chargeback, ['EM_ANALISE'], 'ENCERRADO');
  const valorContestado = i === 0 ? 7450 : valor(150, 12000);
  const encerrado = status === 'ENCERRADO';
  return {
    idChargeback: codigo('CBK', 892 - i),
    cliente,
    dataContestacao: isoDataHora(data),
    valorContestado,
    motivoChargeback: escolher(['FRAUDE', 'NAO_RECONHECIDA', 'PRODUTO_NAO_ENTREGUE', 'VALOR_INCORRETO']),
    modalidade: escolher(['MED_PIX', 'CONTESTACAO_TRANSFERENCIA', 'DEVOLUCAO_OPERACIONAL']),
    statusChargeback: status,
    fraudeDeclarada: aleatorio() < 0.4,
    resultadoInvestigacao: encerrado ? escolher(['PROCEDENTE', 'IMPROCEDENTE', 'PARCIAL']) : 'EM_ANALISE',
    dataResolucao: encerramento(status, data, PRAZO_DEMO_HORAS.Chargeback),
    prazoSla: isoDataHora(somarHoras(data, PRAZO_DEMO_HORAS.Chargeback)),
    transacao: { idTransacao: transacaoPara(cliente, data, valorContestado) },
  };
});

export const KYCS_DEMONSTRACAO: KycApi[] = Array.from({ length: 30 }, (_, i): KycApi => {
  const cliente = i === 0 ? CLIENTES_DEMONSTRACAO[3] : clienteDoIndice(i + 110);
  const dias = i === 0 ? 1 : idadeAlerta(i + 5);
  const data = dataRelativa(dias);
  const status = i === 0 ? 'PENDENTE' : statusPorIdade(dias, PRAZO_DEMO_HORAS.KYC, ['PENDENTE'], aleatorio() < 0.8 ? 'APROVADO' : 'REPROVADO');
  return {
    idKyc: codigo('KYC', 441 - i),
    cliente,
    dataAnalise: isoDataHora(data),
    scoreKyc: inteiro(10, 90),
    nivelRiscoKyc: i === 0 ? 'MEDIO' : escolher(['BAIXO', 'BAIXO', 'MEDIO', 'ALTO']),
    statusKyc: status,
    motivoDecisao: i === 0 ? 'Comprovante de endereço divergente do cadastro.' : status === 'APROVADO' ? 'Cadastro validado sem pendências' : 'Documentação complementar solicitada',
    prazoSla: isoDataHora(somarHoras(data, PRAZO_DEMO_HORAS.KYC)),
  };
});

export const ALERTAS_FRAUDE_DEMONSTRACAO: AlertaFraudeApi[] = Array.from({ length: 30 }, (_, i): AlertaFraudeApi => {
  const cliente = i === 0 ? CLIENTES_DEMONSTRACAO[4] : i === 1 ? CLIENTES_DEMONSTRACAO[7] : clienteDoIndice(i + 150);
  const dias = i === 0 ? 0 : i === 1 ? 4 : idadeAlerta(i + 7);
  const data = dataRelativa(dias);
  const status = i === 0 ? 'ABERTO' : i === 1 ? 'EM_ANALISE' : statusPorIdade(dias, PRAZO_DEMO_HORAS.Fraude, ['ABERTO', 'EM_ANALISE'], 'FECHADO');
  const valorExposto = i === 0 ? 12980 : i === 1 ? 92500 : valor(500, 60000);
  const fechado = status === 'FECHADO';
  return {
    idAlertaFraude: codigo('FRDALT', 770 - i),
    dataAlerta: isoDataHora(data),
    clienteOrigem: cliente,
    tipoFraude: i === 1 ? 'ENGENHARIA_SOCIAL' : escolher(['ENGENHARIA_SOCIAL', 'CONTA_INVADIDA', 'IDENTIDADE_FALSA', 'FRAUDE_PIX']),
    scoreFraude: i === 0 ? 95 : inteiro(40, 97),
    severidade: i === 0 ? 'CRITICA' : i === 1 ? 'ALTA' : escolher(['MEDIA', 'ALTA', 'ALTA', 'CRITICA']),
    statusAnalise: status,
    resultado: fechado ? escolher(['FRAUDE_CONFIRMADA', 'FALSO_POSITIVO', 'INCONCLUSIVO']) : 'EM_ANALISE',
    valorExposto,
    analistaResponsavel: status === 'ABERTO' ? null : escolher(ANALISTAS),
    dataEncerramento: encerramento(status, data, PRAZO_DEMO_HORAS.Fraude),
    observacao: null,
    prazoSla: isoDataHora(somarHoras(data, PRAZO_DEMO_HORAS.Fraude)),
    transacao: { idTransacao: transacaoPara(cliente, data, valorExposto) },
  };
});

// Movimentações do dia a dia (sem alerta), para a visão "Movimentações".
for (let i = 0; i < 260; i++) {
  const cliente = CLIENTES_DEMONSTRACAO[(i * 11 + 5) % CLIENTES_DEMONSTRACAO.length];
  const valorNormal = aleatorio() < 0.8 ? valor(15, 2500) : valor(2500, 15000);
  transacaoPara(cliente, dataRelativa(i % 7 === 0 ? 0 : inteiro(0, 40)), valorNormal, false);
}
TRANSACOES_DEMONSTRACAO.sort((a, b) => (b.dataHoraTransacao ?? '').localeCompare(a.dataHoraTransacao ?? ''));

// --------------------------------------------------- Histórico do cliente
export function historicoDemonstracao(idCliente: string): ClienteHistoricoApi | null {
  const cliente = CLIENTES_DEMONSTRACAO.find((c) => c.idCliente === idCliente);
  if (!cliente) return null;

  const doCliente = <T>(lista: T[], cli: (x: T) => ClienteApi | null | undefined) =>
    lista.filter((x) => cli(x)?.idCliente === idCliente);

  const alertasPld = doCliente(ALERTAS_PLD_DEMONSTRACAO, (a) => a.clienteAnalisado);
  const alertasFraude = doCliente(ALERTAS_FRAUDE_DEMONSTRACAO, (a) => a.clienteOrigem);
  const chargebacks = doCliente(CHARGEBACKS_DEMONSTRACAO, (c) => c.cliente);
  const kycs = doCliente(KYCS_DEMONSTRACAO, (k) => k.cliente);
  const numero = Number(idCliente.replace(/\D/g, ''));

  const contas: ContaApi[] = [
    {
      idConta: codigo('CTA', numero),
      tipoConta: cliente.tipoPessoa === 'PJ' ? 'CONTA_PAGAMENTO' : 'CONTA_CORRENTE',
      dataAbertura: cliente.dataCadastro,
      statusConta: cliente.statusCliente === 'BLOQUEADO' ? 'BLOQUEADA' : cliente.statusCliente === 'INATIVO' ? 'ENCERRADA' : 'ATIVA',
      limiteTransacionalDiario: cliente.tipoPessoa === 'PJ' ? 150000 : 15000,
      saldoMedio30d: Math.round((cliente.rendaFaturamentoMensal ?? 3000) * 0.6 * 100) / 100,
    },
  ];

  const pesoSeveridade = { CRITICA: 95, ALTA: 75, MEDIA: 50, ALTO: 75, MEDIO: 50, BAIXO: 20 } as Record<string, number>;
  const scores = [...alertasPld, ...alertasFraude].map((a) => pesoSeveridade[a.severidade ?? ''] ?? 30);
  const score = scores.length ? Math.round(scores.reduce((s, x) => s + x, 0) / scores.length) : 12;
  const fraudesConfirmadas = alertasFraude.filter((a) => a.resultado === 'FRAUDE_CONFIRMADA').length;

  return {
    cliente,
    contas,
    transacoes: TRANSACOES_DEMONSTRACAO.filter((t) => t.clienteOrigem?.idCliente === idCliente),
    alertasPld,
    alertasFraude,
    chargebacks,
    kycs,
    riscoCliente: {
      scoreRiscoGeral: score,
      nivelRisco: score >= 85 ? 'CRITICO' : score >= 65 ? 'ALTO' : score >= 40 ? 'MEDIO' : 'BAIXO',
      qtdAlertasFraude: alertasFraude.length,
      qtdAlertasPld: alertasPld.length,
      qtdChargebacks: chargebacks.length,
      qtdFraudesConfirmadas: fraudesConfirmadas,
      valorPerdas: fraudesConfirmadas ? alertasFraude.reduce((s, a) => s + (a.resultado === 'FRAUDE_CONFIRMADA' ? (a.valorExposto ?? 0) * 0.4 : 0), 0) : 0,
      dataUltimaAvaliacao: isoData(agora),
    },
  };
}

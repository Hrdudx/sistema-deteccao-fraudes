import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';

// Menu conforme o DMS (seção 9.1): Home, Clientes, Ocorrências, Relatórios, Usuários.
// Categorias de Ocorrência: somente PLD, Chargeback, KYC e Fraude.
// As telas além da Home são carregadas sob demanda (lazy loading) para deixar a
// abertura do sistema mais rápida. O "title" de cada rota aparece na aba do navegador.
const ocorrencias = () => import('./pages/ocorrencias/ocorrencias.component').then((m) => m.OcorrenciasComponent);
const emConstrucao = () => import('./pages/em-construcao/em-construcao.component').then((m) => m.EmConstrucaoComponent);

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent, title: 'Home · SGR' },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then((m) => m.LoginComponent),
    title: 'Entrar · SGR',
  },
  {
    path: 'clientes',
    loadComponent: () => import('./pages/clientes/clientes.component').then((m) => m.ClientesComponent),
    title: 'Clientes · SGR',
  },
  {
    path: 'clientes/:id',
    loadComponent: () =>
      import('./pages/cliente-detalhe/cliente-detalhe.component').then((m) => m.ClienteDetalheComponent),
    title: 'Histórico do cliente · SGR',
  },
  { path: 'ocorrencias', loadComponent: ocorrencias, title: 'Ocorrências · SGR' },
  { path: 'ocorrencias/pld', loadComponent: ocorrencias, data: { categoria: 'PLD' }, title: 'PLD · SGR' },
  {
    path: 'ocorrencias/chargeback',
    loadComponent: ocorrencias,
    data: { categoria: 'Chargeback' },
    title: 'Chargeback · SGR',
  },
  { path: 'ocorrencias/kyc', loadComponent: ocorrencias, data: { categoria: 'KYC' }, title: 'KYC · SGR' },
  // Fraude: a tela com filtros avançados de alertas é da Gabriella. Quando ela for
  // integrada, basta trocar o loadComponent abaixo pelo componente dela.
  { path: 'ocorrencias/fraude', loadComponent: ocorrencias, data: { categoria: 'Fraude' }, title: 'Fraude · SGR' },
  {
    path: 'relatorios',
    loadComponent: emConstrucao,
    data: { titulo: 'Relatórios', descricao: 'Indicadores e relatórios gerenciais de riscos' },
    title: 'Relatórios · SGR',
  },
  {
    path: 'usuarios',
    loadComponent: emConstrucao,
    data: { titulo: 'Usuários', descricao: 'Gestão de usuários e perfis de acesso' },
    title: 'Usuários · SGR',
  },
  {
    path: '**',
    loadComponent: () => import('./pages/nao-encontrada/nao-encontrada.component').then((m) => m.NaoEncontradaComponent),
    title: 'Página não encontrada · SGR',
  },
];

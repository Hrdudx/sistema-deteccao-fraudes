import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { administradorGuard, autenticadoGuard } from './services/auth.guard';

// Menu conforme o DMS (seção 9.1): Home, Clientes, Ocorrências, Relatórios, Usuários.
// Categorias de Ocorrência: somente PLD, Chargeback, KYC e Fraude.
// As telas além da Home são carregadas sob demanda (lazy loading) para deixar a
// abertura do sistema mais rápida. O "title" de cada rota aparece na aba do navegador.
const ocorrencias = () => import('./pages/ocorrencias/ocorrencias.component').then((m) => m.OcorrenciasComponent);

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then((m) => m.LoginComponent),
    title: 'Entrar · Detecção de Fraudes',
  },
  // Todas as demais telas exigem login (UC01). A tela de Usuários também exige o
  // perfil Administrador (RF04 / TEL13).
  {
    path: '',
    canActivateChild: [autenticadoGuard],
    children: [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent, title: 'Home · Detecção de Fraudes' },
  {
    path: 'clientes',
    loadComponent: () => import('./pages/clientes/clientes.component').then((m) => m.ClientesComponent),
    title: 'Clientes · Detecção de Fraudes',
  },
  {
    path: 'clientes/:id',
    loadComponent: () =>
      import('./pages/cliente-detalhe/cliente-detalhe.component').then((m) => m.ClienteDetalheComponent),
    title: 'Histórico do cliente · Detecção de Fraudes',
  },
  { path: 'ocorrencias', loadComponent: ocorrencias, title: 'Ocorrências · Detecção de Fraudes' },
  {
    path: 'ocorrencias/movimentacoes',
    loadComponent: ocorrencias,
    data: { visao: 'movimentacoes' },
    title: 'Movimentações · Detecção de Fraudes',
  },
  {
    path: 'ocorrencias/transacional',
    loadComponent: ocorrencias,
    data: { visao: 'transacional' },
    title: 'Transacional · Detecção de Fraudes',
  },
  { path: 'ocorrencias/pld', loadComponent: ocorrencias, data: { categoria: 'PLD' }, title: 'PLD · Detecção de Fraudes' },
  {
    path: 'ocorrencias/chargeback',
    loadComponent: ocorrencias,
    data: { categoria: 'Chargeback' },
    title: 'Chargeback · Detecção de Fraudes',
  },
  { path: 'ocorrencias/kyc', loadComponent: ocorrencias, data: { categoria: 'KYC' }, title: 'KYC · Detecção de Fraudes' },
  // Fraude: a tela com filtros avançados de alertas é da Gabriella. Quando ela for
  // integrada, basta trocar o loadComponent abaixo pelo componente dela.
  { path: 'ocorrencias/fraude', loadComponent: ocorrencias, data: { categoria: 'Fraude' }, title: 'Fraude · Detecção de Fraudes' },
  {
    path: 'relatorios',
    loadComponent: () => import('./pages/relatorios/relatorios.component').then((m) => m.RelatoriosComponent),
    title: 'Relatórios · Detecção de Fraudes',
  },
  {
    path: 'usuarios',
    loadComponent: () => import('./pages/usuarios/usuarios.component').then((m) => m.UsuariosComponent),
    canActivate: [administradorGuard],
    title: 'Usuários · Detecção de Fraudes',
  },
  {
    path: 'acesso-negado',
    loadComponent: () => import('./pages/acesso-negado/acesso-negado.component').then((m) => m.AcessoNegadoComponent),
    title: 'Acesso restrito · Detecção de Fraudes',
  },
  {
    path: '**',
    loadComponent: () => import('./pages/nao-encontrada/nao-encontrada.component').then((m) => m.NaoEncontradaComponent),
    title: 'Página não encontrada · Detecção de Fraudes',
  },
    ],
  },
];

import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';

// Menu conforme o DMS (seção 9.1): Home, Clientes, Ocorrências, Relatórios, Usuários.
// Categorias de Ocorrência: somente PLD, Chargeback, KYC e Fraude.
// Rotas fora de Home ainda são placeholders — cada uma pertence a quem for
// responsável pela área (Eduarda: Clientes; Airon/Gabriella: Ocorrências).
export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  // { path: 'clientes', component: ClientesComponent },
  // { path: 'ocorrencias/pld', component: PldComponent },
  // { path: 'ocorrencias/chargeback', component: ChargebackComponent },
  // { path: 'ocorrencias/kyc', component: KycComponent },
  // { path: 'ocorrencias/fraude', component: FraudeComponent },
  // { path: 'relatorios', component: RelatoriosComponent },
  // { path: 'usuarios', component: UsuariosComponent },
];

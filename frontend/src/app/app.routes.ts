
import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { OcorrenciasFraude } from './pages/ocorrencias-fraude/ocorrencias-fraude';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },

  // Área de Fraude - Gabriella
  { path: 'ocorrencias/fraude', component: OcorrenciasFraude },

  // As demais rotas serão habilitadas conforme a integração das áreas.
];
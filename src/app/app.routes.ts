import { Routes } from '@angular/router';
import { Home } from './home/home';
import { DetalleLibro } from './detalle-libro/detalle-libro';
import { Dashboard } from './dashboard/dashboard';

export const routes: Routes = [
  { path: '', component: Home, title: 'Catálogo de Biblioteca' },
  { path: 'dashboard', component: Dashboard, title: 'Dashboard de Biblioteca' },
  { path: 'libro/:id', component: DetalleLibro, title: 'Detalle de Libro' },
  { path: '**', redirectTo: '' }
];

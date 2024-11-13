import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { AuthComponent } from './auth/auth.component';
import { AuthGuard } from './auth.guard';
import { ProductionLinesComponent } from './production-lines/production-lines.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'auth', component: AuthComponent },  // Layout altında auth
      { path: 'production-lines', component: ProductionLinesComponent },
      { path: '**', redirectTo: 'auth' } // Hatalı rota olursa login sayfasına yönlendir
    ]
  }
];
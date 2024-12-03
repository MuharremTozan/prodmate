import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { AuthComponent } from './auth/auth.component';
import { ProductionLinesComponent } from './production-lines/production-lines.component';
import { LinesAndPartsComponent } from './lines-and-parts/lines-and-parts.component';
import { StockManagementComponent } from './stock-management/stock-management.component';
import { SalesReportComponent } from './sales-report/sales-report.component';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'auth', component: AuthComponent },
      { path: 'production-lines', component: ProductionLinesComponent, canActivate: [AuthGuard] },
      { path: 'production-lines/:id', component: LinesAndPartsComponent, canActivate: [AuthGuard] },
      { path: 'stock-management', component: StockManagementComponent, canActivate: [AuthGuard]},
      { path: 'sales-report' , component: SalesReportComponent, canActivate: [AuthGuard]},
      { path: '**', redirectTo: 'auth' } 
    ]
  }
];
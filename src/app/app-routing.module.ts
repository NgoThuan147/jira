import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/dashboard' },
  { path: 'login', loadChildren: () => import('./pages/auth/auth.module').then(m => m.AuthModule) },
  { path: 'list-table', loadChildren: () => import('./pages/tables/tables.module').then(m => m.TablesModule) },
  { path: 'table-detail', loadChildren: () => import('./pages/detail/detail.module').then(m => m.DetailModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { NotFoundComponent } from './abnormal/not-found/not-found.component';

const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
      },
      {
        path: 'maestro',
        loadChildren: () =>
          import('./maestro/maestro.module').then((m) => m.MaestroModule),
      },
      {
        path: 'tarifario',
        loadChildren: () =>
          import('./tarifario/tarifario.module').then((m) => m.TarifarioModule),
      },
      {
        path: 'transaccion',
        loadChildren: () =>
          import('./transaccion/transaccion.module').then((m) => m.TransaccionModule),
      },
      {
        path: 'abnormal',
        loadChildren: () =>
          import('./abnormal/abnormal.module').then((m) => m.AbnormalModule),
      },
      {
        path: 'user',
        loadChildren: () =>
          import('./user/user.module').then((m) => m.UserModule),
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: '**',
        component: NotFoundComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}

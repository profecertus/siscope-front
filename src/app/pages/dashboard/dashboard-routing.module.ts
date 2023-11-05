import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { MonitorComponent } from './monitor/monitor.component';
import { WorkSpaceComponent } from './work-space/work-space.component';
import { DashboardComponent } from './dashboard.component';
import { AuthGuardService } from '../../@core/services/auth-guard-service.guard';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [

      { path: 'monitor', component: MonitorComponent },
      { path: 'workspace', component: WorkSpaceComponent },
      { path: '', redirectTo: 'monitor', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}

import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { TransaccionComponent } from './transaccion.component';
import { AdministrativoComponent } from '../maestro/administrativo/administrativo.component';
import { DescargaComponent } from './descarga/descarga.component';
import { IngresoComponent } from './ingreso/ingreso.component';
import { LiquidacionComponent } from './liquidacion/liquidacion.component';
import { OperativoComponent } from '../maestro/operativo/operativo.component';
import { PlanillaComponent } from './planilla/planilla.component';

const routes: Routes = [
  {
    path: '',
    component: TransaccionComponent,
    children: [
      { path: 'descarga', component: DescargaComponent },
      { path: 'planilla', component: PlanillaComponent },
      { path: 'operativo', component: OperativoComponent },
      { path: 'administrativo', component: AdministrativoComponent },
      { path: 'ingreso', component: IngresoComponent },
      { path: 'liquidacion', component: LiquidacionComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TransaccionRoutingModule {}

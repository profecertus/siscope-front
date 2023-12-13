import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { TransaccionComponent } from './transaccion.component';
import { DescargaComponent } from './descarga/descarga.component';
import { IngresoComponent } from './ingreso/ingreso.component';
import { LiquidacionComponent } from './liquidacion/liquidacion.component';
import { DevUIModule } from '@devui';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../@shared/shared.module';
import { GastosEmbarcacionComponent } from './gastos-embarcacion/gastos-embarcacion.component';

const routes: Routes = [
  {
    path: '',
    component: TransaccionComponent,
    children: [
      { path: 'gastosEmbarcacion', component: GastosEmbarcacionComponent },
      { path: 'descarga', component: DescargaComponent },
      { path: 'ingreso', component: IngresoComponent },
      { path: 'liquidacion', component: LiquidacionComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), DevUIModule, FormsModule, SharedModule],
  exports: [RouterModule],
  declarations: [

  ],
})
export class TransaccionRoutingModule {}

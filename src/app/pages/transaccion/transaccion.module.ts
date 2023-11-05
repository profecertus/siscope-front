import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DescargaComponent } from './descarga/descarga.component';
import { PlanillaComponent } from './planilla/planilla.component';
import { OperativosComponent } from './operativos/operativos.component';
import { AdministrativosComponent } from './administrativos/administrativos.component';
import { IngresoComponent } from './ingreso/ingreso.component';
import { LiquidacionComponent } from './liquidacion/liquidacion.component';
import { TransaccionComponent } from './transaccion.component';
import { TransaccionRoutingModule } from './transaccion-routing.module';



@NgModule({
  declarations: [
    TransaccionComponent,
    DescargaComponent,
    PlanillaComponent,
    OperativosComponent,
    AdministrativosComponent,
    IngresoComponent,
    LiquidacionComponent
  ],
  imports: [
    TransaccionRoutingModule,
    CommonModule
  ]
})
export class TransaccionModule { }

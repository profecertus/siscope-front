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
import { BreadcrumbModule, DevUIModule } from '@devui';
import { TranslateModule } from '@ngx-translate/core';
import { GastosEmbarcacionComponent } from './gastos-embarcacion/gastos-embarcacion.component';
import { FormsModule } from '@angular/forms';
import { AdminFormModule } from '../../../../schematics/src/ng-add/files/src/app/@shared/components/admin-form';
import { DaGridModule } from '../../../../schematics/src/ng-add/files/src/app/@shared/layouts/da-grid';
import { HorizontalFormComponent } from './gastos-embarcacion/horizontal-form/horizontal-form.component';

@NgModule({
  declarations: [
    TransaccionComponent,
    DescargaComponent,
    PlanillaComponent,
    HorizontalFormComponent,
    OperativosComponent,
    AdministrativosComponent,
    IngresoComponent,
    LiquidacionComponent,
    GastosEmbarcacionComponent
  ],
  imports: [
    TransaccionRoutingModule,
    CommonModule,
    BreadcrumbModule,
    DaGridModule,
    TranslateModule,
    DevUIModule,
    FormsModule,
    AdminFormModule,
    DaGridModule,
  ],
})
export class TransaccionModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DescargaComponent } from './descarga/descarga.component';
import { PlanillaComponent } from './planilla/planilla.component';
import { OperativosComponent } from './operativos/operativos.component';
import { AdministrativosComponent } from './administrativos/administrativos.component';
import { PagosComponent } from './pagos/pagos.component';
import { LiquidacionComponent } from './liquidacion/liquidacion.component';
import { TransaccionComponent } from './transaccion.component';
import { TransaccionRoutingModule } from './transaccion-routing.module';
import { BreadcrumbModule, DevUIModule } from '@devui';
import { TranslateModule } from '@ngx-translate/core';
import { GastosEmbarcacionComponent } from './gastos-embarcacion/gastos-embarcacion.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminFormModule } from '../../../../schematics/src/ng-add/files/src/app/@shared/components/admin-form';
import { NuevaDescargaComponent } from './descarga/nueva-descarga/nueva-descarga.component';
import { DaGridModule } from '../../@shared/layouts/da-grid';
import { I18nModule } from 'ng-devui/i18n';
import { NuevoArriboComponent } from './descarga/nuevo-arribo/nuevo-arribo.component';

@NgModule({
  declarations: [
    TransaccionComponent,
    DescargaComponent,
    PlanillaComponent,
    OperativosComponent,
    AdministrativosComponent,
    PagosComponent,
    LiquidacionComponent,
    GastosEmbarcacionComponent,
    NuevaDescargaComponent,
    NuevoArriboComponent
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
    ReactiveFormsModule,
    DaGridModule,
    I18nModule,
  ],
})
export class TransaccionModule { }

import { NgModule } from '@angular/core';
import {MaestroComponent } from './maestro.component';
import {
  AvatarModule,
  BreadcrumbModule,
  ButtonModule,
  DataTableModule, DevUIModule,
  DialogService,
  LoadingModule,
  PaginationModule, SelectModule, TagsModule,
} from '@devui';
import { MaestroRoutingModule } from './maestro-routing.module';
import { EmbarcacionComponent } from './embarcacion/embarcacion.component';
import { CamaraComponent } from './camara/camara.component';
import { PlantaComponent } from './planta/planta.component';
import { TranslateModule } from '@ngx-translate/core';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProveedorComponent } from './proveedor/proveedor.component';
import { I18nModule } from 'ng-devui/i18n';
import { CommonModule } from '@angular/common';

import { AdminFormModule } from '../../../../schematics/src/ng-add/files/src/app/@shared/components/admin-form';

import { DaGridModule } from '../../../../schematics/src/ng-add/files/src/app/@shared/layouts/da-grid';
import { TrabajadorComponent } from './trabajador/trabajador.component';
import { SemanaComponent } from './semana/semana.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TipoCambioComponent } from './tipo-cambio/tipo-cambio.component';

@NgModule({
  declarations: [
    MaestroComponent,
    EmbarcacionComponent,
    CamaraComponent,
    PlantaComponent,
    ProveedorComponent,
    TrabajadorComponent,
    SemanaComponent,
    TipoCambioComponent,
  ],
  imports: [
    MaestroRoutingModule,
    AdminFormModule,
    AvatarModule,
    BreadcrumbModule,
    ButtonModule,
    CommonModule,
    DaGridModule,
    DataTableModule,
    LoadingModule,
    PaginationModule,
    ReactiveFormsModule,
    SelectModule,
    TagsModule,
    TranslateModule,
    NgClass,
    FormsModule,
    DevUIModule,
    I18nModule,
    AdminFormModule,
    AdminFormModule,
    DaGridModule,
    DaGridModule,

  ],
  providers: [DialogService],
})
export class MaestroModule {

}

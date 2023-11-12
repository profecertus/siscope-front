import { NgModule } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { TarifarioComponent } from './tarifario.component';
import { RouterOutlet } from '@angular/router';
import { GeneralComponent } from './general/general.component';
import { TarifarioRoutingModule } from './tarifario-routing.module';
import { AdminFormModule } from '../../../../schematics/src/ng-add/files/src/app/@shared/components/admin-form';
import {
  AvatarModule,
  BreadcrumbModule,
  ButtonModule,
  DataTableModule, DevUIModule, DialogService,
  LoadingModule,
  PaginationModule,
  SelectModule, TagsModule,
} from '@devui';
import { DaGridModule } from '../../../../schematics/src/ng-add/files/src/app/@shared/layouts/da-grid';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { I18nModule } from 'ng-devui/i18n';



@NgModule({
  declarations: [
    TarifarioComponent,
    GeneralComponent
  ],
  imports: [
    TarifarioRoutingModule,
    CommonModule,
    RouterOutlet,
    AdminFormModule,
    AvatarModule,
    BreadcrumbModule,
    ButtonModule,
    DataTableModule,
    LoadingModule,
    PaginationModule,
    SelectModule,
    TagsModule,
    TranslateModule,
    NgClass,
    FormsModule,
    DevUIModule,
    I18nModule,
    DaGridModule,
  ],
  providers: [DialogService],
})
export class TarifarioModule { }

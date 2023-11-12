import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { TarifarioComponent } from './tarifario.component';
import { GeneralComponent } from './general/general.component';


const routes: Routes = [
  {
    path: '',
    component: TarifarioComponent,
    children: [
      { path: 'general', component: GeneralComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TarifarioRoutingModule {}

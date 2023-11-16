import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { TarifarioComponent } from './tarifario.component';
import { GeneralComponent } from './general/general.component';
import { EmbarcacionComponent } from './embarcacion/embarcacion.component'
import { PlantaComponent } from './planta/planta.component';
import { CamaraComponent } from './camara/camara.component';



const routes: Routes = [
  {
    path: '',
    component: TarifarioComponent,
    children: [
      { path: 'general', component: GeneralComponent },
      { path: 'embarcacion', component: EmbarcacionComponent },
      { path: 'planta', component: PlantaComponent },
      { path: 'camara', component: CamaraComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TarifarioRoutingModule {}

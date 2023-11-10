import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { TarifarioComponent } from './tarifario.component';
import { PetroleoComponent } from './petroleo/petroleo.component';


const routes: Routes = [
  {
    path: '',
    component: TarifarioComponent,
    children: [
      { path: 'petroleo', component: PetroleoComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TarifarioRoutingModule {}

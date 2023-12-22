import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { MaestroComponent } from './maestro.component';
import { EmbarcacionComponent } from './embarcacion/embarcacion.component';
import { CamaraComponent } from './camara/camara.component';
import { PlantaComponent } from './planta/planta.component';
import { ProveedorComponent } from './proveedor/proveedor.component';
import { TrabajadorComponent } from './trabajador/trabajador.component';
import { SemanaComponent } from './semana/semana.component';
import { TipoCambioComponent } from './tipo-cambio/tipo-cambio.component';

const routes: Routes = [
  {
    path: '',
    component: MaestroComponent,
    children: [
      { path: 'proveedor', component: ProveedorComponent },
      { path: 'embarcacion', component: EmbarcacionComponent },
      { path: 'camara', component: CamaraComponent },
      { path: 'planta', component: PlantaComponent },
      { path: 'trabajador', component:TrabajadorComponent },
      { path: 'semana', component:SemanaComponent },
      { path: 'tipoCambio', component:TipoCambioComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MaestroRoutingModule {}

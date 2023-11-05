import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { MaestroComponent } from './maestro.component';
import { EmbarcacionComponent } from './embarcacion/embarcacion.component';
import { CamaraComponent } from './camara/camara.component';
import { PlantaComponent } from './planta/planta.component';
import { OperativoComponent } from './operativo/operativo.component';
import { AdministrativoComponent } from './administrativo/administrativo.component';
import { ProveedorComponent } from './proveedor/proveedor.component';
import { TrabajadorComponent } from './trabajador/trabajador.component';

const routes: Routes = [
  {
    path: '',
    component: MaestroComponent,
    children: [
      { path: 'proveedor', component: ProveedorComponent },
      { path: 'embarcacion', component: EmbarcacionComponent },
      { path: 'camara', component: CamaraComponent },
      { path: 'planta', component: PlantaComponent },
      { path: 'operativo', component: OperativoComponent },
      { path: 'trabajador', component:TrabajadorComponent },
      { path: 'administrativo', component: AdministrativoComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MaestroRoutingModule {}

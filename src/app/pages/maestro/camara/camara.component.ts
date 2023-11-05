import { ChangeDetectorRef, Component, TemplateRef, ViewChild } from '@angular/core';
import { ProveedorModel, RespuestaProveedor } from '../../../model/proveedor.model';
import { FormConfig } from '../../../@shared/components/admin-form';
import { DialogService, FormLayout } from '@devui';
import { Subscription } from 'rxjs';
import { RespuestaPlanta } from '../../../model/planta.modelo';
import Swal from 'sweetalert2';
import { CamaraService } from '../../../service/camara.service';
import { ProveedorService } from '../../../service/proveedor.service';
import { Camara } from '../../../model/camara.model';

@Component({
  selector: 'app-camara',
  templateUrl: './camara.component.html',
  styleUrls: ['./camara.component.scss']
})
export class CamaraComponent {
  basicDataSource: RespuestaProveedor[] = [];
  basicDataSourceBkp: RespuestaProveedor[] = [];
  proveedores:ProveedorModel[] =[];
  DatoABuscar: string = "";
  accion:number = 0;


  formConfig: FormConfig = {
    layout: FormLayout.Horizontal,
    items: [
      {
        label: 'Placa',
        prop: 'placa',
        type: 'input',
        required: true,
        deep: 1,
        tips: 'Placa',
        placeholder: 'Placa de la Camara',
        rule:{validators: [{ required: true }]},
      },
      {
        label: 'Marca',
        prop: 'marca',
        type: 'input',
        deep: 1,
        placeholder: 'Marca',
      },
      {
        label: 'Modelo',
        prop: 'modelo',
        type: 'input',
        deep: 1,
        placeholder: 'Modelo',
      },
      {
        label: 'Proveedor',
        prop: 'idProveedor',
        cabecera:'idProveedor',
        type: 'select',
        deep: 1,
        options: [], //Se cargan luego
        placeholder: 'Proveedor',
        filterKey: 'razonSocial',
        multipleselect: [],
        required: true,
        rule:{validators: [{ required: true }]},
      },
    ],
    labelSize: '',
  };

  formData = {};

  editForm: any = null;

  editRowIndex = -1;


  pager = {
    total: 0,
    pageIndex: 1,
    pageSize: 10,
  };

  busy: Subscription = new Subscription() ;

  @ViewChild('EditorTemplate', { static: true })
  EditorTemplate: TemplateRef<any> | undefined;

  constructor(private dialogService: DialogService, private cdr: ChangeDetectorRef,
              private camaraService: CamaraService, private proveedorService: ProveedorService
  ) {}

  ngOnInit() {
    this.getList();
    this.getListProveedor();
  }


  getList() {
    return this.busy = this.camaraService.obtenerCamaras((this.pager.pageIndex - 1), this.pager.pageSize).
    pipe().subscribe((elemento) => {
      let res : RespuestaPlanta[]  = elemento.content;
      //console.log(res);
      this.basicDataSource = res;
      this.basicDataSourceBkp = res;
      this.pager.total = elemento.totalElements;
    });
  }

  getListProveedor(){
    return this.busy = this.proveedorService.obtenerProveedoresCamara().
    pipe().subscribe((elemento) => {
      this.proveedores = elemento;
    });
  }


  editRow(row: any, index: number) {
    this.editRowIndex = index;
    this.accion = 0;
    this.formData = row;
    this.formConfig.items[3].options = this.proveedores;
    this.editForm = this.dialogService.open({
      id: 'edit-dialog',
      width: '600px',
      maxHeight: '600px',
      title: 'Plantas - Edición',
      showAnimate: false,
      contentTemplate: this.EditorTemplate,
      backdropCloseable: true,
      onClose: () => {},
      buttons: [],
    });
  }

  refresh():void{
    this.getList();
  }
  newRow():void {
    let row = new Camara();
    this.editRowIndex = -1;
    this.accion = 1;
    this.formData = row;
    this.formConfig.items[3].options = this.proveedores;
    this.editForm = this.dialogService.open({
      id: 'edit-dialog',
      width: '600px',
      maxHeight: '600px',
      title: 'Plantas - Nuevo',
      showAnimate: false,
      contentTemplate: this.EditorTemplate,
      backdropCloseable: true,
      onClose: () => {},
      buttons: [],
    });
  }

  deleteRow(e: Camara, index: number) {
    e.estadoReg = false;
    this.accion = -1;
    Swal.fire({
      title: '¿Seguro de eliminar la Camara?',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.camaraService.guardarCamara(e).forEach(value => {
          console.log(e)
          e.placa = value;
        }).then(value => {
          this.basicDataSource.splice(index, 1);
          Swal.fire('Exito','Camara Eliminada!','success');
        }).catch( error =>{
          Swal.fire('Error',"Hubo Problemas al Eliminar la Camara, intentelo más tarde",'error');
        }).finally(()=>{
          this.editForm!.modalInstance.hide();
        });
      }
    })
  }

  onSearch(term: any) {
    this.basicDataSource = this.basicDataSourceBkp;
    this.basicDataSource = this.basicDataSource.filter(element => {
      for (const key in element) {
        if (Object.hasOwnProperty.call(element, key)) {
          if (element[key] == null) continue;
          if (element[key].toString().toLowerCase().includes(term.toLowerCase())) {
            return true;
          }
        }
      }
      return false;
    });


  }

  onPageChange(e: number) {
    this.pager.pageIndex = e;
    this.getList();
  }

  onSizeChange(e: number) {
    this.pager.pageSize = e;
    this.getList();
  }

  reset() {
    this.pager.pageIndex = 1;
    this.DatoABuscar = "";
    this.getList();
  }

  onSubmitted(e: Camara) {
    let mensaje:string="Se actualizo correctamente la Camara";
    Swal.showLoading( );
    if (this.accion == 1){
      mensaje = "Se grabo correctamente la Camara";
    }
    this.camaraService.guardarCamara(e).forEach(value => {let valor = value;}).then(value  => {
      if(this.accion == 1)
        this.basicDataSource.push(e);
      else
        this.basicDataSource.splice(this.editRowIndex, 1, e);
      this.basicDataSourceBkp = this.basicDataSource;
      Swal.fire('Exito',mensaje,'success');
    }).catch( (error: any) =>{
      console.log(error);
      Swal.fire('Error',"Hubo Problemas al grabar la Camara." + error,'error');
    }).finally(()=>{
      this.editForm!.modalInstance.hide();
    });
  }

  onCanceled() {
    this.editForm!.modalInstance.hide();
    this.editRowIndex = -1;
  }
}

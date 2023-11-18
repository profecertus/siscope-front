import { ChangeDetectorRef, Component, TemplateRef, ViewChild } from '@angular/core';
import { ProveedorModel } from '../../../model/proveedor.model';
import { FormConfig } from '../../../@shared/components/admin-form';
import { DialogService, FormLayout } from '@devui';
import { Subscription } from 'rxjs';
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
  basicDataSource: Camara[] = [];
  basicDataSourceBkp: Camara[] = [];
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
        maxi:10,
        tips: 'Placa',
        placeholder: 'Placa de la Camara',
        rule:{validators: [{ required: true }]},
      },
      {
        label: 'Marca',
        prop: 'marca',
        type: 'input',
        deep: 1,
        maxi:50,
        placeholder: 'Marca',
      },
      {
        label: 'Modelo',
        prop: 'modelo',
        type: 'input',
        deep: 1,
        maxi:50,
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
      {
        label: 'Estado',
        prop: 'estado',
        type: 'switch',
        deep: 1,
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
      let res : Camara[]  = elemento.content;
      this.basicDataSource = res;
      this.basicDataSourceBkp = res;
      this.pager.total = elemento.totalElements;
    });
  }

  getListProveedor(){
    //Obtengo los proveedores y filtro por FLETE (06)
    return this.busy = this.proveedorService.obtenerProveedoresCamara().
    pipe().subscribe((elemento) => {
      this.proveedores = elemento.filter(item =>
          item.relProvTiposervDto.filter((valor) => valor['idTipoServicio'].id == 6).length > 0
      );
    });
  }


  editRow(row: any, index: number) {
    this.editRowIndex = index;
    this.accion = 0;
    this.formData = row;
    this.formConfig.items[3].options = this.proveedores;
    this.editForm = this.dialogService.open({
      id: 'edit-dialog',
      width: '700px',
      maxHeight: '600px',
      title: 'Camaras - Edición',
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
      width: '700px',
      maxHeight: '600px',
      title: 'Camaras - Nuevo',
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
      title: '¿Seguro de eliminar la Cámara?',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.camaraService.guardarCamara(e).forEach(value => {
          e.placa = value;
        }).then(() => {
          this.basicDataSource.splice(index, 1);
          Swal.fire('Exito','Cámara Eliminada!','success');
        }).catch( error =>{
          console.log(error);
          Swal.fire('Error',"Hubo Problemas al Eliminar la Cámara, intentelo más tarde",'error');
        }).finally(()=>{
          this.editForm!.modalInstance.hide();
        });
      }
    })
  }

  onSearch(term: any) {
    this.basicDataSource = this.basicDataSourceBkp;
    this.basicDataSource = this.basicDataSource.filter(element => {
      if(term == null || term.toString().trim().length == 0)
        return true;
      if(JSON.stringify(element, null, 2).toLowerCase().indexOf( term.toLowerCase() ) > 0)
        return true;
      /*
      for (const key in element) {
        if (Object.hasOwnProperty.call(element, key)) {
          if (element[key] == null) continue;
          if (element[key].toString().toLowerCase().includes(term.toLowerCase())) {
            return true;
          }
        }
      }
      */
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
    let mensaje:string="Se actualizo correctamente la Cámara";
    Swal.showLoading( );
    if (this.accion == 1){
      mensaje = "Se grabó correctamente la Cámara";
    }
    this.camaraService.guardarCamara(e).forEach(() => {}).then(()  => {
      if(this.accion == 1)
        this.basicDataSource.push(e);
      else
        this.basicDataSource.splice(this.editRowIndex, 1, e);
      this.basicDataSourceBkp = this.basicDataSource;
      Swal.fire('Exito',mensaje,'success');
      this.editForm!.modalInstance.hide();
    }).catch( (error: any) =>{
      console.log(error);
      Swal.fire('Error',"Hubo Problemas al grabar la Cámara." + error,'error');
    });
  }

  onCanceled() {
    this.editForm!.modalInstance.hide();
    this.editRowIndex = -1;
  }
}

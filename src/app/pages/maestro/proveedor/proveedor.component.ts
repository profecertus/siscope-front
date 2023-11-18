import { ChangeDetectorRef, Component, TemplateRef, ViewChild } from '@angular/core';
import { DialogService, FormLayout } from '@devui';
import { FormConfig } from '../../../@shared/components/admin-form';
import { Subscription } from 'rxjs';
import { ProveedorService } from '../../../service/proveedor.service';
import { TipodocumentoService } from '../../../service/tipodocumento.service';
import { TiposervicioService } from '../../../service/tiposervicio.service';
import { RespuestaProveedor, TipoDocumento } from '../../../model/proveedor.model';
import { TipoServicio } from '../../../model/tipoServicio.model';
import  Swal  from 'sweetalert2';




@Component({
  selector: 'app-proveedor',
  templateUrl: './proveedor.component.html',
  styleUrls: ['./proveedor.component.scss']
})
export class ProveedorComponent {
  basicDataSource: RespuestaProveedor[] = [];
  basicDataSourceBkp: RespuestaProveedor[] = [];
  tipoDocSource: TipoDocumento[] = [];
  tipoServicicioSource: TipoServicio[] = [];
  DatoABuscar: string = "";
  accion:number = 0;


  formConfigTrab: FormConfig = {
    layout: FormLayout.Horizontal,
    items:[
      {
        label: 'Tipo Doc.',
        prop: 'id_tipodoc',
        type: 'select',
        filterKey: 'nombre',
        required: true,
        deep: 1,
        options:[{}],
        cabecera: 'id_tipodoc',
        tips: 'Tipo Documento',
        placeholder: 'Tipo de Documento',
        rule:{validators: [{ required: true }]},
      },
      {
        label: 'Num Doc.',
        prop: 'numero_documento',
        type: 'input',
        required: true,
        deep: 1,
        tips: 'Número Documento',
        placeholder: 'Numero de Documento',
        rule:{validators: [{ required: true }]},
      },
      {
        label: 'Nombre',
        prop: 'nombre',
        type: 'input',
        placeholder: 'Apellido Paterno',
        deep: 1,
      },
      {
        label: 'Ape Pat.',
        prop: 'apellido_pat',
        type: 'input',
        deep: 1,
        placeholder: 'Apellido Paterno',
      },
      {
        label: 'Ape Mat.',
        prop: 'apellido_mat',
        type: 'input',
        deep: 1,
        placeholder: 'Apellido Materno',
      },
    ],
    labelSize: '',
  };

  formConfig: FormConfig = {
    layout: FormLayout.Horizontal,
    items: [
      {
        label: 'Razón Soc.',
        prop: 'razonSocial',
        type: 'input',
        required: true,
        maxi:100,
        deep: 2,
        cabecera: 'proveedor',
        tips: 'Consigne la razón social',
        placeholder: 'Ingrese la razón social',
        rule:{validators: [{ required: true }]},
      },
      {
        label: 'Nom Comercial',
        prop: 'nombreComercial',
        maxi:100,
        type: 'input',
        placeholder: 'Ingrese el nombre comercial',
        deep: 2,
        cabecera: 'proveedor',
      },
      {
        label: 'Tipo Doc.',
        prop: 'idTipodoc',
        deep: 2,
        cabecera:'proveedor',
        type: 'select',
        placeholder: 'Seleccione el documento',
        filterKey: 'nombre',
        required: true,
        rule:{validators: [{ required: true }]},
        options:  this.tipoDocSource ,
        tips: 'Ingrese el tipo Documento',
      },
      {
        label: 'Num. Doc.',
        prop: 'numeroDocumento',
        type: 'number',
        deep: 2,
        cabecera: 'proveedor',
        maxi:20,
        required: true,
        tips: 'Numero de Documento',
        placeholder: 'Ingrese el numero de documento',
        rule:{validators: [{ required: true }]},
      },
      {
        label: 'Provee',
        prop: 'tipoServicioDtos',
        type: 'multiselect',
        deep: 1,
        cabecera:'tipoServicioDtos',
        options: [], //Se cargan luego
        placeholder: 'Seleccione el tipo de Bien/Servicio',
        filterKey: 'nombre',
        multipleselect: [],
        required: true,
        rule:{validators: [{ required: true }]},
      },
      {
        label: 'Dirección',
        prop: 'direccion',
        type: 'input',
        deep: 2,
        maxi:100,
        cabecera: 'proveedor',
        placeholder: 'Ingrese la dirección',
      },
      {
        label: 'Teléfono',
        prop: 'telefono',
        type: 'number',
        maxi:15,
        deep: 2,
        cabecera: 'proveedor',
        placeholder: 'Ingrese le número telefónico',
      },
      {
        label: 'Correo',
        prop: 'correo',
        type: 'input',
        deep: 2,
        maxi:70,
        cabecera: 'proveedor',
        placeholder: 'Ingrese el correo electrónico',
      },
      {
        label: 'Estado',
        cabecera:'proveedor',
        prop: 'estado',
        type: 'switch',
        deep: 2,
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

  @ViewChild('RelProveedorTrabajador', { static: true })
  RelProveedorTrabajador: TemplateRef<any> | undefined;

  @ViewChild('EditorRelProveedorTrabajador', { static: true })
  EditorRelProveedorTrabajador: TemplateRef<any> | undefined;


  constructor(private dialogService: DialogService, private cdr: ChangeDetectorRef,
              private proveedorService: ProveedorService, private tipodocumentoService: TipodocumentoService,
              private tiposervicioService: TiposervicioService) {}

  ngOnInit() {
    this.getListTipoServicio();
    this.getListTipoDocumento();
    this.getList();
  }

  ordenarPorCampo(data: any[], campo: string) {
    return data.sort((a, b) => {
      if (a[campo] < b[campo]) {
        return -1;
      }
      if (a[campo] > b[campo]) {
        return 1;
      }
      return 0;
    })
  }

  getList() {
    return this.busy = this.proveedorService.obtenerProveedores((this.pager.pageIndex - 1), this.pager.pageSize).pipe().subscribe((elemento) => {
      let res : RespuestaProveedor[]  = elemento.content;
      this.basicDataSource = res;
      this.basicDataSourceBkp = res;
      this.pager.total = elemento.totalElements;
    });
  }

  getServicios(elem:any[]){
    let retorno = "";
    for (const elemento of elem) {
      retorno = retorno + elemento.nombre + " / ";
    }
    return retorno.slice(0, -3);
  }

  getListTipoServicio() {
    this.busy = this.tiposervicioService.obtenerTiposServicios().subscribe((res:TipoServicio[]) => {
      this.tipoServicicioSource = res;
    });
  }

  getListTipoDocumento() {
    this.busy = this.tipodocumentoService.obtenerTipoDocumentos().subscribe((res:TipoDocumento[]) => {
      this.tipoDocSource =res;
    });
  }

  editRow(row: any, index: number) {
    this.accion = 0;
    this.editRowIndex = index;
    this.formData = row;
    this.formConfig.items[2].options = this.tipoDocSource;
    this.formConfig.items[4].options = this.tipoServicicioSource;
    this.editForm = this.dialogService.open({
      id: 'edit-dialog',
      width: '700px',
      maxHeight: '600px',
      title: 'Proveedores - Edición',
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
    this.accion = 1;
    let row = new RespuestaProveedor();
    this.editRowIndex = -1;
    this.formConfig.items[2].options = this.tipoDocSource;
    this.formConfig.items[4].options = this.tipoServicicioSource;
    this.formData = row;
    this.editForm = this.dialogService.open({
      id: 'edit-dialog',
      width: '700px',
      maxHeight: '600px',
      title: 'Proveedores - Nuevo',
      showAnimate: false,
      contentTemplate: this.EditorTemplate,
      backdropCloseable: true,
      onClose: () => {},
      buttons: [],
    });
  }

  deleteRow(e: any, index: number) {
    e.proveedor.estadoReg = false;
    Swal.fire({
      title: '¿Seguro de eliminar el Proveedor?',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.proveedorService.guardarProveedor(e).forEach(value => {
          e.proveedor.id = value.valorDevuelto;
        }).then(() => {
          this.basicDataSource.splice(index, 1);
          Swal.fire('Exito','Proveedor Eliminado!','success');
        }).catch( error =>{
          console.log(error);
          Swal.fire('Error',"Hubo Problemas al Eliminar el proveedor, intentelo más tarde",'error');
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
      for (const key in element.proveedor) {
        if (Object.hasOwnProperty.call(element.proveedor, key)) {
          if (element.proveedor[key] == null) continue;
          if (element.proveedor[key].toString().toLowerCase().includes(term.toLowerCase())) {
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

  onSubmitted(e: any) {
    let mensaje:string="Se actualizo correctamente el proveedor";
    Swal.showLoading( );
    //En caso sea modificación.
    if (this.accion == 1){
      e.proveedor.id = null;
      mensaje = "Se grabó correctamente el proveedor";
    }

    if (e.proveedor.idTipodoc.abreviatura == 'RUC'){
      let ruc : number = parseInt( e.proveedor.numeroDocumento );
      if( ruc > 9999999999 ){

        //Valido el numero de RUC
        for (var suma = -(ruc%10<2), i = 0; i<11; i++, ruc = ruc/10|0)
          suma += (ruc % 10) * (i % 7 + (i/7|0) + 1);
        if(suma % 11 !== 0){
          Swal.fire('Error',"El número de RUC ingresado NO es válido!",'error');
          return;
        }
      }else{
        Swal.fire('Error',"El número de RUC ingresado NO tiene los 11 digitos",'error');
        return;
      }
    }



    this.proveedorService.guardarProveedor(e).forEach(value => {
      e.proveedor.id = value.valorDevuelto;
    }).then(() => {
      if(this.accion == 0)
        this.basicDataSource.splice(this.editRowIndex, 1, e);
      else
        this.basicDataSource.push(e);
      this.basicDataSourceBkp = this.basicDataSource;
      //Ahora debo de actualizar la relación proveedor con servicio.
      Swal.fire('Exito',mensaje,'success');
      this.editForm!.modalInstance.hide();
    }).catch( error =>{
      console.log(error);
      Swal.fire('Error',"Hubo Problemas al grabar el proveedor, verifique que el tipo y numero de documento no Exista",'error');
    });
  }

  onCanceled() {
    this.editForm!.modalInstance.hide();
    this.editRowIndex = -1;
  }

}

import { ChangeDetectorRef, Component, TemplateRef, ViewChild } from '@angular/core';
import { FormConfig } from '../../../@shared/components/admin-form';
import { DialogService, FormLayout } from '@devui';
import { Subscription } from 'rxjs';
import { RespuestaPlanta } from '../../../model/planta.modelo';
import Swal from 'sweetalert2';
import { Trabajador } from '../../../model/trabajador.model';
import { TrabajadorService } from '../../../service/trabajador.service';

@Component({
  selector: 'app-trabajador',
  templateUrl: './trabajador.component.html',
  styleUrls: ['./trabajador.component.scss']
})
export class TrabajadorComponent {
  basicDataSource: Trabajador[] = [];
  basicDataSourceBkp: Trabajador[] = [];
  DatoABuscar: string = "";


  formConfig: FormConfig = {
    layout: FormLayout.Horizontal,
    items: [
      {
        label: 'Tipo Doc.',
        cabecera: 'idTipodoc',
        prop: 'nombre',
        type: 'select',
        deep: 2,
        options: [], //Se cargan luego
        placeholder: 'Tipo Documento',
        filterKey: 'nombre',
        multipleselect: [],
        required: true,
        rule:{validators: [{ required: true }]},
      },
      {
        label: 'Núm. Doc.',
        prop: 'numeroDocumento',
        type: 'input',
        required: true,
        deep: 1,
        tips: 'Numero documento',
        placeholder: 'Número de Documento',
        rule:{validators: [{ required: true }]},
      },
      {
        label: 'Nombres',
        prop: 'nombres',
        type: 'input',
        required: false,
        deep: 1,
        tips: 'Nombres',
        placeholder: 'Nombres',
      },
      {
        label: 'Ape. Pat',
        prop: 'apellidoPat',
        type: 'input',
        required: false,
        deep: 1,
        tips: 'Apellido Paterno',
        placeholder: 'Apellido Paterno',
      },
      {
        label: 'Ape. Mat',
        prop: 'apellidoMat',
        type: 'input',
        required: false,
        deep: 1,
        tips: 'Apellido Materno',
        placeholder: 'Apellido Materno',
      },
      {
        label: 'Frm Pago',
        cabecera: 'idFormaPago',
        prop: 'nombre',
        type: 'select',
        deep: 2,
        options: [], //Se cargan luego
        placeholder: 'Forma Pago',
        filterKey: 'nombre',
        multipleselect: [],
        required: true,
        rule:{validators: [{ required: true }]},
      },
      {
        label: 'Moneda',
        cabecera: 'idMoneda',
        prop: 'nombre',
        type: 'select',
        deep: 2,
        options: [], //Se cargan luego
        placeholder: 'Moneda',
        filterKey: 'nombre',
        multipleselect: [],
        required: true,
        rule:{validators: [{ required: true }]},
      },
      {
        label: 'Banco',
        cabecera: 'idBanco',
        prop: 'nombreBanco',
        type: 'select',
        deep: 2,
        options: [], //Se cargan luego
        placeholder: 'Banco',
        filterKey: 'nombreBanco',
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
              private trabajadorService: TrabajadorService
  ) {}

  ngOnInit() {
    this.getList();
  }

  getList() {
    return this.busy = this.trabajadorService.obtenerTrabajadores((this.pager.pageIndex - 1), this.pager.pageSize).
    pipe().subscribe((elemento) => {
      let res : Trabajador[]  = elemento.content;
      this.basicDataSource = res;
      this.basicDataSourceBkp = res;
      this.pager.total = elemento.totalElements;
    });
  }


  editRow(row: any, index: number) {
    this.editRowIndex = index;
    this.formData = row;
    //this.formConfig.items[2].options = this.destinos;
    //this.formConfig.items[3].options = this.clientes;
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
    let row = new Trabajador();
    this.editRowIndex = -1;
    this.formData = row;
    //this.formConfig.items[2].options = this.destinos;
    //this.formConfig.items[3].options = this.clientes;
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

  deleteRow(e: any, index: number) {
    e.estadoReg = false;
    Swal.fire({
      title: '¿Seguro de eliminar al Tabajador?',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.trabajadorService.guardarTrabajador(e).forEach(value => {
          //console.log(e.plantaDto)
          e.plantaDto.idPlanta = value;
        }).then(value => {
          this.basicDataSource.splice(index, 1);
          Swal.fire('Exito','Trabajador Eliminado!','success');
        }).catch( error =>{
          Swal.fire('Error',"Hubo Problemas al Eliminar el Trabajador, intentelo más tarde",'error');
        }).finally(()=>{
          this.editForm!.modalInstance.hide();
        });
      }
    })
  }

  onSearch(term: any) {
    this.basicDataSource = this.basicDataSourceBkp;
    this.basicDataSource = this.basicDataSource.filter(element => {
      for (const key in element.plantaDto) {
        if (Object.hasOwnProperty.call(element.plantaDto, key)) {
          if (element.plantaDto[key] == null) continue;
          if (element.plantaDto[key].toString().toLowerCase().includes(term.toLowerCase())) {
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

  onSubmitted(e: any) {
    let mensaje:string="Se actualizo correctamente al Trabajador";
    Swal.showLoading( );
    //En caso sea modificación.
    if (!(e.plantaDto.idPlanta > 0)){
      e.plantaDto.idPlanta = null;
      mensaje = "Se grabo correctamente al Trabajador";
    }

    this.trabajadorService.guardarTrabajador(e).forEach(value => {
      e.plantaDto.idPlanta = value;
    }).then(value => {
      if(e.plantaDto.idPlanta>0)
        this.basicDataSource.splice(this.editRowIndex, 1, e);
      else
        this.basicDataSource.push(e);
      this.basicDataSourceBkp = this.basicDataSource;
      //Ahora debo de actualizar la relación proveedor con servicio.
      Swal.fire('Exito',mensaje,'success');
    }).catch( error =>{
      Swal.fire('Error',"Hubo Problemas al grabar al Trabajador.",'error');
    }).finally(()=>{
      this.editForm!.modalInstance.hide();
    });
  }

  onCanceled() {
    this.editForm!.modalInstance.hide();
    this.editRowIndex = -1;
  }
}

import { ChangeDetectorRef, Component, TemplateRef, ViewChild } from '@angular/core';
import { FormConfig } from '../../../@shared/components/admin-form';
import { DialogService, FormLayout } from '@devui';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { Trabajador } from '../../../model/trabajador.model';
import { TrabajadorService } from '../../../service/trabajador.service';
import { TipoDocumento } from '../../../model/proveedor.model';
import { TipodocumentoService } from '../../../service/tipodocumento.service';
import { MonedaService } from '../../../service/moneda.service';
import { BancoService } from '../../../service/banco.service';
import { FormaPagoService } from '../../../service/formaPago.service';
import { Moneda } from '../../../model/moneda.model';
import { Banco } from '../../../model/banco.model';
import { FormaPago } from '../../../model/formaPago.model';

@Component({
  selector: 'app-trabajador',
  templateUrl: './trabajador.component.html',
  styleUrls: ['./trabajador.component.scss']
})
export class TrabajadorComponent {
  basicDataSource: Trabajador[] = [];
  basicDataSourceBkp: Trabajador[] = [];
  tipoDocSource: TipoDocumento[] = [];
  bancoSource: Banco[] = [];
  monedaSource: Moneda[] = [];
  formaPagoSource: FormaPago[] = [];
  DatoABuscar: string = "";
  accion:number = 0; //0 = Editar 1=Nuevo


  formConfig: FormConfig = {
    layout: FormLayout.Horizontal,
    items: [
      {
        label: 'Tipo Doc.',
        cabecera: 'idTipodoc',
        prop: 'idTipodoc',
        type: 'select',
        deep: 1,
        options: [], //Se cargan luego
        placeholder: 'Tipo Documento',
        filterKey: 'nombre',
        multipleselect: [],
        required: true,
        rule:{validators: [{ required: true }]},
      },
      {
        label: 'Núm. Doc.',
        cabecera: 'id',
        prop: 'numeroDocumento',
        type: 'input',
        required: true,
        deep: 2,
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
        prop: 'idFormaPago',
        type: 'select',
        deep: 1,
        options: [], //Se cargan luego
        placeholder: 'Forma Pago',
        filterKey: 'nombreFormaPago',
        multipleselect: [],
        required: true,
        rule:{validators: [{ required: true }]},
      },
      {
        label: 'Moneda',
        prop: 'idMoneda',
        type: 'select',
        deep: 1,
        options: [], //Se cargan luego
        placeholder: 'Moneda',
        filterKey: 'nombre',
        multipleselect: [],
        required: true,
        rule:{validators: [{ required: true }]},
      },
      {
        label: 'Banco',
        prop: 'idBanco',
        type: 'select',
        deep: 1,
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
              private trabajadorService: TrabajadorService, private tipodocumentoService: TipodocumentoService,
              private monedaService: MonedaService, private bancoService: BancoService, private formaPagoService: FormaPagoService
  ) {}

  ngOnInit() {
    this.getList();
    this.getListTipoDocumento();
    this.getListMoneda();
    this.getListBanco();
    this.getListFormaPago();
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

  getListTipoDocumento() {
    this.busy = this.tipodocumentoService.obtenerTipoDocumentos().subscribe((res:TipoDocumento[]) => {
      this.tipoDocSource =res;
    });
  }

  getListMoneda(){
    this.busy = this.monedaService.obtenerMonedas().subscribe((res:Moneda[]) =>{
      this.monedaSource =res;
    });
  }

  getListBanco(){
    this.busy = this.bancoService.obtenerBancos().subscribe((res:Banco[]) =>{
      this.bancoSource =res;
    });
  }

  getListFormaPago(){
    this.busy = this.formaPagoService.obtenerFormaPago().subscribe((res:FormaPago[]) =>{
      this.formaPagoSource =res;
    });
  }

  editRow(row: any, index: number) {
    this.accion = 0;
    this.editRowIndex = index;
    this.formData = row;
    this.formConfig.items[0].options = this.tipoDocSource;
    this.formConfig.items[5].options = this.formaPagoSource;
    this.formConfig.items[6].options = this.monedaSource;
    this.formConfig.items[7].options = this.bancoSource;
    this.editForm = this.dialogService.open({
      id: 'edit-dialog',
      width: '600px',
      maxHeight: '600px',
      title: 'Trabajadores - Edición',
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
    let row = new Trabajador();
    this.editRowIndex = -1;
    this.formData = row;
    this.formConfig.items[0].options = this.tipoDocSource;
    this.formConfig.items[5].options = this.formaPagoSource;
    this.formConfig.items[6].options = this.monedaSource;
    this.formConfig.items[7].options = this.bancoSource;
    this.editForm = this.dialogService.open({
      id: 'edit-dialog',
      width: '600px',
      maxHeight: '600px',
      title: 'Trabajadores - Nuevo',
      showAnimate: false,
      contentTemplate: this.EditorTemplate,
      backdropCloseable: true,
      onClose: () => {},
      buttons: [],
    });
  }

  deleteRow(e: Trabajador, index: number) {
    e.estadoReg = false;
    Swal.fire({
      title: '¿Seguro de eliminar al Tabajador?',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        console.log(e);
        this.trabajadorService.guardarTrabajador(e).forEach(value => {
          //e.plantaDto.idPlanta = value;
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

  onSubmitted(e: Trabajador) {
    let mensaje:string="Se actualizo correctamente al Trabajador";
    Swal.showLoading( );
    if (this.accion == 1){
      mensaje = "Se grabo correctamente al Trabajador";
    }
    e.id.idTipodoc = e.idTipodoc.id;
    this.trabajadorService.guardarTrabajador(e).forEach(value => {
      //Sin accion
    }).then(value => {
      if(this.accion == 0)
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

import { Component, TemplateRef, ViewChild } from '@angular/core';
import { DialogService, FormLayout } from '@devui';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { Trabajador } from '../../../model/trabajador.model';
import { TrabajadorService } from '../../../service/trabajador.service';
import { TipoDocumento } from '../../../model/proveedor.model';
import { TipodocumentoService} from '../../../service/tipodocumento.service';
import { MonedaService } from '../../../service/moneda.service';
import { BancoService } from '../../../service/banco.service';
import { FormaPagoService } from '../../../service/formaPago.service';
import { Moneda } from '../../../model/moneda.model';
import { Banco } from '../../../model/banco.model';
import { FormaPago } from '../../../model/formaPago.model';


@Component({
  selector: 'app-descarga',
  templateUrl: './descarga.component.html',
  styleUrls: ['./descarga.component.scss']
})

export class DescargaComponent {
  basicDataSource: Trabajador[] = [];
  basicDataSourceBkp: Trabajador[] = [];
  tipoDocSource: TipoDocumento[] = [];
  bancoSource: Banco[] = [];
  monedaSource: Moneda[] = [];
  formaPagoSource: FormaPago[] = [];
  DatoABuscar: string = "";
  accion:number = 0; //0 = Editar 1=Nuevo

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

  constructor(private dialogService: DialogService,
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
    this.editForm = this.dialogService.open({
      id: 'edit-dialog',
      width: '400px',
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
    this.editForm = this.dialogService.open({
      id: 'edit-dialog',
      width: '800px',
      maxHeight: '1000px',
      title: 'Nueva Descarga de Pesca',
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
        this.trabajadorService.guardarTrabajador(e).forEach(() => {
          //e.plantaDto.idPlanta = value;
        }).then(() => {
          this.basicDataSource.splice(index, 1);
          Swal.fire('Exito', 'Trabajador Eliminado!', 'success').then(()=>{});
        }).catch( error =>{
          console.log(error);
          Swal.fire('Error', "Hubo Problemas al Eliminar el Trabajador, intentelo más tarde", 'error').then(()=>{});
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
      mensaje = "Se grabó correctamente al Trabajador";
    }
    e.id.idTipodoc = e.idTipodoc.id;
    this.trabajadorService.guardarTrabajador(e).forEach(() => {
      //Sin accion
    }).then(() => {
      if(this.accion == 0)
        this.basicDataSource.splice(this.editRowIndex, 1, e);
      else
        this.basicDataSource.push(e);
      this.basicDataSourceBkp = this.basicDataSource;
      //Ahora debo de actualizar la relación proveedor con servicio.
      Swal.fire('Exito', mensaje, 'success').then(()=>{});
      this.editForm!.modalInstance.hide();
    }).catch( error =>{
      console.log(error);
      Swal.fire('Error', "Hubo Problemas al grabar al Trabajador.", 'error').then(()  =>{});
    });
  }

  onCanceled() {
    this.editForm!.modalInstance.hide();
    this.editRowIndex = -1;
  }
}

import { Component, ViewChild } from '@angular/core';
import { DialogService, ToastService } from '@devui';
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
import { PescaService } from '../../../service/pesca.service';
import { format, parse } from 'date-fns';
import { NuevaDescargaComponent } from './nueva-descarga/nueva-descarga.component';


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

  formData = {};

  editForm: any = null;

  editRowIndex = -1;


  pager = {
    total: 0,
    pageIndex: 1,
    pageSize: 10,
  };

  busy: Subscription = new Subscription() ;

  nuevoDetalle: boolean = false;

  constructor(private dialogService: DialogService, private pescaService: PescaService, private toastService: ToastService,
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
    return this.busy = this.pescaService.obtenerPesca().
    pipe().subscribe((elemento) => {
      elemento.reverse();
      this.basicDataSource = elemento;
      this.basicDataSourceBkp = elemento;
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
      this.nuevoDetalle = !this.nuevoDetalle;
      this.formData = row
      console.log(this.formData)
  }

  refresh():void{
    this.getList();
  }
  newRow():void {
    this.nuevoDetalle = !this.nuevoDetalle
  }


  deleteRow(e: Trabajador, index: number) {
    e.estadoReg = false;
    Swal.fire({
      title: '¿Seguro de eliminar la Descarga de Pesca?',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.trabajadorService.guardarTrabajador(e).forEach(() => {
          //e.plantaDto.idPlanta = value;
        }).then(() => {
          this.basicDataSource.splice(index, 1);
          Swal.fire('Exito', 'Descarga de Pesca Eliminado!', 'success').then(()=>{});
        }).catch( error =>{
          console.error(error);
          Swal.fire('Error', "Hubo Problemas al Eliminar la Descarga de Pesca, intentelo más tarde", 'error').then(()=>{});
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


  getFecha(idDia: number):string {
    const fechaString: string = idDia.toString();
    const fechaObjeto = parse(fechaString, 'yyyyMMdd', new Date());

    // Formatea la fecha como un string con el formato deseado
    const fechaFormateada: string = format(fechaObjeto, 'dd/MM/yyyy');
    return fechaFormateada;
  }

  onCanceled():void {
    this.nuevoDetalle = !this.nuevoDetalle;
  }

  onSubmit(resultado:string):void {
    Swal.fire(`TICKET ${resultado}`, "Se grabo correctamente la descarga de Pesca", "success");
    const results = this.toastService.open({
      value: [{ severity: 'success', summary: `TICKET: ${resultado}`, content: 'Se grabo correctamente' }],
    });
    this.refresh();
  }

  detalle(rowItem: any, rowIndex: any) {

  }
}

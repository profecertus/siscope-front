import { AfterViewInit, Component, TemplateRef, ViewChild } from '@angular/core';
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

export class DescargaComponent implements AfterViewInit{
  @ViewChild('nuevaDescargaComponent', {static:false}) nuevaDescarga: NuevaDescargaComponent | undefined;
  @ViewChild('EditorTemplate', { static: true }) EditorTemplate: TemplateRef<any> | undefined;
  basicDataSource: Trabajador[] = [];
  basicDataSourceBkp: Trabajador[] = [];
  tipoDocSource: TipoDocumento[] = [];
  bancoSource: Banco[] = [];
  monedaSource: Moneda[] = [];
  formaPagoSource: FormaPago[] = [];
  DatoABuscar: string = "";
  busy: Subscription = new Subscription() ;
  nuevoDetalle: boolean = false;
  formData = {};
  editForm: any = null;
  editRowIndex = -1;
  tipoAccion:string = '';

  pager = {
    total: 0,
    pageIndex: 1,
    pageSize: 10,
  };

  constructor(private dialogService: DialogService, private pescaService: PescaService, private toastService: ToastService,
              private trabajadorService: TrabajadorService, private tipodocumentoService: TipodocumentoService,
              private monedaService: MonedaService, private bancoService: BancoService, private formaPagoService: FormaPagoService
  ) {}

  ngAfterViewInit(): void {
        if (this.nuevaDescarga){
          console.error("Existe Nueva Descarga")
        }
  }

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
    this.formData = row;
    this.tipoAccion = 'M';
  }

  refresh():void{
    this.getList();
  }
  newRow():void {
    this.editForm = this.dialogService.open({
      id: 'edit-dialog',
      width: '380px',
      maxHeight: '380px',
      title: 'Descarga',
      showAnimate: false,
      contentTemplate: this.EditorTemplate,
      backdropCloseable: true,
      onClose: () => {},
      buttons: [],
    });
  }


  deleteRow(row: any, index: number) {
    this.tipoAccion = 'E';
    this.nuevoDetalle = !this.nuevoDetalle
    this.formData = row;
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
    this.editForm.modalInstance.hide();
  }

  volver():void{
    Swal.fire({
      title: '¿Seguro de volver sin grabar?',
      showCancelButton: true,
      confirmButtonText: 'Volver',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.nuevoDetalle = !this.nuevoDetalle
        this.formData = { };
        this.tipoAccion = '';
      }
    })
  }

  grabarNuevaDescarga(){
    this.nuevaDescarga?.grabar();
  }

  onSubmitted(event:any){
    this.nuevoDetalle = !this.nuevoDetalle
    this.formData = event;
    this.tipoAccion = 'N';
    if(event.existeArribo){
      //En este caso debo avisar que algunos datos son cargados.
    }
    this.editForm!.modalInstance.hide();
  }


  onSubmit(resultado:string):void {
    const results = this.toastService.open({
      value: [{ severity: 'success', summary: `TICKET: ${resultado}`, content: 'Se grabo correctamente' }],
    });
    this.onCanceled();
    this.refresh();
  }

  detalle(rowItem: any, rowIndex: any) {

  }
}

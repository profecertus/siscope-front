import { ChangeDetectorRef, Component, TemplateRef, ViewChild } from '@angular/core';
import { DialogService, FormLayout } from '@devui';
import { FormConfig } from '../../../@shared/components/admin-form';
import { Subscription } from 'rxjs';
import { ProveedorModel, RespuestaProveedor } from '../../../model/proveedor.model';
import Swal from 'sweetalert2';
import { PlantaService } from '../../../service/planta.service';
import { RespuestaPlanta } from '../../../model/planta.modelo';
import { Destino } from '../../../model/destino.model';
import { Cliente } from '../../../model/cliente.model';
import { ProveedorService } from '../../../service/proveedor.service';
import { TipoServicio } from '../../../model/tipoServicio.model';
import { RelplantaproveedorService } from '../../../service/relplantaproveedor.service';

@Component({
  selector: 'app-planta',
  templateUrl: './planta.component.html',
  styleUrls: ['./planta.component.scss']
})

export class PlantaComponent {
  basicDataSource: RespuestaPlanta[] = [];
  basicDataSourceBkp: RespuestaPlanta[] = [];
  descargaPlanta:ProveedorModel[] = [];
  comisionPlanta:ProveedorModel[] = [];
  destinos: Destino[] =[];
  clientes: Cliente[] = [];
  DatoABuscar: string = "";
  idPlantaSel:number = 0;
  seleccionadoDescPlanta : any;
  seleccionadoComPlanta:any;



  formConfig: FormConfig = {
    layout: FormLayout.Horizontal,
    items: [
      {
        label: 'Nombre',
        prop: 'nombre',
        type: 'input',
        required: true,
        deep: 2,
        cabecera: 'plantaDto',
        tips: 'Nombre',
        placeholder: 'Nombre de la Planta',
        rule:{validators: [{ required: true }]},
      },
      {
        label: 'Dirección',
        prop: 'direccion',
        type: 'input',
        deep: 2,
        cabecera: 'plantaDto',
        placeholder: 'Dirección',
      },
      {
        label: 'Destino',
        prop: 'relPlantaDestinoDto',
        type: 'multiselect',
        deep: 1,
        options: [], //Se cargan luego
        placeholder: 'Tipo de Destino',
        filterKey: 'nombre',
        multipleselect: [],
        required: true,
        rule:{validators: [{ required: true }]},
      },
      {
        label: 'Cliente',
        cabecera: 'plantaDto',
        prop: 'ruc',
        type: 'selectButton',
        deep: 2,
        options: [], //Se cargan luego
        placeholder: 'Cliente',
        filterKey: 'cliente',
        multipleselect: [],
        required: true,
        rule:{validators: [{ required: true }]},
      },
    ],
    labelSize: '',
  };

  formData = {};
  eventoCliente:any;
  editForm: any = null;
  formAddClient: any = null;

  editRowIndex = -1;


  pager = {
    total: 0,
    pageIndex: 1,
    pageSize: 10,
  };

  busy: Subscription = new Subscription() ;

  @ViewChild('EditorTemplate', { static: true })
  EditorTemplate: TemplateRef<any> | undefined;

  @ViewChild('AgregarCliente', { static: true })
  AgregarClienteTemplate: TemplateRef<any> | undefined;

  @ViewChild('RelPlantaProveedor', { static: true })
  RelPlantaProveedor: TemplateRef<any> | undefined;


  layoutDirection: FormLayout = FormLayout.Horizontal;
  rucCliente: string = '';
  nombreCliente: string = '';

  constructor(private dialogService: DialogService, private cdr: ChangeDetectorRef,
              private plantaService: PlantaService, private proveedorService: ProveedorService,
              private relplantaproveedorService: RelplantaproveedorService
              ) {}

  ngOnInit() {
    this.getList();
    this.getListDestino();
    this.getListCliente();
    this.getListProveedorDescPlanta();
    this.getListProveedorComPlanta();
  }


  getList() {
    return this.busy = this.plantaService.obtenerPlantas((this.pager.pageIndex - 1), this.pager.pageSize).
    pipe().subscribe((elemento) => {
      let res : RespuestaPlanta[]  = elemento.content;
      this.basicDataSource = res;
      this.basicDataSourceBkp = res;
      this.pager.total = elemento.totalElements;
    });
  }

  getListProveedorDescPlanta(){
      //Obtengo los proveedores y filtro por FLETE (06)
      return this.busy = this.proveedorService.obtenerProveedoresCamara().
      pipe().subscribe((elemento : ProveedorModel[]) => {
        let respuesta = elemento.filter(item =>
          item.relProvTiposervDto.filter((valor:TipoServicio) => valor.idTipoServicio.id == 8).length > 0
        );
        this.descargaPlanta = respuesta;
      });
    }

  getListProveedorComPlanta(){
    //Obtengo los proveedores y filtro por FLETE (06)
    return this.busy = this.proveedorService.obtenerProveedoresCamara().
    pipe().subscribe((elemento) => {
      let respuesta = elemento.filter(item =>
        item.relProvTiposervDto.filter((valor:TipoServicio) => valor.idTipoServicio.id == 12).length > 0
      );
      this.comisionPlanta = respuesta;
    });
  }

  getListDestino(){
    return this.busy = this.plantaService.obtenerDestinos().pipe().subscribe((elemento)=>{
      this.destinos = elemento;
    });
  }

  getListCliente(){
    return this.busy = this.plantaService.obtenerClientes().pipe().subscribe((elemento) =>{
      this.clientes = elemento;
    })
  }

  getDestino(elem:any[]):string{
    let respuesta = "";
    let dato:any;
    for(dato in elem){
      respuesta = `${respuesta + elem[dato].nombre} / `;
    }
    return respuesta.slice(0,-3);
  }

  editRow(row: any, index: number) {
    this.editRowIndex = index;
    this.formData = row;
    this.formConfig.items[2].options = this.destinos;
    this.formConfig.items[3].options = this.clientes;
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
    let row = new RespuestaPlanta();
    this.editRowIndex = -1;
    this.formData = row;
    this.formConfig.items[2].options = this.destinos;
    this.formConfig.items[3].options = this.clientes;
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
    e.plantaDto.estadoReg = false;
    Swal.fire({
      title: '¿Seguro de eliminar la Planta?',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.plantaService.guardarPlanta(e).forEach(value => {
          e.plantaDto.idPlanta = value.valorDevuelto;
        }).then(value => {
          this.basicDataSource.splice(index, 1);
          Swal.fire('Exito','Planta Eliminada!','success');
        }).catch( error =>{
          Swal.fire('Error',"Hubo Problemas al Eliminar la planta, intentelo más tarde",'error');
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
    let mensaje:string="Se actualizo correctamente la Planta";
    Swal.showLoading( );
    //En caso sea modificación.
    if (!(e.plantaDto.idPlanta > 0)){
      e.plantaDto.idPlanta = null;
      mensaje = "Se grabo correctamente la Planta";
    }
    this.plantaService.guardarPlanta(e).forEach(value => {
      e.plantaDto.idPlanta = value.valorDevuelto;
    }).then(value => {
      if(e.plantaDto.idPlanta>0)
        this.basicDataSource.splice(this.editRowIndex, 1, e);
      else
        this.basicDataSource.push(e);
      this.basicDataSourceBkp = this.basicDataSource;
      //Ahora debo de actualizar la relación proveedor con servicio.
      Swal.fire('Exito',mensaje,'success');
    }).catch( error =>{
      Swal.fire('Error',"Hubo Problemas al grabar la Planta.",'error');
    }).finally(()=>{
      this.editForm!.modalInstance.hide();
    });
  }

  onCanceled() {
    this.editForm!.modalInstance.hide();
    this.editRowIndex = -1;
  }

  onCancelado() {
    this.formAddClient!.modalInstance.hide();
    this.editRowIndex = -1;
  }


  onRelacional(e: RespuestaPlanta, index: number){
    this.editRowIndex = index;
    this.seleccionadoComPlanta=null;
    this.seleccionadoDescPlanta=null;
    // @ts-ignore
    this.idPlantaSel = e.plantaDto.idPlanta;
    for(let i = 0; i< e.relPlantaProveedorDtoList.length; i++ ){
      if(e.relPlantaProveedorDtoList[i].id.idTipoServicio == 8){
        this.seleccionadoDescPlanta =  e.relPlantaProveedorDtoList[i].relProvTiposerv.idProveedor;
      }
      if(e.relPlantaProveedorDtoList[i].id.idTipoServicio == 12){
        this.seleccionadoComPlanta =  e.relPlantaProveedorDtoList[i].relProvTiposerv.idProveedor;
      }
    }

    this.formAddClient = this.dialogService.open({
      id: 'edit-dialog',
      width: '600px',
      maxHeight: '600px',
      title: 'Proveedores en Planta',
      showAnimate: false,
      contentTemplate: this.RelPlantaProveedor,
      backdropCloseable: true,
      onClose: () => {},
      buttons: [],
    });
  }


  onAdicional(evento:any){
    this.eventoCliente = evento;
    this.formAddClient = this.dialogService.open({
      id: 'edit-dialog',
      width: '600px',
      maxHeight: '600px',
      title: 'Nuevo Cliente',
      showAnimate: false,
      contentTemplate: this.AgregarClienteTemplate,
      backdropCloseable: true,
      onClose: () => {},
      buttons: [],
    });
  }

  onCloseCliente(){
    this.formAddClient!.modalInstance.hide();
  }


  saveCliente() {
    let miCliente = new Cliente();
    miCliente.nombre = this.nombreCliente;
    miCliente.ruc = this.rucCliente;
    miCliente.cliente = this.nombreCliente + " - " + this.rucCliente;
    Swal.fire({
      title: '¿Seguro de grabar el Cliente?',
      showCancelButton: true,
      confirmButtonText: 'Grabar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      this.plantaService.guardarCliente(miCliente).forEach(valor => {
        this.clientes.push(valor);
        this.formConfig.items[3].options = this.clientes;
        this.eventoCliente.plantaDto.ruc = miCliente;
        this.nombreCliente = '';
        this.rucCliente = '';
        Swal.fire('Exito','Cliente grabado!','success');
      }).
      then(()=>{}).catch(error => {
        console.log(error);
        Swal.fire('Error','Sucedio un error al momento de grabar - Verifique que el cliente no exista o que el RUC no esta asignado','error');
      }).finally(()=>{this.onCloseCliente();});
    });
  }

  grabarRel() {
    Swal.fire({
      title: '¿Seguro de grabar los Proveedores?',
      showCancelButton: true,
      confirmButtonText: 'Grabar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
        if (result.isConfirmed) {
          this.relplantaproveedorService.
            actualizaRelPlantaProv(this.idPlantaSel.toString(), this.seleccionadoComPlanta.id.toString(), "12")
            .forEach(value => {
              this.relplantaproveedorService.
                actualizaRelPlantaProv(this.idPlantaSel.toString(), this.seleccionadoDescPlanta.id.toString(), "8")
                .forEach(value1 => {
                  this.plantaService.obtenerPlanta(this.idPlantaSel).forEach(valor=>{
                    this.basicDataSource.splice(this.editRowIndex, 1, valor);
                    this.onCancelado();
                  });

                });
            } );
          }
      }).
      then(()=>{}).catch(error => {
        console.log(error);
        Swal.fire('Error','Sucedio un error al momento de grabar.','error');
      this.onCancelado();
      });
  }

}


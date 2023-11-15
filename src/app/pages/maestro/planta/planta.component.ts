import { ChangeDetectorRef, Component, TemplateRef, ViewChild } from '@angular/core';
import { DialogService, FormLayout } from '@devui';
import { FormConfig } from '../../../@shared/components/admin-form';
import { Subscription } from 'rxjs';
import { ProveedorModel } from '../../../model/proveedor.model';
import Swal from 'sweetalert2';
import { PlantaService } from '../../../service/planta.service';
import { CodUbigeo, RespuestaPlanta } from '../../../model/planta.modelo';
import { Destino } from '../../../model/destino.model';
import { Cliente } from '../../../model/cliente.model';
import { ProveedorService } from '../../../service/proveedor.service';
import { TipoServicio } from '../../../model/tipoServicio.model';
import { RelplantaproveedorService } from '../../../service/relplantaproveedor.service';
import { map } from 'rxjs/operators';

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
  accion:number=0;


  formConfig: FormConfig = {
    layout: FormLayout.Horizontal,
    items: [
      {
        label: 'Nombre',
        prop: 'nombre',
        type: 'input',
        required: true,
        maxi: 80,
        deep: 2,
        cabecera: 'plantaDto',
        tips: 'Nombre',
        placeholder: 'Nombre de la Planta',
        rule:{validators: [{ required: true }]},
      },
      {
        label: 'Localización',
        cuerpo:'codUbigeo',
        cabecera: 'plantaDto',
        prop: 'nombreCompleto',
        type: 'select',
        deep: 3,
        options: [], //Se cargan luego
        placeholder: 'Ubigeo',
        filterKey: 'nombreCompleto',
        multipleselect: [],
        required: true,
        rule:{validators: [{ required: true }]},
      },
      {
        label: 'Dirección',
        prop: 'direccion',
        maxi: 100,
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
      {
        label: 'Estado',
        cabecera:'plantaDto',
        prop: 'estado',
        type: 'switch',
        deep: 2,
      },
    ],
    labelSize: '',
  };

  formData = {};
  eventoCliente:any;
  editForm: any = null;
  formAddClient: any = null;
  ubigeo:[] = [];

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
    this.getUbigeo();
  }


  getList() {
    return this.busy = this.plantaService.obtenerPlantas((this.pager.pageIndex - 1), this.pager.pageSize).
    pipe().subscribe((elemento) => {
      let res : RespuestaPlanta[]  = elemento.content;
      let r:any;
      for (r in res){
        // @ts-ignore
        res[r].plantaDto.codUbigeo.nombreCompleto = res[r].plantaDto.codUbigeo.departamento + " - " + res[r].plantaDto.codUbigeo.provincia + " - " + res[r].plantaDto.codUbigeo.distrito;
      }
      this.basicDataSource = res;
      this.basicDataSourceBkp = res;
      this.pager.total = elemento.totalElements;
    });
  }

  getUbigeo(){
      return this.busy = this.plantaService.obtenerUbigeo().
        pipe().subscribe((elemento) => {
          this.ubigeo = elemento;
          let dato:any;
          for(dato in this.ubigeo){
            // @ts-ignore
            this.ubigeo[dato].nombreCompleto =this.ubigeo[dato].departamento + " - " + this.ubigeo[dato].provincia + " - " + this.ubigeo[dato].distrito;
          }
      });
  }

  getListProveedorDescPlanta(){
      //Obtengo los proveedores y filtro por FLETE (06)
      return this.busy = this.proveedorService.obtenerProveedoresCamara().
      pipe().subscribe((elemento : ProveedorModel[]) => {
        this.descargaPlanta = elemento.filter(item =>
          item.relProvTiposervDto.filter((valor: TipoServicio) => valor.idTipoServicio.id == 8).length > 0
        );
      });
    }

  getListProveedorComPlanta(){
    //Obtengo los proveedores y filtro por FLETE (06)
    return this.busy = this.proveedorService.obtenerProveedoresCamara().
    pipe().subscribe((elemento) => {
      this.comisionPlanta = elemento.filter(item =>
        item.relProvTiposervDto.filter((valor: TipoServicio) => valor.idTipoServicio.id == 12).length > 0
      );
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
    this.accion = 0;
    this.editRowIndex = index;
    this.formData = row;
    this.formConfig.items[1].options = this.ubigeo;
    this.formConfig.items[3].options = this.destinos;
    this.formConfig.items[4].options = this.clientes;
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
    this.accion = 1;
    this.editRowIndex = -1;
    this.formData = row;
    this.formConfig.items[1].options = this.ubigeo;
    this.formConfig.items[3].options = this.destinos;
    this.formConfig.items[4].options = this.clientes;
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
        }).then(() => {
          this.basicDataSource.splice(index, 1);
          Swal.fire('Exito','Planta Eliminada!','success');
        }).catch( error =>{
          console.log(error);
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
    e.plantaDto.codUbigeo = e.plantaDto.codUbigeo.nombreCompleto;
    console.log(e);
    let mensaje:string="Se actualizo correctamente la Planta";
    Swal.showLoading( );
    //En caso sea modificación.
    if (this.accion == 1){
      e.plantaDto.idPlanta = null;
      mensaje = "Se grabó correctamente la Planta";
    }
    this.plantaService.guardarPlanta(e).forEach(value => {
      e.plantaDto.idPlanta = value.valorDevuelto;
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
      Swal.fire('Error',"Hubo Problemas al grabar la Planta.",'error');
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

    if(e.relPlantaProveedorDtoList != null)
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
    let ruc : number = parseInt( this.rucCliente );

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
      if (result.isConfirmed){
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
      }
    });
  }

  grabarRel() {
    if (this.seleccionadoComPlanta == null && this.seleccionadoDescPlanta == null){
      Swal.fire("Error", "Debe seleccionar al menos un proveedor", "error");
      return;
    }

    Swal.fire({
      title: '¿Seguro de grabar los Proveedores?',
      showCancelButton: true,
      confirmButtonText: 'Grabar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
        if (result.isConfirmed) {
          if (this.seleccionadoComPlanta == null && this.seleccionadoDescPlanta != null){
            this.relplantaproveedorService.
            actualizaRelPlantaProv(this.idPlantaSel.toString(), this.seleccionadoDescPlanta.id.toString(), "8").forEach(
              () => {
                this.plantaService.obtenerPlanta(this.idPlantaSel).forEach(valor=>{
                  this.basicDataSource.splice(this.editRowIndex, 1, valor);
                });
              }
            ).then(()=>{
              Swal.fire('Exito','Se grabo correctamente el proveedor de Descarga.','success');
              this.onCancelado();
            });

          }

          if (this.seleccionadoComPlanta != null && this.seleccionadoDescPlanta == null){
            this.relplantaproveedorService.
            actualizaRelPlantaProv(this.idPlantaSel.toString(), this.seleccionadoComPlanta.id.toString(), "12").forEach(
              () => {
                this.plantaService.obtenerPlanta(this.idPlantaSel).forEach(valor=>{
                  this.basicDataSource.splice(this.editRowIndex, 1, valor);
                });
              }
            ).then(()=>{
              Swal.fire('Exito','Se grabo correctamente el proveedor de Comisión.','success');
              this.onCancelado();
            });
          }

          if (this.seleccionadoComPlanta != null && this.seleccionadoDescPlanta != null){
            this.relplantaproveedorService.
            actualizaRelPlantaProv(this.idPlantaSel.toString(), this.seleccionadoComPlanta.id.toString(), "12")
            .forEach(() => {
              this.relplantaproveedorService.
              actualizaRelPlantaProv(this.idPlantaSel.toString(), this.seleccionadoDescPlanta.id.toString(), "8")
              .forEach(() => {
                this.plantaService.obtenerPlanta(this.idPlantaSel).forEach(valor=>{
                this.basicDataSource.splice(this.editRowIndex, 1, valor);
                this.onCancelado();
                });
              });
            });
          }
        }
      }).
      then(()=>{
        Swal.fire('Exito','Se grabo correctamente los Proveedores.','success');
      }).catch(error => {
        console.log(error);
        Swal.fire('Error','Sucedio un error al momento de grabar.','error');
        return;
      });
  }

}


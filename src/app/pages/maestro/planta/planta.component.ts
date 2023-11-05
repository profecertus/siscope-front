import { ChangeDetectorRef, Component, TemplateRef, ViewChild } from '@angular/core';
import { DialogService, FormLayout } from '@devui';
import { FormConfig } from '../../../@shared/components/admin-form';
import { Subscription } from 'rxjs';
import { RespuestaProveedor, TipoDocumento } from '../../../model/proveedor.model';
import Swal from 'sweetalert2';
import { PlantaService } from '../../../service/planta.service';
import { RespuestaPlanta } from '../../../model/planta.modelo';
import { Destino } from '../../../model/destino.model';
import { Cliente } from '../../../model/cliente.model';

@Component({
  selector: 'app-planta',
  templateUrl: './planta.component.html',
  styleUrls: ['./planta.component.scss']
})

export class PlantaComponent {
  basicDataSource: RespuestaProveedor[] = [];
  basicDataSourceBkp: RespuestaProveedor[] = [];
  destinos: Destino[] =[];
  clientes: Cliente[] = [];
  DatoABuscar: string = "";


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
        type: 'select',
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
              private plantaService: PlantaService
              ) {}

  ngOnInit() {
    this.getList();
    this.getListDestino();
    this.getListCliente();
  }


  getList() {
    return this.busy = this.plantaService.obtenerPlantas((this.pager.pageIndex - 1), this.pager.pageSize).
    pipe().subscribe((elemento) => {
      let res : RespuestaPlanta[]  = elemento.content;
      //console.log(res);
      this.basicDataSource = res;
      this.basicDataSourceBkp = res;
      this.pager.total = elemento.totalElements;
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
          //console.log(e.plantaDto)
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
}


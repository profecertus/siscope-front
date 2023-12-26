import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { TipoCambioService } from '../../../service/tipoCambio.service';
import { Subscription } from 'rxjs';
import { TipoCambioModel } from '../../../model/tipoCambio.model';
import { format, parse } from 'date-fns';
import { FormConfig } from '../../../@shared/components/admin-form';
import { DialogService, FormLayout } from '@devui';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tipo-cambio',
  templateUrl: './tipo-cambio.component.html',
  styleUrls: ['./tipo-cambio.component.scss']
})
export class TipoCambioComponent implements OnInit{
  @ViewChild('EditorTemplate', { static: true })
  EditorTemplate: TemplateRef<any> | undefined;

  @ViewChild('ModifyTemplate', { static: true })
  ModifyTemplate: TemplateRef<any> | undefined;

  busy: Subscription = new Subscription() ;
  fechaInicio = new Date();
  fechaFin = new Date();
  max = new Date();
  layoutDirection: FormLayout = FormLayout.Columns;
  basicDataSource:TipoCambioModel[] = [];
  basicDataSourceBkp:TipoCambioModel[] = [];
  DatoABuscar: string = "";
  formConfig: FormConfig = {
    layout: FormLayout.Horizontal,
    items: [
      {
        label: 'Dia',
        prop: 'nombreDia',
        type: 'input',
        deep: 1,
        cabecera: 'Dia',
        soloLectura:true,
      },
      {
        label: 'Fecha',
        prop: 'fechaFormateada',
        type: 'input',
        deep: 1,
        soloLectura: true,
      },
      {
        label: 'Valor Cambio',
        prop: 'valorCambio',
        deep: 1,
        type: 'number',
        tips: 'Ingrese el valor del Cambio',
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
  valorTC: number = 0;
  constructor(private tipoCambioService:TipoCambioService,private dialogService: DialogService,) {
  }
  ngOnInit(): void {
    this.getAllCambios();
  }

  getFecha(idDia: number):string {
    const fechaString: string = idDia.toString();
    const fechaObjeto = parse(fechaString, 'yyyyMMdd', new Date());

    // Formatea la fecha como un string con el formato deseado
    const fechaFormateada: string = format(fechaObjeto, 'dd/MM/yyyy');

    return fechaFormateada;
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
  getAllCambios(){
    this.busy = this.tipoCambioService.getAllTipoCambio().subscribe(value => {
      for(let valor of value){
        valor.fechaFormateada = this.getFecha(valor.id.idDia);
      }
      this.basicDataSource = value;
      this.basicDataSourceBkp = this.basicDataSource.sort((a,b)=>{
        return (b.id.idDia - a.id.idDia);
      });
      this.basicDataSource = this.basicDataSourceBkp;
    });
  }

  cancelar(){
    this.editForm!.modalInstance.hide();
  }

  grabar(){
    if(this.fechaInicio > this.fechaFin){
      Swal.fire("Verificar fechas","La fecha Inicio debe ser menor o igual a la Fecha fin","warning");
      return;
    }

    if(this.valorTC <= 0){
      Swal.fire("Valor de Cambio Erroneo", "Debe de ingresar un valor de cambio mayor o igual a cero", "warning");
      return;
    }

    let fechaInic = this.fechaInicio.getFullYear() * 10000 + (this.fechaInicio.getMonth() + 1) * 100 + this.fechaInicio.getDate();
    let fechaFin = this.fechaFin.getFullYear() * 10000 + (this.fechaFin.getMonth() + 1) * 100 + this.fechaFin.getDate();
    this.tipoCambioService.postActualizaTipoCambio(fechaInic, fechaFin, this.valorTC).subscribe(valor =>{
      Swal.fire("Exito", `Se actualizaron ${valor} registros.`, "success");
      this.refresh();
      this.cancelar();
    });
  }

  modify(){
    this.editForm = this.dialogService.open({
      id: 'edit-dialog',
      width: '600px',
      maxHeight: '600px',
      title: 'Tipo Cambio - Modificar',
      showAnimate: false,
      contentTemplate: this.ModifyTemplate,
      backdropCloseable: true,
      onClose: () => {},
      buttons: [],
    });
  }
  reset() {
    this.pager.pageIndex = 1;
    this.DatoABuscar = "";
    this.getAllCambios();
  }

  refresh():void{
    this.getAllCambios();
  }

  onPageChange(e: number) {
    this.pager.pageIndex = e;
    this.getAllCambios();
  }

  onSizeChange(e: number) {
    this.pager.pageSize = e;
    this.getAllCambios();
  }

  editRow(row: any, index: number) {
    this.editRowIndex = index;
    this.formData = row;
    this.editForm = this.dialogService.open({
      id: 'edit-dialog',
      width: '400px',
      maxHeight: '600px',
      title: 'Tipo Cambio - Edición',
      showAnimate: false,
      contentTemplate: this.EditorTemplate,
      backdropCloseable: true,
      onClose: () => {},
      buttons: [],
    });
  }
  onCanceled() {
    this.editForm!.modalInstance.hide();
    this.editRowIndex = -1;
  }

  getValue(value: any):void {

    if(value.selectedDate == null) return;
    let fecha:Date = new Date(value.selectedDate);
  }

  onSubmitted(event: any) {
    this.tipoCambioService.postGrabaTipoCambio(event).subscribe(value => {
      if(value == 1){
        Swal.fire('Exito', "Se cambio el valor de cambio para la fecha seleccionada", 'success');
        this.editForm!.modalInstance.hide();
      }else{
        Swal.fire("Error", "Lo sentimos hubo un error al momento de actualizar el tipo de cambio", 'error');
      }
      this.basicDataSource[this.editRowIndex].valorCambio = event.valorCambio;
    });
  }


}

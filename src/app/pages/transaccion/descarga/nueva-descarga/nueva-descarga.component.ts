import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormLayout } from '@devui';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SemanaService } from '../../../../service/semana.service';
import { EmbarcacionService } from '../../../../service/embarcacion.service';
import { Embarcacion } from '../../../../model/embarcacion.model';
import { MonedaService } from '../../../../service/moneda.service';
import { Moneda } from '../../../../model/moneda.model';
import { PlantaService } from '../../../../service/planta.service';
import { CamaraService } from '../../../../service/camara.service';
import { RespuestaPlanta } from '../../../../model/planta.modelo';
import { Camara } from '../../../../model/camara.model';
import { PescaService } from '../../../../service/pesca.service';
import { TarifarioService } from '../../../../service/tarifario.service';
import { ProveedorService } from '../../../../service/proveedor.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'da-nueva-descarga',
  templateUrl: './nueva-descarga.component.html',
  styleUrls: ['./nueva-descarga.component.scss']
})

export class NuevaDescargaComponent  implements OnInit {
  layoutDirection: FormLayout = FormLayout.Columns;
  max = new Date();
  fechaNumber = 0;
  embarcaciones:Embarcacion[] = [];
  monedas:Moneda[]=[];
  plantas:RespuestaPlanta[]=[];
  camaras:Camara[]=[];
  tipoAccion:string='';

  @Input() set tipo(val: string) {
    this.tipoAccion = val;
  }

  @Input() set formData(val: any) {
    if( Object.keys( this.fb.group(val).value).length > 0){
      this.formDescarga = this.fb.group(val);
      this.formDescarga.get('semana')?.disable();
      this.formDescarga.get('toneladasCompra')?.disable();
      this.formDescarga.get('toneladasVenta')?.disable();
      this.formDescarga.get('totalFlete')?.disable();
      this.formDescarga.get('proveedorFlete')?.disable();
      this.formDescarga.get('proveedorDescargaPlanta')?.disable();
      this.formDescarga.get('proveedorDescargaMuelle')?.disable();
      this.formDescarga.get('proveedorComisionEmbarcacion')?.disable();
      this.formDescarga.get('proveedorComisionPlanta')?.disable();
    }else{
     this.formDescarga = this.fb.group({
        semana: new FormControl({ value: 0, disabled: true }),
        fecha:new Date(),
        fechaObj:{},
        embarcacion:{},
        cajaReal:[0, [Validators.pattern('[0-9]*')]],
        cajaGuia:0,
        numTicket:'',
        fechaNumero:0,
        kgCajaCompra:0,
        precioCompra:0,
        monedaCompra: { },
        kgCajaVenta:0,
        precioVenta:0,
        destino:{},
        muelle:{},
        precioMuelle:0,
        monedaMuelle:{},
        precioHabilitacion:0,
        monedaHabilitacion:{},
        precioAtraque:0,
        monedaAtraque:{},
        precioHielo:0,
        monedaHielo:{},
        precioCertificado:0,
        monedaCertificado:{},
        monedaVenta: {  },
        precioRenta:0,
        planta:{},
        camara:{},
        tarifaFlete: new FormControl({ value: 0, disabled: false }),
        monedaFlete:{},
        toneladasCompra: new FormControl({ value: 0, disabled: true }),
        toneladasVenta: new FormControl({ value: 0, disabled: true }),
        totalFlete: new FormControl({ value: 0, disabled: true }),
        proveedorFlete: new FormControl({ value: '', disabled: true }),

        precioDescargaMuelle:0,
        monedaDescargaMuelle:{},
        proveedorDescargaMuelle: new FormControl({ value: '', disabled: true }),
        precioDescargaPlanta:0,
        monedaDescargaPlanta:{},
        proveedorDescargaPlanta: new FormControl({ value: '', disabled: true }),

       precioComisionEmbarcacion:0,
       monedaComisionEmbarcacion:{},
       proveedorComisionEmbarcacion: new FormControl({ value: '', disabled: true }),
       precioComisionPlanta:0,
       monedaComisionPlanta:{},
       proveedorComisionPlanta: new FormControl({ value: '', disabled: true }),

       precioLavadoCubeta:0,
       monedaLavadoCubeta:{},
       proveedorLavadoCubeta: {  },
       precioAdministracion:0,
       monedaAdministracion:{},
       proveedorAdministracion: {  },
      });
    }
  }

  @Output() canceled = new EventEmitter();

  @Output() submit = new EventEmitter();

  formDescarga: FormGroup = this.fb.group({
    semana: new FormControl({ value: 0, disabled: true }),
    fecha:new Date(),
    fechaObj:{},
    embarcacion:{},
    cajaReal:[0, [Validators.pattern('[0-9]*')]],
    cajaGuia:0,
    numTicket:'',
    fechaNumero:0,
    kgCajaCompra:0,
    precioCompra:0,
    monedaCompra: { },
    kgCajaVenta:0,
    precioVenta:0,
    destino:{},
    muelle:{},
    precioMuelle:0,
    monedaMuelle:{},
    precioHabilitacion:0,
    monedaHabilitacion:{},
    precioAtraque:0,
    monedaAtraque:{},
    precioHielo:0,
    monedaHielo:{},
    precioCertificado:0,
    monedaCertificado:{},
    monedaVenta: {  },
    precioRenta:0,
    planta:{},
    camara:{},
    tarifaFlete: new FormControl({ value: 0, disabled: false }),
    monedaFlete:{},
    toneladasCompra: new FormControl({ value: 0, disabled: true }),
    toneladasVenta: new FormControl({ value: 0, disabled: true }),
    totalFlete: new FormControl({ value: 0, disabled: true }),
    proveedorFlete: new FormControl({ value: '', disabled: true }),

    precioDescargaMuelle:0,
    monedaDescargaMuelle:{},
    proveedorDescargaMuelle: new FormControl({ value: '', disabled: true }),
    precioDescargaPlanta:0,
    monedaDescargaPlanta:{},
    proveedorDescargaPlanta: new FormControl({ value: '', disabled: true }),

    precioComisionEmbarcacion:0,
    monedaComisionEmbarcacion:{},
    proveedorComisionEmbarcacion: new FormControl({ value: '', disabled: true }),
    precioComisionPlanta:0,
    monedaComisionPlanta:{},
    proveedorComisionPlanta: new FormControl({ value: '', disabled: true }),

    precioLavadoCubeta:0,
    monedaLavadoCubeta:{},
    proveedorLavadoCubeta: { },
    precioAdministracion:0,
    monedaAdministracion:{},
    proveedorAdministracion: { },
  });

  destinos: any[] = [];
  muelles:any[]=[];
  lavadoCubetas:any[]=[];
  administraciones:any[]=[];

  l_flete:string = 'Total Flete';
  l_habilitacion:string = 'Habilitación';
  l_atraque:string = 'Atraque';
  l_certificado:string = 'Certificado';
  l_hielo:string = 'Hielo';
  l_renta:string = 'Renta (S/)';

  constructor(private fb: FormBuilder, private semanaService:SemanaService, private pescaService:PescaService,
              private proveedorService:ProveedorService,
              private embarcacionService:EmbarcacionService, private monedaService:MonedaService, private tarifarioService: TarifarioService,
              private plantaService:PlantaService, private camaraService:CamaraService) {
  }

  ngOnInit() {
    this.getValue({ selectedDate: new Date() });
    this.getEmbarcaciones();
    this.getMonedas();
    this.getPlantas();
    this.getCamaras();
    this.getMuelles();
    this.getLavadoCubetas();
    this.getAdministraciones();

    this.formDescarga.get("planta")?.valueChanges.subscribe((nuevoValor) =>{
      this.selectPlanta(nuevoValor)
    });

    this.formDescarga.get("monedaFlete")?.valueChanges.subscribe((nuevoValor) =>{
      this.selectMoneda(nuevoValor)
    });

    this.formDescarga.get("cajaReal")?.valueChanges.subscribe((nuevoValor:number) =>{
      this.modifiedCajaReal(nuevoValor);
    });

    this.formDescarga.get("kgCajaCompra")?.valueChanges.subscribe((nuevoValor:number):void =>{
      this.modifiedkgCompra(nuevoValor);
    });

    this.formDescarga.get("monedaVenta")?.valueChanges.subscribe((moneda:any):void =>{
      this.modifiedMonedaVenta(moneda);
    });

    this.formDescarga.get("kgCajaVenta")?.valueChanges.subscribe((nuevoValor:number):void =>{
      this.modifiedkgVenta(nuevoValor);
    });

    this.formDescarga.get("embarcacion")?.valueChanges.subscribe((embarcacion:any):void =>{
      this.modifiedEmbarcacion(embarcacion);
    });

    this.formDescarga.get("precioVenta")?.valueChanges.subscribe((nuevoValor:number):void =>{
      this.modifiedPrecioVenta(nuevoValor);
    });

    this.formDescarga.get("camara")?.valueChanges.subscribe((nuevoValor:number):void =>{
      this.selectCamara(nuevoValor);
    });

    this.formDescarga.get("muelle")?.valueChanges.subscribe((nuevoValor:number):void =>{
      this.selectMuelle(nuevoValor);
    });
  }

  getMuelles():void{
    this.proveedorService.obtenerProveedorxTipo(13).subscribe(value => {
      this.muelles = value;
    });
  }

  getLavadoCubetas():void{
    this.proveedorService.obtenerProveedorxTipo(9).subscribe(value => {
      console.log(value);
      this.lavadoCubetas = value;
    });
  }

  getAdministraciones():void{
    this.proveedorService.obtenerProveedorxTipo(10).subscribe(value => {
      this.administraciones = value;
    });
  }

  getSemana(){
    this.semanaService.semanaxFecha(this.fechaNumber).subscribe(value => {
      this.formDescarga.patchValue({
        semana: value.idSemana,
        fechaNumero: this.fechaNumber,
      });
    });
  }

  getDiaSemana():void{
    this.semanaService.getDiaSemana(this.fechaNumber).subscribe(value => {
      this.formDescarga.patchValue({
        fechaObj:value
      })
    });
  }

  getMonedas(){
    this.monedaService.obtenerMonedas().subscribe(value => {
      this.monedas = value;
    })
  }

  getPlantas(){
    this.plantaService.obtenerPlantas(0,100).subscribe(value => {
      this.plantas = value.content;
      this.plantas.forEach(valor => {
        valor.nombrePlanta = valor.plantaDto?.nombrePlanta + ' (' + valor.plantaDto?.codUbigeo.distrito + ')';
      });
    })
  }

  getEmbarcaciones(){
    this.embarcacionService.obtenerEmbarcaciones(0,100).subscribe(value => {
      this.embarcaciones = value.content;
    });
  }

  selectMoneda(moneda:any):void{
    this.l_flete = 'Total Flete (' + moneda.abreviatura.trim() + ')';
  }

  selectPlanta(planta:any):void{
    this.destinos = planta.relPlantaDestinoDto;
    this.tarifarioService.obtenerTarifarioFletexDestino(planta.plantaDto.codUbigeo.codUbigeo,
      this.formDescarga.value.fechaNumero).subscribe(value => {
        this.l_flete = 'Total Flete (' + value.idMoneda.abreviatura + ')';
        this.formDescarga.patchValue({
          tarifaFlete: value.monto,
          totalFlete: (value.monto * this.formDescarga.value.cajaReal),
          monedaFlete:value.idMoneda,
        });
    });
  }

  getCamaras(){
    this.camaraService.getAllCamara().subscribe(value => {
      this.camaras = value;
    });
  }

  getValue(value: any):void {
    if(value.selectedDate == null) return;
    let fecha:Date = new Date(value.selectedDate);
    this.fechaNumber = fecha.getFullYear() * 10000 + (fecha.getMonth() + 1) * 100 + fecha.getDate();
    this.getSemana();
    this.getDiaSemana();
  }

  selectCamara(camara:any):void{
    this.formDescarga.patchValue({
      proveedorFlete:camara.idProveedor.nombreComercial,
    });

  }

  selectMuelle(muelle:any):void{
    this.proveedorService.obtenerPrecioxDia(muelle.idProveedor, muelle.idTipoServicio, this.fechaNumber).subscribe(value => {
      const monedaEncontrada = this.monedas.find((moneda) => moneda.idMoneda === value.idMoneda);
      this.formDescarga.patchValue({
        precioMuelle:value.precio,
        monedaMuelle:monedaEncontrada,
      });
    });

    this.proveedorService.obtenerPrecioxDia(muelle.idProveedor, 14, this.fechaNumber).subscribe(value => {
      const monedaEncontrada = this.monedas.find((moneda) => moneda.idMoneda === value.idMoneda);
      this.formDescarga.patchValue({
        monedaHabilitacion:monedaEncontrada,
        precioHabilitacion:value.precio,
      });
    });

    this.proveedorService.obtenerPrecioxDia(muelle.idProveedor, 15, this.fechaNumber).subscribe(value => {
      const monedaEncontrada = this.monedas.find((moneda) => moneda.idMoneda === value.idMoneda);
      this.formDescarga.patchValue({
        precioAtraque:value.precio,
        monedaAtraque:monedaEncontrada,
      });
    });

    this.proveedorService.obtenerPrecioxDia(muelle.idProveedor, 16, this.fechaNumber).subscribe(value => {
      const monedaEncontrada = this.monedas.find((moneda) => moneda.idMoneda === value.idMoneda);
      this.formDescarga.patchValue({
        precioCertificado:value.precio,
        monedaCertificado:monedaEncontrada,
      });
    });

    this.formDescarga.patchValue({
      precioRenta:this.formDescarga.get("toneladasVenta")?.value * this.formDescarga.value.precioVenta * 0.015,
    });
  }


  modifiedCajaReal(valor:number):void{
    this.formDescarga.patchValue({
      totalFlete: this.formDescarga.get('tarifaFlete')?.value * valor,
      toneladasCompra: this.formDescarga.value.kgCajaCompra * valor / 1000,
      toneladasVenta: this.formDescarga.value.kgCajaVenta * valor / 1000,
    });
  }

  // @ts-ignore
  submitForm({ valid, directive }) {
    // do something for submitting
    //if (valid) {
    //  console.log(this.formDescarga);
    //}
  }
  grabar(){
    if (this.formDescarga.valid) {
      Swal.fire({
        title: '¿Seguro de grabar la Descarga de Pesca?',
        showCancelButton: true,
        confirmButtonText: 'Grabar',
        cancelButtonText: 'Cancelar',
      }).then((respuesta) => {
        if (respuesta.isConfirmed) {
          this.formDescarga.get('semana')?.enable();
          this.formDescarga.get('toneladasCompra')?.enable();
          this.formDescarga.get('toneladasVenta')?.enable();
          this.formDescarga.get('totalFlete')?.enable();
          this.formDescarga.get('proveedorFlete')?.enable();
          this.formDescarga.get('proveedorDescargaPlanta')?.enable();
          this.formDescarga.get('proveedorDescargaMuelle')?.enable();
          this.formDescarga.get('proveedorComisionEmbarcacion')?.enable();
          this.formDescarga.get('proveedorComisionPlanta')?.enable();

          const objetoSinId = { ...this.formDescarga.value };
          delete objetoSinId._id;

          let resultado:string = this.formDescarga.get('numTicket')?.value;
          if(this.tipoAccion == "N"){
            this.pescaService.getCorrelativo( Number.parseInt( this.fechaNumber.toString().substring(0,4)) ).
            subscribe(valor =>{
              resultado = `${valor.anio}-${valor.corre.toString().padStart(4, '0')}`;
              this.formDescarga.patchValue({
                numTicket:resultado,
              });
              this.pescaService.guardarPesca(this.formDescarga.value, this.tipoAccion).forEach(value => {
                this.submit.emit(resultado);
              }).catch((rason) =>{
                if(rason.status == 200 && rason.statusText == "OK"){
                  this.submit.emit(resultado);
                }else{
                  Swal.fire("Error", "Hubo un error al momento de grabar la descarga", 'error')
                }
              });
            });
          }else{
            this.pescaService.guardarPesca(objetoSinId, this.tipoAccion).forEach(value => {
              this.submit.emit(resultado);
            }).catch((rason) =>{
              if(rason.status == 200 && rason.statusText == "OK"){
                this.submit.emit(resultado);
              }else{
                Swal.fire("Error", "Hubo un error al momento de grabar la descarga", 'error')
              }
            });
          }
        }
      });


    } else {
      // El formulario no es válido, muestra un mensaje de error o realiza otra acción
      console.error('El formulario no es válido, verifica los campos requeridos.');
    }
  }

  salir():void{
    this.canceled.emit();
  }

  modifiedkgCompra(valor: number) {
    this.formDescarga.patchValue({
      toneladasCompra: this.formDescarga.value.cajaReal * valor / 1000,
    });
  }


  modifiedkgVenta(valor: number) {
    this.formDescarga.patchValue({
      toneladasVenta: this.formDescarga.value.cajaReal * valor / 1000,
      precioRenta:valor * this.formDescarga.value.precioVenta * 0.015,
    });
  }

  modifiedPrecioVenta(valor: number) {
    this.formDescarga.patchValue({
      precioRenta:valor * this.formDescarga.get("toneladasVenta")?.value * 0.015,
    });
  }

  modifiedMonedaVenta(moneda:any):void{
    this.l_renta = 'Precio (' + moneda.abreviatura.trim() + ')';
  }

  modifiedEmbarcacion(embarcacion:any):void{
    if (embarcacion.relEmbarcacionProveedorDto != undefined){
      this.proveedorService.obtenerPrecioxDia(embarcacion.relEmbarcacionProveedorDto[0].idProovedor.id,
        embarcacion.relEmbarcacionProveedorDto[0].idTipoServicio.id,
        this.fechaNumber).subscribe(value => {
        const monedaEncontrada = this.monedas.find((moneda) => moneda.idMoneda === value.idMoneda);
        this.formDescarga.patchValue({
          precioComisionEmbarcacion:value.precio,
          monedaComisionEmbarcacion:monedaEncontrada,
        });
      });

      this.formDescarga.patchValue({
        proveedorComisionEmbarcacion:embarcacion.relEmbarcacionProveedorDto[0].idProovedor.razonSocial,
      });
    }
  }

}

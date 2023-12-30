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
    }else{
     this.formDescarga = this.fb.group({
        semana: new FormControl({ value: 0, disabled: true }),
        fecha:new Date(),
        fechaObj:{},
        embarcacion:{},
        cajaReal:[0, [Validators.pattern('[0-9]*')]],
        cajaGuia:0,
        numTicket:'',
        monedaHielo:{},
        fechaNumero:0,
        kgCajaCompra:0,
        precioCompra:0,
        monedaCompra: { },
        kgCajaVenta:0,
        precioVenta:0,
        destino:{},
        muelle:{},
        precioMuelle:0,
        precioHabilitacion:0,
        precioAtraque:0,
        precioHielo:0,
        precioCertificado:0,
        monedaVenta: {  },
        precioRenta:0,
        planta:{},
        camara:{},
        tarifaFlete: new FormControl({ value: 0, disabled: false }),
        toneladasCompra: new FormControl({ value: 0, disabled: true }),
        toneladasVenta: new FormControl({ value: 0, disabled: true }),
        totalFlete: new FormControl({ value: 0, disabled: true }),
        proveedorFlete: new FormControl({ value: '', disabled: true }),
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
    monedaHielo:{},
    fechaNumero:0,
    kgCajaCompra:0,
    precioCompra:0,
    monedaCompra: { },
    kgCajaVenta:0,
    precioVenta:0,
    destino:{},
    muelle:{},
    precioMuelle:0,
    precioHabilitacion:0,
    precioAtraque:0,
    precioHielo:0,
    precioCertificado:0,
    monedaVenta: {  },
    precioRenta:0,
    planta:{},
    camara:{},
    tarifaFlete: new FormControl({ value: 0, disabled: false }),
    toneladasCompra: new FormControl({ value: 0, disabled: true }),
    toneladasVenta: new FormControl({ value: 0, disabled: true }),
    totalFlete: new FormControl({ value: 0, disabled: true }),
    proveedorFlete: new FormControl({ value: '', disabled: true }),
  });

  destinos: any[] = [];
  muelles:any[]=[];

  l_muelle:string = 'Precio';
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

    this.formDescarga.get("planta")?.valueChanges.subscribe((nuevoValor) =>{
      this.selectPlanta(nuevoValor)
    });

    this.formDescarga.get("cajaReal")?.valueChanges.subscribe((nuevoValor:number) =>{
      this.modifiedCajaReal(nuevoValor);
    });

    this.formDescarga.get("kgCajaCompra")?.valueChanges.subscribe((nuevoValor:number):void =>{
      this.modifiedkgCompra(nuevoValor);
    });

    this.formDescarga.get("kgCajaVenta")?.valueChanges.subscribe((nuevoValor:number):void =>{
      this.modifiedkgVenta(nuevoValor);
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

  selectPlanta(planta:any):void{
    this.destinos = planta.relPlantaDestinoDto;
    this.tarifarioService.obtenerTarifarioFletexDestino(planta.plantaDto.codUbigeo.codUbigeo,
      this.formDescarga.value.fechaNumero).subscribe(value => {
      this.formDescarga.patchValue({
        tarifaFlete: value.monto,
        totalFlete: (value.monto * this.formDescarga.value.cajaReal)
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
      this.l_muelle = 'Precio (' + value.abreviatura.trim() + ')';
      this.formDescarga.patchValue({
        precioMuelle:value.precio,
      });
    });

    this.proveedorService.obtenerPrecioxDia(muelle.idProveedor, 14, this.fechaNumber).subscribe(value => {
      this.l_habilitacion = 'Habilitación (' + value.abreviatura.trim() + ')';
      this.formDescarga.patchValue({
        precioHabilitacion:value.precio,
      });
    });

    this.proveedorService.obtenerPrecioxDia(muelle.idProveedor, 15, this.fechaNumber).subscribe(value => {
      this.l_atraque = 'Atraque (' + value.abreviatura.trim() + ')';
      this.formDescarga.patchValue({
        precioAtraque:value.precio,
      });
    });

    this.proveedorService.obtenerPrecioxDia(muelle.idProveedor, 16, this.fechaNumber).subscribe(value => {
      this.l_certificado = 'Certificado (' + value.abreviatura.trim() + ')';
      this.formDescarga.patchValue({
        precioCertificado:value.precio,
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
    if (valid) {
      console.log(this.formDescarga);
    }
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

          const objetoSinId = { ...this.formDescarga.value };
          delete objetoSinId._id;
          console.log(objetoSinId);
          console.log(this.formDescarga);

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
    });
  }

}

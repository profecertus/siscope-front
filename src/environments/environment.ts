// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  urlService: 'http://www.arquitecturabi.pe:8080',
  sufijoProveedor: '/proveedor/v1',
  sufijoTipoDocumento: '/documento/v1',
  sufijoTipoServicio: '/tipoServicio/v1',
  sufijoPlanta: '/planta/v1',
  sufijoDestino: '/destino/v1',
  sufijoCliente: '/cliente/v1',
  sufijoCamara: '/camara/v1',
  sufijoTrabajador: '/trabajador/v1',
  sufijoMoneda: '/moneda/v1',
  sufijoBanco: '/banco/v1',
  sufijoFormaPago: '/formaPago/v1',
  sufijoEmbarcacion: '/embarcacion/v1',
  sufijoRelPlantaProv: '/relplantaproveedor/v1',
  sufijoSemana: '/semana/v1',
  sufijoRelEmbProv: '/relembprov/v1',
  sufijoUbigeo: '/ubigeo/v1',

  urlServiceTarifario: 'http://www.arquitecturabi.pe:8081',
  sufijoTarifario: '/tarifario/v1',

};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.

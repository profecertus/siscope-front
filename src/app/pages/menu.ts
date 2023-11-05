export default function (values: any) {
  return [
    {
      title: values['dashboard']['title'],
      children: [
        {
          title: values['dashboard']['monitor'],
          link: '/pages/dashboard/monitor',
        },
      ],
      link: '/pages/dashboard',
      menuIcon: 'icon icon-console',
    },
    {
      title: values['maestro']['title'],
      children: [
        {
          title: values['maestro']['proveedor'],
          link: '/pages/maestro/proveedor',
        },
        {
          title: values['maestro']['embarcacion'],
          link: '/pages/maestro/embarcacion',
        },
        {
          title: values['maestro']['planta'],
          link: '/pages/maestro/planta',
        },
        {
          title: values['maestro']['camara'],
          link: '/pages/maestro/camara',
        },
        {
          title: values['maestro']['trabajador'],
          link: '/pages/maestro/trabajador',
        },
      ],
      link: '/pages/maestro',
      menuIcon: 'icon icon-modify',
    },
    {
      title: values['tarifa']['title'],
      children: [
        {
          title: values['tarifa']['petroleo'],
          link: '/pages/tarifa/petroleo',
        },
        {
          title: values['tarifa']['hielo'],
          link: '/pages/tarifa/hielo',
        },
        {
          title: values['tarifa']['administrativo'],
          link: '/pages/tarifa/administrativo',
        },
        {
          title: values['tarifa']['descarga-muelle'],
          link: '/pages/tarifa/descarga-muelle',
        },
        {
          title: values['tarifa']['descarga-planta'],
          link: '/pages/tarifa/descarga-planta',
        },
        {
          title: values['tarifa']['lavado-cubeta'],
          link: '/pages/tarifa/lavado-cubeta',
        },
        {
          title: values['tarifa']['flete'],
          link: '/pages/tarifa/flete',
        },
        {
          title: values['tarifa']['comision-planta'],
          link: '/pages/tarifa/comision-planta',
        },
        {
          title: values['tarifa']['comision-embarcacion'],
          link: '/pages/tarifa/comision-embarcacion',
        },
        {
          title: values['tarifa']['muelle'],
          link: '/pages/tarifa/muelle',
        },
        {
          title: values['tarifa']['habilitacion'],
          link: '/pages/tarifa/habilitacion',
        },
        {
          title: values['tarifa']['atraque'],
          link: '/pages/tarifa/atraque',
        },
      ],
      link: '/pages/tarifa',
      menuIcon: 'icon icon-buy',
    },
    {
      title: values['transaccion']['title'],
      children: [
        { title: values['transaccion']['descarga'], link: '/pages/transaccion/descarga' },
        { title: values['transaccion']['planilla'], link: '/pages/transaccion/planilla' },
        {
          title: values['transaccion']['gastosope'],
          link: '/pages/transaccion/operativo',
        },
        { title: values['transaccion']['gastosadm'], link: '/pages/transaccion/administrativo' },
        { title: values['transaccion']['ingresos'], link: '/pages/transaccion/ingreso' },
        { title: values['transaccion']['liquidacion'], link: '/pages/transaccion/liquidacion' },
      ],
      link: '/pages/list',
      menuIcon: 'icon icon-table',
    },
    {
      title: values['reporte']['title'],
      children: [
        { title: values['reporte']['xembarcacion'], link: '/pages/abnormal/abnormal403' },
      ],
      link: '/pages/abnormal',
      menuIcon: 'icon icon-unload',
    },
    {
      title: values['user']['title'],
      children: [
        { title: values['user']['center'], link: '/pages/user/center' },
        { title: values['user']['settings'], link: '/pages/user/settings' },
      ],
      link: '/pages/user',
      menuIcon: 'icon icon-mine',
    },
  ];
}

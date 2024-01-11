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
        {
          title: values['maestro']['semana'],
          link: '/pages/maestro/semana',
        },
        {
          title: values['maestro']['tipoCambio'],
          link: '/pages/maestro/tipoCambio',
        },
      ],
      link: '/pages/maestro',
      menuIcon: 'icon icon-modify',
    },
    {
      title: values['tarifario']['title'],
      children: [
        {
          title: values['tarifario']['general'],
          link: '/pages/tarifario/general',
        },
        {
          title: values['tarifario']['embarcacion'],
          link: '/pages/tarifario/embarcacion',
        },
        {
          title: values['tarifario']['planta'],
          link: '/pages/tarifario/planta',
        },
        {
          title: values['tarifario']['camara'],
          link: '/pages/tarifario/camara',
        },
      ],
      link: '/pages/tarifario',
      menuIcon: 'icon icon-buy',
    },
    {
      title: values['transaccion']['title'],
      children: [
        { title: values['transaccion']['gastosEmbarcacion'], link: '/pages/transaccion/gastosEmbarcacion' },
        { title: values['transaccion']['descarga'], link: '/pages/transaccion/descarga' },
        { title: values['transaccion']['ingresos'], link: '/pages/transaccion/pagos' },
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

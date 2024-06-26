/* ➡ Valores iniciales para los almuerzos fecha */
export const ALMUERZOS_FECHA_INITIAL_VALUES = {
  id_almuerzos_fecha: '',
  fecha: new Date(),
  createdAt: new Date(),
  updatedAt: new Date()
}

/* ➡ Valores iniciales para los almuerzos totales */
export const ALMUERZOS_TOTALES_INITIAL_VALUES = {
  id_almuerzo: '',
  fecha: new Date(),
  total_almuerzos: 0,
  createdAt: new Date(),
  updatedAt: new Date()
}

/* ➡ Valores iniciales para los almuerzos reservados */
export const ALMUERZOS_RESERVADOS_INITIAL_VALUES = {
  id_almuerzos_reservados: '',
  id_almuerzo: '',
  cantidad: 0,
  createdAt: new Date(),
  updatedAt: new Date()
}

/* ➡ Valores iniciales para los almuerzos entregados */
export const ALMUERZOS_ENTREGADOS_INITIAL_VALUES = {
  id_almuerzos_entregados: '',
  id_almuerzo: '',
  cantidad: 0,
  createdAt: new Date(),
  updatedAt: new Date()
}

/* ➡ Valores iniciales para las estadisticas de los almuerzos */
export const ALMUERZOS_ESTADISTICAS_INITIAL_VALUES = {
  totalAlmuerzosDefinidos: 0,
  dataTotalAlmuerzosDefinidos: [{ name: '', cantidad: 0 }],
  totalAlmuerzosReservados: 0,
  dataTotalAlmuerzosReservados: [{ name: '', cantidad: 0 }],
  totalAlmuerzosReservadosPresencial: 0,
  dataTotalAlmuerzosReservadosPresencial: [{ name: '', cantidad: 0 }],
  totalAlmuerzosReservadosVirtual: 0,
  dataTotalAlmuerzosReservadosVirtual: [{ name: '', cantidad: 0 }],
  totalAlmuerzosEntregados: 0,
  dataTotalAlmuerzosEntregados: [{ name: '', cantidad: 0 }],
  totalAlmuerzosSinEntregar: 0,
  dataTotalAlmuerzosSinEntregar: [{ name: '', cantidad: 0 }],
  totalRecargas: 0,
  dataTotalRecargas: [{ name: '', cantidad: 0 }],
  fechaInicio: '',
  fechaFin: ''
}

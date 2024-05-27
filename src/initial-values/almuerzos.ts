export const ALMUERZOS_TOTALES_INITIAL_VALUES = {
  id_almuerzo: '',
  fecha: new Date(),
  total_almuerzos: 0,
  createdAt: new Date(),
  updatedAt: new Date()
}

export const ALMUERZOS_RESERVADOS_INITIAL_VALUES = {
  id_almuerzos_reservados: '',
  id_almuerzo: '',
  cantidad: 0,
  createdAt: new Date(),
  updatedAt: new Date()
}

export const ALMUERZOS_ENTREGADOS_INITIAL_VALUES = {
  id_almuerzos_entregados: '',
  id_almuerzo: '',
  cantidad: 0,
  createdAt: new Date(),
  updatedAt: new Date()
}

export const ALMUERZOS_ESTADISTICAS_INITIAL_VALUES = {
  totalAlmuerzosDefinidos: 0,
  totalAlmuerzosReservados: 0,
  totalAlmuerzosReservadosPresencial: 0,
  totalAlmuerzosReservadosVirtual: 0,
  totalAlmuerzosEntregados: 0,
  totalAlmuerzosSinEntregar: 0,
  totalRecargas: 0,
  fechaInicio: '',
  fechaFin: ''
}

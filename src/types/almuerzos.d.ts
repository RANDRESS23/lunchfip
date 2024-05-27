export interface Almuerzos {
  id_almuerzo: string
  fecha: Date
  total_almuerzos: number
  createdAt: Date
  updatedAt: Date
}

export interface AlmuerzosReservados {
  id_almuerzos_reservados: string
  id_almuerzo: string
  cantidad: number
  createdAt: Date
  updatedAt: Date
}

export interface AlmuerzosEntregados {
  id_almuerzos_entregados: string
  id_almuerzo: string
  cantidad: number
  createdAt: Date
  updatedAt: Date
}

export interface AlmuerzosEstadisticas {
  totalAlmuerzosDefinidos: number
  totalAlmuerzosReservados: number
  totalAlmuerzosReservadosPresencial: number
  totalAlmuerzosReservadosVirtual: number
  totalAlmuerzosEntregados: number
  totalAlmuerzosSinEntregar: number
  totalRecargas: number
  fechaInicio: string
  fechaFin: string
}

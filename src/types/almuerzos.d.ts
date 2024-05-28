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
  dataTotalAlmuerzosDefinidos: Array<{ name: string, cantidad: number }>
  totalAlmuerzosReservados: number
  dataTotalAlmuerzosReservados: Array<{ name: string, cantidad: number }>
  totalAlmuerzosReservadosPresencial: number
  dataTotalAlmuerzosReservadosPresencial: Array<{ name: string, cantidad: number }>
  totalAlmuerzosReservadosVirtual: number
  dataTotalAlmuerzosReservadosVirtual: Array<{ name: string, cantidad: number }>
  totalAlmuerzosEntregados: number
  dataTotalAlmuerzosEntregados: Array<{ name: string, cantidad: number }>
  totalAlmuerzosSinEntregar: number
  dataTotalAlmuerzosSinEntregar: Array<{ name: string, cantidad: number }>
  totalRecargas: number
  dataTotalRecargas: Array<{ name: string, cantidad: number }>
  fechaInicio: string
  fechaFin: string
}

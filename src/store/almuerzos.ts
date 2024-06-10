import { ALMUERZOS_ENTREGADOS_INITIAL_VALUES, ALMUERZOS_ESTADISTICAS_INITIAL_VALUES, ALMUERZOS_FECHA_INITIAL_VALUES, ALMUERZOS_RESERVADOS_INITIAL_VALUES, ALMUERZOS_TOTALES_INITIAL_VALUES } from '@/initial-values/almuerzos'
import { type AlmuerzosEstadisticas, type Almuerzos, type AlmuerzosEntregados, type AlmuerzosReservados, type AlmuerzosFecha } from '@/types/almuerzos'
import { create } from 'zustand'

interface AlmuerzosStore {
  almuerzosFecha: AlmuerzosFecha
  almuerzosTotales: Almuerzos
  almuerzosReservados: AlmuerzosReservados
  almuerzosEntregados: AlmuerzosEntregados
  almuerzosEstadisticas: AlmuerzosEstadisticas
  setAlmuerzosFecha: (almuerzosFecha: AlmuerzosFecha) => void
  setAlmuerzosTotales: (almuerzosTotales: Almuerzos) => void
  setAlmuerzosReservados: (almuerzosReservados: AlmuerzosReservados) => void
  setAlmuerzosEntregados: (almuerzosEntregados: AlmuerzosEntregados) => void
  setAlmuerzosEstadisticas: (almuerzosEstadisticas: AlmuerzosEstadisticas) => void
}

export const useAlmuerzosStore = create<AlmuerzosStore>((set) => ({
  almuerzosFecha: ALMUERZOS_FECHA_INITIAL_VALUES,
  almuerzosTotales: ALMUERZOS_TOTALES_INITIAL_VALUES,
  almuerzosReservados: ALMUERZOS_RESERVADOS_INITIAL_VALUES,
  almuerzosEntregados: ALMUERZOS_ENTREGADOS_INITIAL_VALUES,
  almuerzosEstadisticas: ALMUERZOS_ESTADISTICAS_INITIAL_VALUES,
  setAlmuerzosFecha: (almuerzosFecha: AlmuerzosFecha) => { set({ almuerzosFecha }) },
  setAlmuerzosTotales: (almuerzosTotales: Almuerzos) => { set({ almuerzosTotales }) },
  setAlmuerzosReservados: (almuerzosReservados: AlmuerzosReservados) => { set({ almuerzosReservados }) },
  setAlmuerzosEntregados: (almuerzosEntregados: AlmuerzosEntregados) => { set({ almuerzosEntregados }) },
  setAlmuerzosEstadisticas: (almuerzosEstadisticas: AlmuerzosEstadisticas) => { set({ almuerzosEstadisticas }) }
}))

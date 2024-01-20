import { type Almuerzos, type AlmuerzosEntregados, type AlmuerzosReservados } from '@/types/almuerzos'
import { create } from 'zustand'

interface AlmuerzosStore {
  almuerzosTotales: Almuerzos
  almuerzosReservados: AlmuerzosReservados
  almuerzosEntregados: AlmuerzosEntregados
  setAlmuerzosTotales: (almuerzosTotales: Almuerzos) => void
  setAlmuerzosReservados: (almuerzosReservados: AlmuerzosReservados) => void
  setAlmuerzosEntregados: (almuerzosEntregados: AlmuerzosEntregados) => void
}

export const useAlmuerzosStore = create<AlmuerzosStore>((set) => ({
  almuerzosTotales: {
    id_almuerzo: '',
    fecha: new Date(),
    total_almuerzos: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  almuerzosReservados: {
    id_almuerzos_reservados: '',
    id_almuerzo: '',
    cantidad: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  almuerzosEntregados: {
    id_almuerzos_entregados: '',
    id_almuerzo: '',
    cantidad: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  setAlmuerzosTotales: (almuerzosTotales: Almuerzos) => { set({ almuerzosTotales }) },
  setAlmuerzosReservados: (almuerzosReservados: AlmuerzosReservados) => { set({ almuerzosReservados }) },
  setAlmuerzosEntregados: (almuerzosEntregados: AlmuerzosEntregados) => { set({ almuerzosEntregados }) }
}))

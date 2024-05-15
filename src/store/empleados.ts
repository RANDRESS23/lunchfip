import { EMPLEADO_INITIAL_VALUES } from '@/initial-values/empleado'
import { type Empleado } from '@/types/empleados'
import { create } from 'zustand'

interface EmpleadoStore {
  empleado: Empleado
  setEmpleado: (empleado: Empleado) => void
}

export const useEmpleadoStore = create<EmpleadoStore>((set) => ({
  empleado: EMPLEADO_INITIAL_VALUES,
  setEmpleado: (empleado: Empleado) => { set({ empleado }) }
}))

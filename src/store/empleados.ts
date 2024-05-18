import { EMPLEADO_INITIAL_VALUES } from '@/initial-values/empleado'
import { type Empleado } from '@/types/empleados'
import { create } from 'zustand'

interface EmpleadoStore {
  empleado: Empleado
  empleados: Empleado[]
  setEmpleados: (empleados: Empleado[]) => void
  setEmpleado: (empleado: Empleado) => void
}

export const useEmpleadoStore = create<EmpleadoStore>((set) => ({
  empleado: EMPLEADO_INITIAL_VALUES,
  empleados: [EMPLEADO_INITIAL_VALUES],
  setEmpleados: (empleados: Empleado[]) => { set({ empleados }) },
  setEmpleado: (empleado: Empleado) => { set({ empleado }) }
}))

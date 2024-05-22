import { EMPLEADO_INITIAL_VALUES } from '@/initial-values/empleado'
import { type Empleado } from '@/types/empleados'
import { create } from 'zustand'

interface EmpleadoStore {
  empleado: Empleado
  empleados: Empleado[]
  empleadosCount: number
  setEmpleadosCount: (empleadosCount: number) => void
  setEmpleados: (empleados: Empleado[]) => void
  setEmpleado: (empleado: Empleado) => void
}

export const useEmpleadoStore = create<EmpleadoStore>((set) => ({
  empleado: EMPLEADO_INITIAL_VALUES,
  empleados: [EMPLEADO_INITIAL_VALUES],
  empleadosCount: 0,
  setEmpleadosCount: (empleadosCount: number) => { set({ empleadosCount }) },
  setEmpleados: (empleados: Empleado[]) => { set({ empleados }) },
  setEmpleado: (empleado: Empleado) => { set({ empleado }) }
}))

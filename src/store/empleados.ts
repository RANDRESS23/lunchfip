import { EMPLEADO_INITIAL_VALUES } from '@/initial-values/empleado'
import { type Empleado } from '@/types/empleados'
import { create } from 'zustand'

interface EmpleadoStore {
  empleado: Empleado
  empleados: Empleado[]
  totalEmpleados: Empleado[]
  empleadosCount: number
  setEmpleadosCount: (empleadosCount: number) => void
  setEmpleados: (empleados: Empleado[]) => void
  setTotalEmpleados: (empleados: Empleado[]) => void
  setEmpleado: (empleado: Empleado) => void
}

/* ➡ Configurando el store para el empleado */
export const useEmpleadoStore = create<EmpleadoStore>((set) => ({
  empleado: EMPLEADO_INITIAL_VALUES,
  empleados: [EMPLEADO_INITIAL_VALUES],
  totalEmpleados: [EMPLEADO_INITIAL_VALUES],
  empleadosCount: 0,
  setEmpleadosCount: (empleadosCount: number) => { set({ empleadosCount }) },
  setEmpleados: (empleados: Empleado[]) => { set({ empleados }) },
  setTotalEmpleados: (totalEmpleados: Empleado[]) => { set({ totalEmpleados }) },
  setEmpleado: (empleado: Empleado) => { set({ empleado }) }
}))

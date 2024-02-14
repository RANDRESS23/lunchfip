import { EMPLEADO_INITIAL_VALUES } from '@/initial-values/empleado'
import { type EmpleadoSignIn } from '@/types/empleados'
import { create } from 'zustand'

interface EmpleadoStore {
  empleado: EmpleadoSignIn
  setEmpleado: (empleado: EmpleadoSignIn) => void
}

export const useEmpleadoStore = create<EmpleadoStore>((set) => ({
  empleado: EMPLEADO_INITIAL_VALUES,
  setEmpleado: (empleado: EmpleadoSignIn) => { set({ empleado }) }
}))

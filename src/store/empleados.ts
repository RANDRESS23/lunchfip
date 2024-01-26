import { type EmpleadoSignIn } from '@/types/empleados'
import { create } from 'zustand'

interface EmpleadosStore {
  empleado: EmpleadoSignIn
  setEmpleado: (empleado: EmpleadoSignIn) => void
}

export const useEmpleadosStore = create<EmpleadosStore>((set) => ({
  empleado: {
    id_empleado: '',
    primer_nombre: '',
    segundo_nombre: '',
    primer_apellido: '',
    segundo_apellido: '',
    id_tipo_documento: '',
    tipo_documento: '',
    numero_documento: '',
    correo: '',
    clave: '',
    id_sexo: '',
    sexo: '',
    celular: '',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  setEmpleado: (empleado: EmpleadoSignIn) => { set({ empleado }) }
}))

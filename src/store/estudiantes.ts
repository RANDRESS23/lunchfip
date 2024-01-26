import { type Estudiante } from '@/types/estudiantes'
import { create } from 'zustand'

interface EstudiantesStore {
  estudiante: Estudiante
  setEstudiante: (estudiante: Estudiante) => void
}

export const useEstudiantesStore = create<EstudiantesStore>((set) => ({
  estudiante: {
    id_estudiante: '',
    primer_nombre: '',
    segundo_nombre: '',
    primer_apellido: '',
    segundo_apellido: '',
    id_tipo_documento: '',
    tipo_documento: '',
    numero_documento: '',
    id_programa: '',
    programa: '',
    correo_institucional: '',
    clave: '',
    id_sexo: '',
    sexo: '',
    celular: '',
    saldo: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  setEstudiante: (estudiante: Estudiante) => { set({ estudiante }) }
}))

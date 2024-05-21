import { ESTUDIANTE_INITIAL_VALUES } from '@/initial-values/estudiante'
import { type Estudiante } from '@/types/estudiantes'
import { create } from 'zustand'

interface EstudianteStore {
  estudiante: Estudiante
  estudiantes: Estudiante[]
  setEstudiante: (estudiante: Estudiante) => void
  setEstudiantes: (estudiantes: Estudiante[]) => void
}

export const useEstudianteStore = create<EstudianteStore>((set) => ({
  estudiante: ESTUDIANTE_INITIAL_VALUES,
  estudiantes: [ESTUDIANTE_INITIAL_VALUES],
  setEstudiante: (estudiante: Estudiante) => { set({ estudiante }) },
  setEstudiantes: (estudiantes: Estudiante[]) => { set({ estudiantes }) }
}))

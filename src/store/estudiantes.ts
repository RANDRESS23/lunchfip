import { ESTUDIANTE_INITIAL_VALUES } from '@/initial-values/estudiante'
import { type Estudiante } from '@/types/estudiantes'
import { create } from 'zustand'

interface EstudianteStore {
  estudiante: Estudiante
  setEstudiante: (estudiante: Estudiante) => void
}

export const useEstudianteStore = create<EstudianteStore>((set) => ({
  estudiante: ESTUDIANTE_INITIAL_VALUES,
  setEstudiante: (estudiante: Estudiante) => { set({ estudiante }) }
}))

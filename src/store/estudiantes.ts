import { ESTUDIANTE_INITIAL_VALUES } from '@/initial-values/estudiante'
import { type Estudiante } from '@/types/estudiantes'
import { create } from 'zustand'

interface EstudianteStore {
  estudiante: Estudiante
  estudiantes: Estudiante[]
  estudiantesCount: number
  setEstudiante: (estudiante: Estudiante) => void
  setEstudiantes: (estudiantes: Estudiante[]) => void
  setEstudiantesCount: (estudiantesCount: number) => void
}

export const useEstudianteStore = create<EstudianteStore>((set) => ({
  estudiante: ESTUDIANTE_INITIAL_VALUES,
  estudiantes: [ESTUDIANTE_INITIAL_VALUES],
  estudiantesCount: 0,
  setEstudiante: (estudiante: Estudiante) => { set({ estudiante }) },
  setEstudiantes: (estudiantes: Estudiante[]) => { set({ estudiantes }) },
  setEstudiantesCount: (estudiantesCount: number) => { set({ estudiantesCount }) }
}))

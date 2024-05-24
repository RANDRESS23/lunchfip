import { ESTUDIANTE_ALMUERZO_INITIAL_VALUES, ESTUDIANTE_INITIAL_VALUES } from '@/initial-values/estudiante'
import { type EstudianteAlmuerzo, type Estudiante } from '@/types/estudiantes'
import { create } from 'zustand'

interface EstudianteStore {
  estudiante: Estudiante
  estudiantes: Estudiante[]
  estudiantesCount: number
  estudiantesAlmuerzos: EstudianteAlmuerzo[]
  estudiantesAlmuerzosCount: number
  setEstudiante: (estudiante: Estudiante) => void
  setEstudiantes: (estudiantes: Estudiante[]) => void
  setEstudiantesAlmuerzos: (estudiantesAlmuerzos: EstudianteAlmuerzo[]) => void
  setEstudiantesCount: (estudiantesCount: number) => void
  setEstudiantesAlmuerzosCount: (estudiantesCount: number) => void
}

export const useEstudianteStore = create<EstudianteStore>((set) => ({
  estudiante: ESTUDIANTE_INITIAL_VALUES,
  estudiantes: [ESTUDIANTE_INITIAL_VALUES],
  estudiantesCount: 0,
  estudiantesAlmuerzos: [ESTUDIANTE_ALMUERZO_INITIAL_VALUES],
  estudiantesAlmuerzosCount: 0,
  setEstudiante: (estudiante: Estudiante) => { set({ estudiante }) },
  setEstudiantes: (estudiantes: Estudiante[]) => { set({ estudiantes }) },
  setEstudiantesAlmuerzos: (estudiantesAlmuerzos: EstudianteAlmuerzo[]) => { set({ estudiantesAlmuerzos }) },
  setEstudiantesCount: (estudiantesCount: number) => { set({ estudiantesCount }) },
  setEstudiantesAlmuerzosCount: (estudiantesAlmuerzosCount: number) => { set({ estudiantesAlmuerzosCount }) }
}))

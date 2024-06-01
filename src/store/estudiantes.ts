import { ESTUDIANTE_ALMUERZO_INITIAL_VALUES, ESTUDIANTE_HISTORIAL_RESERVAS_INITIAL_VALUES, ESTUDIANTE_INITIAL_VALUES } from '@/initial-values/estudiante'
import { type EstudianteAlmuerzo, type Estudiante, type EstudianteHistorialReservas } from '@/types/estudiantes'
import { create } from 'zustand'

interface EstudianteStore {
  estudiante: Estudiante
  estudiantes: Estudiante[]
  totalEstudiantes: Estudiante[]
  estudiantesCount: number
  estudianteHistorialReservasCount: number
  estudianteHistorialRecargasCount: number
  estudiantesAlmuerzos: EstudianteAlmuerzo[]
  estudianteHistorialReservas: EstudianteHistorialReservas[]
  estudianteHistorialRecargas: EstudianteHistorialReservas[]
  totalEstudiantesAlmuerzos: EstudianteAlmuerzo[]
  estudiantesAlmuerzosCount: number
  codigoQRReserva: string
  setEstudiante: (estudiante: Estudiante) => void
  setEstudiantes: (estudiantes: Estudiante[]) => void
  setTotalEstudiantes: (totalEstudiantes: Estudiante[]) => void
  setEstudiantesAlmuerzos: (estudiantesAlmuerzos: EstudianteAlmuerzo[]) => void
  setEstudianteHistorialReservas: (estudianteHistorialReservas: EstudianteHistorialReservas[]) => void
  setEstudianteHistorialRecargas: (estudianteHistorialReservas: EstudianteHistorialReservas[]) => void
  setTotalEstudiantesAlmuerzos: (totalEstudiantesAlmuerzos: EstudianteAlmuerzo[]) => void
  setEstudiantesCount: (estudiantesCount: number) => void
  setEstudianteHistorialReservasCount: (estudianteHistorialReservasCount: number) => void
  setEstudianteHistorialRecargasCount: (estudianteHistorialRecargasCount: number) => void
  setEstudiantesAlmuerzosCount: (estudiantesCount: number) => void
  setCodigoQRReserva: (codigoQRReserva: string) => void
}

export const useEstudianteStore = create<EstudianteStore>((set) => ({
  estudiante: ESTUDIANTE_INITIAL_VALUES,
  estudiantes: [ESTUDIANTE_INITIAL_VALUES],
  totalEstudiantes: [ESTUDIANTE_INITIAL_VALUES],
  estudiantesCount: 0,
  estudiantesAlmuerzos: [ESTUDIANTE_ALMUERZO_INITIAL_VALUES],
  estudianteHistorialReservas: [ESTUDIANTE_HISTORIAL_RESERVAS_INITIAL_VALUES],
  estudianteHistorialRecargas: [ESTUDIANTE_HISTORIAL_RESERVAS_INITIAL_VALUES],
  totalEstudiantesAlmuerzos: [ESTUDIANTE_ALMUERZO_INITIAL_VALUES],
  estudiantesAlmuerzosCount: 0,
  estudianteHistorialReservasCount: 0,
  estudianteHistorialRecargasCount: 0,
  codigoQRReserva: '',
  setEstudiante: (estudiante: Estudiante) => { set({ estudiante }) },
  setEstudiantes: (estudiantes: Estudiante[]) => { set({ estudiantes }) },
  setTotalEstudiantes: (totalEstudiantes: Estudiante[]) => { set({ totalEstudiantes }) },
  setEstudiantesAlmuerzos: (estudiantesAlmuerzos: EstudianteAlmuerzo[]) => { set({ estudiantesAlmuerzos }) },
  setEstudianteHistorialReservas: (estudianteHistorialReservas: EstudianteHistorialReservas[]) => { set({ estudianteHistorialReservas }) },
  setEstudianteHistorialRecargas: (estudianteHistorialReservas: EstudianteHistorialReservas[]) => { set({ estudianteHistorialReservas }) },
  setTotalEstudiantesAlmuerzos: (totalEstudiantesAlmuerzos: EstudianteAlmuerzo[]) => { set({ totalEstudiantesAlmuerzos }) },
  setEstudiantesCount: (estudiantesCount: number) => { set({ estudiantesCount }) },
  setEstudianteHistorialReservasCount: (estudianteHistorialReservasCount: number) => { set({ estudianteHistorialReservasCount }) },
  setEstudianteHistorialRecargasCount: (estudianteHistorialRecargasCount: number) => { set({ estudianteHistorialRecargasCount }) },
  setEstudiantesAlmuerzosCount: (estudiantesAlmuerzosCount: number) => { set({ estudiantesAlmuerzosCount }) },
  setCodigoQRReserva: (codigoQRReserva: string) => { set({ codigoQRReserva }) }
}))

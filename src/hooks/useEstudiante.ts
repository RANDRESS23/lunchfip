import { useEffect } from 'react'
import { useEstudianteStore } from '@/store/estudiantes'
import { useLocalStorage, useReadLocalStorage } from 'usehooks-ts'
import { type Estudiante } from '@/types/estudiantes'
import { ESTUDIANTE_INITIAL_VALUES } from '@/initial-values/estudiante'

export const useEstudiante = () => {
  const estudiante = useEstudianteStore(state => state.estudiante)
  const setEstudiante = useEstudianteStore(state => state.setEstudiante)
  const estudianteStorage: Estudiante | null = useReadLocalStorage('estudiante')
  const [estudianteStorageInitial, setEstudianteStorage] = useLocalStorage<Estudiante>('estudiante', () => ESTUDIANTE_INITIAL_VALUES)

  const setEstudianteStorageMemo = (estudiante: Estudiante) => {
    setEstudianteStorage(estudiante)
    setEstudiante(estudiante)
  }

  useEffect(() => {
    if (estudianteStorage === null) setEstudianteStorage(estudianteStorageInitial)
    else if (estudianteStorage.correo_institucional !== '') setEstudiante(estudianteStorage)
  }, [])

  return { estudiante, setEstudiante: setEstudianteStorageMemo }
}

import { useState, useEffect } from 'react'
import { useEstudianteStore } from '@/store/estudiantes'
import { useLocalStorage, useReadLocalStorage } from 'usehooks-ts'
import { type Estudiante } from '@/types/estudiantes'
import { ESTUDIANTE_INITIAL_VALUES } from '@/initial-values/estudiante'
import api from '@/libs/api'

export const useEstudiante = () => {
  const [loadingStudent, setLoadingStudent] = useState(false)
  const estudiante = useEstudianteStore(state => state.estudiante)
  const setEstudiante = useEstudianteStore(state => state.setEstudiante)
  const estudianteStorage: Estudiante | null = useReadLocalStorage('estudiante')
  const [estudianteStorageInitial, setEstudianteStorage] = useLocalStorage<Estudiante>('estudiante', () => ESTUDIANTE_INITIAL_VALUES)

  const setEstudianteStorageMemo = (estudiante: Estudiante) => {
    setEstudianteStorage(estudiante)
    setEstudiante(estudiante)
  }

  useEffect(() => {
    setLoadingStudent(true)

    if (estudianteStorage === null) setEstudianteStorage(estudianteStorageInitial)
    else if (estudianteStorage.correo_institucional !== '') {
      const getStudentInfo = async () => {
        try {
          const response = await api.post('/estudiantes/info/', {
            correo_institucional: estudianteStorage.correo_institucional
          })

          const estudiante: Estudiante = response.data?.estudiante

          if (estudiante.saldo === estudianteStorage.saldo) setEstudiante(estudianteStorage)
          else {
            setEstudiante(estudiante)
            setEstudianteStorage(estudiante)
          }
        } catch (error) {
          console.log(error)
        }
      }

      getStudentInfo()
    }

    setLoadingStudent(false)
  }, [])

  return { estudiante, loadingStudent, setEstudiante: setEstudianteStorageMemo }
}

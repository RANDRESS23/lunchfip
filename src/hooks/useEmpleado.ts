import { useEffect } from 'react'
import { useLocalStorage, useReadLocalStorage } from 'usehooks-ts'
import { useEmpleadoStore } from '@/store/empleados'
import { type EmpleadoSignIn } from '@/types/empleados'
import { EMPLEADO_INITIAL_VALUES } from '@/initial-values/empleado'

export const useEmpleado = () => {
  const empleado = useEmpleadoStore(state => state.empleado)
  const setEmpleado = useEmpleadoStore(state => state.setEmpleado)
  const empleadoStorage: EmpleadoSignIn | null = useReadLocalStorage('empleado')
  const [empleadoStorageInitial, setEmpleadoStorage] = useLocalStorage<EmpleadoSignIn>('empleado', () => EMPLEADO_INITIAL_VALUES)

  const setEmpleadoStorageMemo = (empleado: EmpleadoSignIn) => {
    setEmpleadoStorage(empleado)
    setEmpleado(empleado)
  }

  useEffect(() => {
    if (empleadoStorage === null) setEmpleadoStorage(empleadoStorageInitial)
    else if (empleadoStorage.correo !== '') setEmpleado(empleadoStorage)
  }, [])

  return { empleado, setEmpleado: setEmpleadoStorageMemo }
}

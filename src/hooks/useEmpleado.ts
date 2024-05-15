import { useEffect } from 'react'
import { useLocalStorage, useReadLocalStorage } from 'usehooks-ts'
import { useEmpleadoStore } from '@/store/empleados'
import { type Empleado } from '@/types/empleados'
import { EMPLEADO_INITIAL_VALUES } from '@/initial-values/empleado'

export const useEmpleado = () => {
  const empleado = useEmpleadoStore(state => state.empleado)
  const setEmpleado = useEmpleadoStore(state => state.setEmpleado)
  const empleadoStorage: Empleado | null = useReadLocalStorage('empleado')
  const [empleadoStorageInitial, setEmpleadoStorage] = useLocalStorage<Empleado>('empleado', () => EMPLEADO_INITIAL_VALUES)

  const setEmpleadoStorageMemo = (empleado: Empleado) => {
    setEmpleadoStorage(empleado)
    setEmpleado(empleado)
  }

  useEffect(() => {
    if (empleadoStorage === null) setEmpleadoStorage(empleadoStorageInitial)
    else if (empleadoStorage.correo !== '') setEmpleado(empleadoStorage)
  }, [])

  return { empleado, setEmpleado: setEmpleadoStorageMemo }
}

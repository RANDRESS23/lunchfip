import { useState, useEffect } from 'react'
import api from '@/libs/api'
import { type Empleado } from '@/types/empleados'
import { useEmpleadoStore } from '@/store/empleados'

interface EmpleadoProps {
  page?: string
  rows?: string
}

/* ➡ Hook para manejar los datos de los empleados */
export const useEmpleados = ({ page = '1', rows = '10' }: EmpleadoProps) => {
  const empleados = useEmpleadoStore(state => state.empleados)
  const setEmpleados = useEmpleadoStore(state => state.setEmpleados)
  const totalEmpleados = useEmpleadoStore(state => state.totalEmpleados)
  const setTotalEmpleados = useEmpleadoStore(state => state.setTotalEmpleados)
  const empleadosCount = useEmpleadoStore(state => state.empleadosCount)
  const setEmpleadosCount = useEmpleadoStore(state => state.setEmpleadosCount)
  const [loadingEmpleados, setLoadingEmpleados] = useState(false)

  useEffect(() => {
    const getEmpleados = async () => {
      try {
        setLoadingEmpleados(true)

        const response = await api.get(`/empleados?page=${page}&rows=${rows}`)

        setEmpleados(response.data.empleados as Empleado[])
        setTotalEmpleados(response.data.totalEmpleados as Empleado[])
        setEmpleadosCount(response.data.empleadosCount as number)
      } catch (error) {
        console.log(error)
      } finally {
        setLoadingEmpleados(false)
      }
    }

    getEmpleados()
  }, [page, rows])

  return { empleados, empleadosCount, totalEmpleados, loadingEmpleados, setEmpleados }
}

import { useState, useEffect } from 'react'
import api from '@/libs/api'
import { type Empleado } from '@/types/empleados'
import { useEmpleadoStore } from '@/store/empleados'

interface EmpleadoProps {
  page?: string
  rows?: string
}

export const useEmpleados = ({ page = '1', rows = '10' }: EmpleadoProps) => {
  const empleados = useEmpleadoStore(state => state.empleados)
  const setEmpleados = useEmpleadoStore(state => state.setEmpleados)
  const empleadosCount = useEmpleadoStore(state => state.empleadosCount)
  const setEmpleadosCount = useEmpleadoStore(state => state.setEmpleadosCount)
  const [emailsEmpleados, setEmailsEmpleados] = useState<string[]>([])
  const [loadingEmpleados, setLoadingEmpleados] = useState(false)

  useEffect(() => {
    const getEmpleados = async () => {
      try {
        setLoadingEmpleados(true)

        const response = await api.get(`/empleados/?page=${page}&rows=${rows}`)
        const emails: string[] = response.data.totalEmpleados.map((empleado: Empleado) => empleado.correo)

        setEmpleados(response.data.empleados as Empleado[])
        setEmailsEmpleados(emails)
        setEmpleadosCount(response.data.empleadosCount as number)
      } catch (error) {
        console.log(error)
      } finally {
        setLoadingEmpleados(false)
      }
    }

    getEmpleados()
  }, [page, rows])

  return { empleados, empleadosCount, emailsEmpleados, loadingEmpleados, setEmpleados }
}

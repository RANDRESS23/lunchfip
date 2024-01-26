import { useState, useEffect } from 'react'
import api from '@/libs/api'
import { type EmpleadoSignIn } from '@/types/empleados'
import { useEmpleadosStore } from '@/store/empleados'

export const useEmpleadoSignIn = ({ correo }: { correo: string }) => {
  const [loadingEmpleadoSignIn, setLoadingEmpleadoSignIn] = useState(false)
  const empleado = useEmpleadosStore(state => state.empleado)
  const setEmpleado = useEmpleadosStore(state => state.setEmpleado)

  useEffect(() => {
    const getEmpleadoSignIn = async () => {
      try {
        setLoadingEmpleadoSignIn(true)

        const response = await api.post('/empleados/info', {
          correo
        })

        if (response.data === null) return

        setEmpleado(response.data.empleado as EmpleadoSignIn)
      } catch (error) {
        console.log(error)
      } finally {
        setLoadingEmpleadoSignIn(false)
      }
    }

    getEmpleadoSignIn()
  }, [correo])

  return { empleado, loadingEmpleadoSignIn }
}

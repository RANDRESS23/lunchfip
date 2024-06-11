'use client'

import { useState } from 'react'
import { useForm, type FieldValues, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/Input'
import { IoEyeOff } from 'react-icons/io5'
import { FaEye } from 'react-icons/fa'
import { Button } from '@/components/Button'
import { signInSchema } from '@/app/api/estudiantes/schema'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { useEmpleados } from '@/hooks/useEmpleados'
import api from '@/libs/api'
import { type Empleado } from '@/types/empleados'
import Link from 'next/link'
import { type Estudiante } from '@/types/estudiantes'
import { useEstudiante } from '@/hooks/useEstudiante'
import { useEmpleado } from '@/hooks/useEmpleado'
import { TitleAnimated } from '@/components/TitleAnimated'
import { createClient } from '@/utils/supabase/client'
import { useEmailsAdmin } from '@/hooks/useEmailsAdmin'
import { useAdministrador } from '@/hooks/useAdministrador'
import { type Administrador } from '@/types/administradores'

export const FormSignIn = () => {
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isConfirmResponse, setIsConfirmResponse] = useState(false)
  const { emailsEmpleados } = useEmpleados({})
  const { emailsAdmin } = useEmailsAdmin()
  const { setEmpleado } = useEmpleado()
  const { setAdministrador } = useAdministrador()
  const { setEstudiante } = useEstudiante()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FieldValues>({
    defaultValues: {
      correo: '',
      clave: ''
    },
    resolver: zodResolver(signInSchema)
  })

  const toggleVisibility = () => { setPasswordVisible(!passwordVisible) }

  const onSubmit: SubmitHandler<FieldValues> = async data => {
    setIsLoading(true)

    try {
      const supabase = createClient()

      const { error } = await supabase.auth.signInWithPassword({
        email: data.correo,
        password: data.clave
      })

      if (error) {
        console.log({ error })

        return toast.error('!El correo electrónico o la contraseña son incorrectos!')
      }

      const isEmpleado = emailsEmpleados.includes(data.correo as string)
      const isAdmin = emailsAdmin.includes(data.correo as string)

      if (isEmpleado) {
        const response = await api.post('/empleados/info', {
          correo: data.correo
        })

        setEmpleado(response.data.empleado as Empleado)
        setIsConfirmResponse(true)

        toast.success('¡Inicio de sesión exitosamente!')
        router.push('/profile/employee/home')
        router.refresh()
      } else if (isAdmin) {
        const response = await api.post('/administradores/info', {
          correo: data.correo
        })

        setAdministrador(response.data.administrador as Administrador)
        setIsConfirmResponse(true)

        toast.success('¡Inicio de sesión exitosamente!')
        router.push('/profile/admin/home')
        router.refresh()
      } else {
        const response = await api.post('/estudiantes/info', {
          correo_institucional: data.correo
        })

        setEstudiante(response.data.estudiante as Estudiante)
        setIsConfirmResponse(true)

        toast.success('¡Inicio de sesión exitosamente!')
        router.push('/profile/student/home')
        router.refresh()
      }
    } catch (error: any) {
      return toast.error('!El correo electrónico o la contraseña son incorrectos!')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='relative bg-grid-black dark:bg-grid-white py-10 font-inter-sans flex flex-col justify-center items-center'>
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_0.5%,black)]" />

      <form onSubmit={handleSubmit(onSubmit)} className='lg:max-w-[590px] mx-auto w-11/12 flex flex-col gap-5'>

        <TitleAnimated
          text1='Iniciar sesión en'
          text2='LunchFip'
        />

        <Input
          type="email"
          label="Correo institucional"
          isRequired
          name="correo"
          register={register}
          disabled={isLoading}
          endContent={
            <div className="pointer-events-none flex items-center h-full">
              <span className="text-default-400 text-small">@itfip.edu.co</span>
            </div>
          }
          errors={errors}
        />

        <Input
          type={passwordVisible ? 'text' : 'password'}
          label="Contraseña"
          isRequired
          name="clave"
          register={register}
          disabled={isLoading}
          endContent={
            <button className="focus:outline-none h-full" type="button" onClick={toggleVisibility}>
              {passwordVisible
                ? (
                <IoEyeOff className="text-2xl text-default-400 pointer-events-none" />
                  )
                : (
                <FaEye className="text-2xl text-default-400 pointer-events-none" />
                  )}
            </button>
          }
          errors={errors}
        />
        <div className='flex justify-start items-center mb-4 z-10'>
          <Link
            href="/forgot-password"
            className='text-sm text-primary hover:opacity-80 cursor-pointer transition-all'
          >
            ¿Has olvidado tu contraseña?
          </Link>
        </div>

        <Button
          type="submit"
          text={isLoading || isConfirmResponse ? 'Cargando...' : 'Iniciar sesión'}
          disabled={isLoading || isConfirmResponse}
        />

        <div className='flex justify-center items-center gap-2 z-10'>
          <span className='text-sm'>¿No estás registrado?</span>
          <Link
            href="/sign-up"
            className='text-sm text-primary hover:opacity-80 cursor-pointer transition-all'
          >
            Registrarme
          </Link>
        </div>
      </form>
    </div>
  )
}

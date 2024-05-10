'use client'

import { useState } from 'react'
import { useForm, type FieldValues, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import api from '@/libs/api'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/Input'
import { Button } from '@/components/Button'
import { toast } from 'sonner'
import { IoEyeOff } from 'react-icons/io5'
import { FaEye } from 'react-icons/fa'
import { TitleAnimated } from '@/components/TitleAnimated'
import { createClient } from '@/utils/supabase/client'
import { useEstudiante } from '@/hooks/useEstudiante'
import { type Estudiante } from '@/types/estudiantes'

const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/

const resetPasswordSchema = z.object({
  clave: z.string().refine(value => passwordRegex.test(value), {
    message: 'La contraseña debe tener al menos 8 caracteres, una letra mayúscula, una letra minúscula, un número y un carácter especial.'
  }),
  clave_2: z.string()
}).required().refine(data => data.clave === data.clave_2, {
  message: 'Las contraseñas no coinciden.',
  path: ['clave_2']
})

export const FormResetPassword = ({ token }: { token: string }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [isConfirmResponse, setIsConfirmResponse] = useState(false)
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [passwordVisible2, setPasswordVisible2] = useState(false)
  const router = useRouter()
  const { estudiante, setEstudiante } = useEstudiante()

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FieldValues>({
    defaultValues: {
      clave: '',
      clave_2: ''
    },
    resolver: zodResolver(resetPasswordSchema)
  })

  const toggleVisibility = () => { setPasswordVisible(!passwordVisible) }
  const toggleVisibility2 = () => { setPasswordVisible2(!passwordVisible2) }

  const onSubmit: SubmitHandler<FieldValues> = async data => {
    setIsLoading(true)

    try {
      const supabase = createClient()

      const { error } = await supabase.auth.verifyOtp({
        type: 'recovery',
        token_hash: token
      })

      if (error) {
        console.log({ error })

        return toast.error('¡Ocurrió un error al solicitar el cambio de contraseña, puede que el link de restablecimiento haya vencido!.')
      }

      const { error: error2 } = await supabase.auth.updateUser({
        password: data.clave
      })

      if (error2) {
        console.log({ error2 })

        return toast.error('¡Ocurrió un error al solicitar el cambio de contraseña, puede que el link de restablecimiento haya vencido!.')
      }

      await api.patch('/estudiantes/cambio-clave', { numero_documento: estudiante.numero_documento, clave: data.clave, clave_2: data.clave_2 })

      const response = await api.post('/estudiantes/info', {
        correo_institucional: estudiante.correo_institucional
      })

      setEstudiante(response.data.estudiante as Estudiante)
      setIsConfirmResponse(true)

      toast.success('¡Cambio de contraseña exitosamente!')
      router.push('/profile/student/home')
      router.refresh()
    } catch (error: any) {
      const { errors } = error
      let errorsMessagesString = ''

      errors.forEach((errorClerk: any) => {
        if (errorClerk.code === 'form_password_pwned') {
          errorsMessagesString += '¡La contraseña es muy insegura, por favor intente con otra!. \n'
        }

        if (errorClerk.code === 'form_code_incorrect') {
          errorsMessagesString += '¡El código de verificación de cambio de contraseña es incorrecto!. \n'
        }
      })

      toast.error(errorsMessagesString)
      console.log({ error })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='relative bg-grid-black dark:bg-grid-white py-10 font-inter-sans flex flex-col justify-center items-center'>
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_0.5%,black)]" />
      <form onSubmit={handleSubmit(onSubmit)} className='lg:max-w-[690px] mx-auto w-11/12 flex flex-col gap-5'>
        <TitleAnimated
          text1='Confirmar cambio de contraseña en'
          text2='Lunchfip'
        />
        <p className='-mt-3 text-center z-10 text-p-light dark:text-p-dark'>
          Para finalizar el proceso de cambio de contraseña, escribe tu nueva contraseña.
        </p>

        <div className='flex flex-col justify-center items-center gap-7 my-6 w-full'>
          <div className='w-full flex flex-col justify-center items-center gap-5'>
            <Input
              type={passwordVisible ? 'text' : 'password'}
              label="Contraseña"
              isRequired
              name="clave"
              register={register}
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

            <Input
              type={passwordVisible2 ? 'text' : 'password'}
              label="Confirmar contraseña"
              isRequired
              name="clave_2"
              register={register}
              endContent={
                <button className="focus:outline-none h-full" type="button" onClick={toggleVisibility2}>
                  {passwordVisible2
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
          </div>
        </div>

        <Button
          type="submit"
          text={isLoading || isConfirmResponse ? 'Cargando...' : 'Confirmar cambio de contraseña'}
          disabled={isLoading || isConfirmResponse}
        />
      </form>
    </div>
  )
}

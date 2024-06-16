'use client'

import { useState } from 'react'
import { useForm, type FieldValues, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '@/components/Input'
import { Button } from '@/components/Button'
import api from '@/libs/api'
import { toast } from 'sonner'
import { TitleAnimated } from '@/components/TitleAnimated'
import { createClient } from '@/utils/supabase/client'
import { useEstudiante } from '@/hooks/useEstudiante'
import { ESTUDIANTE_INITIAL_VALUES } from '@/initial-values/estudiante'

const emailRegex = /^[A-Za-z0-9._%+-]+@itfip\.edu\.co$/

const correoEstudiantilSchema = z.object({
  correo_institucional: z.string().refine(value => emailRegex.test(value), {
    message: 'Debes usar un correo institucional. (@itfip.edu.co)'
  })
})

/* ➡ Este componente es el que se renderiza el formulario principal de la pagina "¿Olvidaste tu contraseña?" del aplicativo */
export const FormForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [isConfirmSendedEmail, setIsConfirmSendedEmail] = useState(false)
  const { estudiante, setEstudiante } = useEstudiante()

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FieldValues>({
    defaultValues: {
      correo_institucional: ''
    },
    resolver: zodResolver(correoEstudiantilSchema)
  })

  const onSubmit: SubmitHandler<FieldValues> = async data => {
    setIsLoading(true)

    try {
      const response = await api.post('/estudiantes/verificar/correo', data)

      if (response.status === 200) {
        setEstudiante({ ...ESTUDIANTE_INITIAL_VALUES, correo_institucional: data.correo_institucional, numero_documento: response.data.numero_documento })

        const supabase = createClient()
        const origin = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://www.lunchfip.online'

        const { error } = await supabase.auth.resetPasswordForEmail(data.correo_institucional as string, { redirectTo: `${origin}/reset-password` })

        if (error) {
          console.log({ error })

          return toast.error('¡Ocurrió un error al momento de enviar el enlace de cambio de contraseña!.')
        }

        setIsConfirmSendedEmail(true)
        toast.success('¡Enlace de cambio de contraseña enviado exitosamente!')
      }
    } catch (error: any) {
      if (error.response.data !== undefined) {
        const errorsMessages = Object.values(error.response.data as Record<string, string>)
        let errorsMessagesString = ''

        errorsMessages.forEach((message: any) => {
          errorsMessagesString += `${message} ${'\n'}`
        })

        return toast.error(errorsMessagesString)
      }

      console.error({ error })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='relative bg-grid-black dark:bg-grid-white py-10 font-inter-sans flex flex-col justify-center items-center'>
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_0.5%,black)]" />
      {
        !isConfirmSendedEmail
          ? (
              <form
                className='lg:max-w-[590px] mx-auto w-11/12 flex flex-col gap-5'
                onSubmit={handleSubmit(onSubmit)}
              >
                <TitleAnimated
                  text1='Recuperar'
                  text2='Contraseña'
                />
                <p className='-mt-5 text-center z-10 text-p-light dark:text-p-dark mb-7'>
                  Para cambiar tu contraseña escribe tu correo institucional, allí te llegará el enlace para el respectivo cambio de contraseña.
                </p>

                <Input
                  type="email"
                  label="Correo institucional"
                  isRequired
                  name="correo_institucional"
                  register={register}
                  endContent={
                    <div className="pointer-events-none flex items-center h-full">
                      <span className="text-default-400 text-small">@itfip.edu.co</span>
                    </div>
                  }
                  errors={errors}
                />

                <Button
                  type="submit"
                  text='Enviar enlace de cambio de contraseña'
                  disabled={isLoading}
                />
              </form>
            )
          : (
              <>
                <TitleAnimated
                  text1='Enlace de cambio de contraseña enviado'
                  text2='exitosamente!'
                />
                <p className='text-center z-10 text-p-light dark:text-p-dark mb-7'>
                  Verifica tu correo institucional ({estudiante.correo_institucional}), allí te llegó el enlace para el respectivo cambio de contraseña.
                </p>
              </>
            )
      }
    </div>
  )
}

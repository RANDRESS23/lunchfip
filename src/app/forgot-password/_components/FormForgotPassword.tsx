'use client'

import { useState } from 'react'
import { useSignIn } from '@clerk/nextjs'
import { useForm, type FieldValues, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '@/components/Input'
import { Button } from '@/components/Button'
import api from '@/libs/api'
import { FormResetPassword } from './FormResetPassword'
import { toast } from 'sonner'

const emailRegex = /^[A-Za-z0-9._%+-]+@itfip\.edu\.co$/

const correoEstudiantilSchema = z.object({
  correo_institucional: z.string().refine(value => emailRegex.test(value), {
    message: 'Debes usar un correo institucional. (@itfip.edu.co)'
  })
})

export const FormForgotPassword = () => {
  const [dataEstudiante, setDataEstudiante] = useState<FieldValues>({})
  const [isLoading, setIsLoading] = useState(false)
  const [successfulCreation, setSuccessfulCreation] = useState(false)

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

  const { isLoaded, signIn } = useSignIn()

  if (!isLoaded) {
    return null
  }

  const onSubmit: SubmitHandler<FieldValues> = async data => {
    setIsLoading(true)

    if (!isLoaded) return

    try {
      const response = await api.post('/estudiantes/verificar/correo', data)
      console.log({ response })

      if (response.status === 200) {
        setDataEstudiante({ numero_documento: response.data.numero_documento })

        await signIn
          ?.create({
            strategy: 'reset_password_email_code',
            identifier: data.correo_institucional
          })
          .then(_ => {
            toast.success('¡Código de verificación enviado exitosamente!')
            setSuccessfulCreation(true)
          })
          .catch(error => {
            const { errors } = error
            let errorsMessagesString = ''

            errors.forEach((errorClerk: any) => {
              if (errorClerk.code === 'form_identifier_not_found') {
                errorsMessagesString += `¡No se pudo encontrar el correo ${data.correo_institucional} en nuestra base de datos!. \n`
              }
            })

            toast.error(errorsMessagesString)
            console.log({ error })
          })
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
    <div>
      {
        !successfulCreation && (
          <form
            className='lg:max-w-xl mx-auto w-11/12 flex flex-col gap-5'
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className='mb-5'>
              <h2 className='flex justify-center items-center flex-wrap text-4xl font-extrabold tracking-tighter gap-2'>
                Recuperar contraseña de
                <span className='relative bg-clip-text [-webkit-background-clip:text] [-webkit-text-fill-color:transparent] animate-color-cycle-5'>LunchFip</span>
              </h2>
            </div>

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
              text='Enviar código de verificación'
              disabled={isLoading}
            />
          </form>
        )
      }
      {
        successfulCreation && <FormResetPassword dataEstudiante={dataEstudiante} />
      }
    </div>
  )
}
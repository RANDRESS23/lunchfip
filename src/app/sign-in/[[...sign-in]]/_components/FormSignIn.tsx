'use client'

import { useState } from 'react'
import { useForm, type FieldValues, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSignIn } from '@clerk/nextjs'
import { Input } from '@/components/Input'
import { IoEyeOff } from 'react-icons/io5'
import { FaEye } from 'react-icons/fa'
import { Button } from '@/components/Button'
import { signInSchema } from '@/app/api/estudiantes/schema'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import useEmailsEmpleados from '@/hooks/useEmailsEmpleados'

export const FormSignIn = () => {
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { isLoaded, signIn, setActive } = useSignIn()
  const { emailsEmpleados } = useEmailsEmpleados()
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
    if (!isLoaded) return null

    setIsLoading(true)

    try {
      const result = await signIn.create({
        identifier: data.correo,
        password: data.clave
      })
      const isEmpleado = emailsEmpleados.includes(data.correo as string)

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId })
        toast.success('¡Inicio de sesión exitosamente!')

        if (isEmpleado) {
          router.push('/profile/employee/home')
        } else {
          router.push('/profile/student/home')
        }
      }
    } catch (error: any) {
      return toast.error('!El correo electrónico o la contraseña son incorrectos!')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className='lg:max-w-xl mx-auto w-11/12 flex flex-col gap-5'>
        <div className='mb-5'>
          <h2 className='flex justify-center items-center flex-wrap text-4xl font-extrabold tracking-tighter gap-2'>
            Iniciar Sesión en
            <span className='relative bg-clip-text [-webkit-background-clip:text] [-webkit-text-fill-color:transparent] animate-color-cycle-5'>LunchFip</span>
          </h2>
        </div>

        <Input
          type="email"
          label="Correo institucional"
          isRequired
          name="correo"
          register={register}
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

        <Button
          type="submit"
          text='Iniciar Sesión'
          disabled={isLoading}
        />
      </form>
    </div>
  )
}

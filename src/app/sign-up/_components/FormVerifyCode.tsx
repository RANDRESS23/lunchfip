import { type KeyboardEvent, useState } from 'react'
import { useForm, type FieldValues, type SubmitHandler } from 'react-hook-form'
import api from '@/libs/api'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/Input'
import { Button } from '@/components/Button'
import { toast } from 'sonner'
import { type Estudiante } from '@/types/estudiantes'
import { useEstudiante } from '@/hooks/useEstudiante'
import { TitleAnimated } from '@/components/TitleAnimated'
import { createClient } from '@/utils/supabase/client'

interface FormVerifyCodeProps {
  dataEstudiante: FieldValues
}

export const FormVerifyCode = ({ dataEstudiante }: FormVerifyCodeProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const [isConfirmResponse, setIsConfirmResponse] = useState(false)
  const { setEstudiante } = useEstudiante()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FieldValues>({
    defaultValues: {
      firstNumber: '',
      secondNumber: '',
      thirdNumber: '',
      fourthNumber: '',
      fifthNumber: '',
      sixthNumber: ''
    }
  })

  const keyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if ((e.target as HTMLInputElement).value.length >= 1 &&
      e.key !== 'Backspace' &&
      e.key !== 'Tab') {
      e.preventDefault()
    }
  }

  const keyUp = (e: KeyboardEvent<HTMLInputElement>, nextInputName?: string, previousInputName?: string) => {
    if ((e.target as HTMLInputElement).value.length > 0 && nextInputName !== undefined) {
      const nextInput: HTMLInputElement | null = document.querySelector(`input[name=${nextInputName}]`)

      if (nextInput !== null) {
        nextInput.focus()
      }
    }

    if (e.key === 'Backspace' && (e.target as HTMLInputElement).value.length === 0 && previousInputName !== undefined) {
      const previousInput: HTMLInputElement | null = document.querySelector(`input[name=${previousInputName}]`)

      if (previousInput !== null) {
        previousInput.focus()
      }
    }
  }

  const onSubmit: SubmitHandler<FieldValues> = async data => {
    setIsLoading(true)

    try {
      const code = `${data.firstNumber}${data.secondNumber}${data.thirdNumber}${data.fourthNumber}${data.fifthNumber}${data.sixthNumber}`

      const supabase = createClient()

      const { error } = await supabase.auth.verifyOtp({
        email: dataEstudiante.correo_institucional,
        token: code,
        type: 'email'
      })

      if (error) {
        console.log({ error })

        return toast.error('¡Ocurrió un error al confirmar tu registro, verifica que el código sea correcto y que no haya vencido!.')
      }

      const { data: { user }, error: error2 } = await supabase.auth.updateUser({
        password: dataEstudiante.clave
      })

      if (error2) {
        console.log({ error2 })

        return toast.error('¡Ocurrió un error al confirmar tu registro, verifica que el código sea correcto y que no haya vencido!.')
      }

      if (user) {
        const response = await api.post('/estudiantes', { ...dataEstudiante, id_estudiante: user.id })

        setEstudiante(response.data.estudiante as Estudiante)
        setIsConfirmResponse(true)

        toast.success('¡Te registraste exitosamente!')
        router.push('/profile/student/home')
        router.refresh()
      }
    } catch (err: any) {
      console.log({ err })
      toast.error('¡Ocurrió un error al confirmar tu registro, verifica que el código sea correcto!.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='lg:max-w-[690px] mx-auto w-11/12 flex flex-col gap-5'>

      <TitleAnimated
        text1='Confirmar registro en'
        text2='Lunchfip'
      />
      <p className='-mt-3 text-center z-10 text-p-light dark:text-p-dark'>
        Para confirmar tu registro escribe el código de verificación que te enviamos a tu correo institucional.
      </p>

      <div className='flex justify-center items-center mb-6 gap-3 lg:w-3/5 lg:mx-auto lg:gap-5'>
        <Input
          type="number"
          isRequired
          name="firstNumber"
          variant="underlined"
          register={register}
          errors={errors}
          className="w-10"
          classNamesInput={['text-3xl text-center']}
          nextInputName="secondNumber"
          keyDown={keyDown}
          keyUp={keyUp}
        />
        <Input
          type="number"
          isRequired
          name="secondNumber"
          variant="underlined"
          register={register}
          errors={errors}
          className="w-10"
          classNamesInput={['text-3xl text-center']}
          previousInputName="firstNumber"
          nextInputName="thirdNumber"
          keyDown={keyDown}
          keyUp={keyUp}
        />
        <Input
          type="number"
          isRequired
          name="thirdNumber"
          variant="underlined"
          register={register}
          errors={errors}
          className="w-10"
          classNamesInput={['text-3xl text-center']}
          previousInputName="secondNumber"
          nextInputName="fourthNumber"
          keyDown={keyDown}
          keyUp={keyUp}
        />
        <Input
          type="number"
          isRequired
          name="fourthNumber"
          variant="underlined"
          register={register}
          errors={errors}
          className="w-10"
          classNamesInput={['text-3xl text-center']}
          previousInputName="thirdNumber"
          nextInputName="fifthNumber"
          keyDown={keyDown}
          keyUp={keyUp}
        />
        <Input
          type="number"
          isRequired
          name="fifthNumber"
          variant="underlined"
          register={register}
          errors={errors}
          className="w-10"
          classNamesInput={['text-3xl text-center']}
          previousInputName="fourthNumber"
          nextInputName="sixthNumber"
          keyDown={keyDown}
          keyUp={keyUp}
        />
        <Input
          type="number"
          isRequired
          name="sixthNumber"
          variant="underlined"
          register={register}
          errors={errors}
          className="w-10"
          classNamesInput={['text-3xl text-center']}
          previousInputName="fifthNumber"
          keyDown={keyDown}
          keyUp={keyUp}
        />
      </div>

      <Button
        type="submit"
        text={isLoading || isConfirmResponse ? 'Cargando...' : 'Confirmar'}
        disabled={isLoading || isConfirmResponse}
      />
    </form>
  )
}

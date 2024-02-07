import { type KeyboardEvent, useState } from 'react'
import { useForm, type FieldValues, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import api from '@/libs/api'
import { useRouter } from 'next/navigation'
import { useSignIn } from '@clerk/nextjs'
import { Input } from '@/components/Input'
import { Button } from '@/components/Button'
import { toast } from 'sonner'
import { IoEyeOff } from 'react-icons/io5'
import { FaEye } from 'react-icons/fa'

const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/

const resetPasswordSchema = z.object({
  clave: z.string().refine(value => passwordRegex.test(value), {
    message: 'La contraseña debe tener al menos 8 caracteres, una letra mayúscula, una letra minúscula, un número y un carácter especial.'
  }),
  clave_2: z.string(),
  firstNumber: z.string(),
  secondNumber: z.string(),
  thirdNumber: z.string(),
  fourthNumber: z.string(),
  fifthNumber: z.string(),
  sixthNumber: z.string()
}).required().refine(data => data.clave === data.clave_2, {
  message: 'Las contraseñas no coinciden.',
  path: ['clave_2']
})

interface FormResetPasswordProps {
  dataEstudiante: FieldValues
}

export const FormResetPassword = ({ dataEstudiante }: FormResetPasswordProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const [isConfirmResponse, setIsConfirmResponse] = useState(false)
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [passwordVisible2, setPasswordVisible2] = useState(false)
  const router = useRouter()
  const { isLoaded, signIn, setActive } = useSignIn()

  if (!isLoaded) {
    return null
  }

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FieldValues>({
    defaultValues: {
      clave: '',
      clave_2: '',
      firstNumber: '',
      secondNumber: '',
      thirdNumber: '',
      fourthNumber: '',
      fifthNumber: '',
      sixthNumber: ''
    },
    resolver: zodResolver(resetPasswordSchema)
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

  const toggleVisibility = () => { setPasswordVisible(!passwordVisible) }
  const toggleVisibility2 = () => { setPasswordVisible2(!passwordVisible2) }

  const onSubmit: SubmitHandler<FieldValues> = async data => {
    setIsLoading(true)

    try {
      const code = `${data.firstNumber}${data.secondNumber}${data.thirdNumber}${data.fourthNumber}${data.fifthNumber}${data.sixthNumber}`

      const completeSignIn = await signIn?.attemptFirstFactor({
        strategy: 'reset_password_email_code',
        code,
        password: data.clave
      })

      if (completeSignIn.status === 'complete') {
        await api.patch('/estudiantes/cambio-clave', { ...dataEstudiante, clave: data.clave, clave_2: data.clave_2 })
        await setActive({ session: completeSignIn.createdSessionId })
        setIsConfirmResponse(true)

        toast.success('¡Cambio de contraseña exitosamente!')
        router.push('/profile/student/home')
      }
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
    <form onSubmit={handleSubmit(onSubmit)} className='lg:max-w-lg mx-auto w-11/12 flex flex-col gap-5'>
      <div className='mb-5'>
        <h2 className='flex justify-center items-center text-center flex-wrap text-4xl font-extrabold tracking-tighter gap-2'>
          Confirmar cambio de contraseña en
          <span className='relative bg-clip-text [-webkit-background-clip:text] [-webkit-text-fill-color:transparent] animate-color-cycle-5'>LunchFip</span>
        </h2>
        <p className='mt-5 text-center'>
          Para confirmar tu cambio de contraseña escribe el código de verificación que te enviamos a tu correo institucional.
        </p>
      </div>
      <div className='flex flex-col justify-center items-center gap-7'>
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
        <div className='flex justify-center items-center gap-5'>
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
      </div>

      <Button
        type="submit"
        text='Confirmar cambio de contraseña'
        disabled={isLoading || isConfirmResponse}
      />
    </form>
  )
}

import { type KeyboardEvent, useState } from 'react'
import { useForm, type FieldValues, type SubmitHandler } from 'react-hook-form'
import { useSignUp } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/Input'
import { Button } from '@/components/Button'
import { toast } from 'sonner'

export const FormVerifyCode = () => {
  const [isLoading, setIsLoading] = useState(false)
  const { isLoaded, signUp, setActive } = useSignUp()
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

  const keyUp = (e: KeyboardEvent<HTMLInputElement>, nextInputName: string) => {
    if ((e.target as HTMLInputElement).value.length > 0) {
      const nextInput: HTMLInputElement | null = document.querySelector(`input[name=${nextInputName}]`)

      if (nextInput !== null) {
        nextInput.focus()
      }
    }
  }

  const onSubmit: SubmitHandler<FieldValues> = async data => {
    setIsLoading(true)

    if (!isLoaded) return

    try {
      const code = `${data.firstNumber}${data.secondNumber}${data.thirdNumber}${data.fourthNumber}${data.fifthNumber}${data.sixthNumber}`
      // verificar esto
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code
      })

      if (completeSignUp.status === 'complete') {
        await setActive({ session: completeSignUp.createdSessionId })
        toast.success('Te registraste exitosamente!')
        router.push('/profile/student/home')
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2))
      toast.error('Ocurrió un error al confirmar tu registro, verifica que el código sea correcto.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='lg:max-w-lg mx-auto w-11/12 flex flex-col gap-5'>
      <div className='mb-5'>
        <h2 className='flex justify-center items-center flex-wrap text-4xl font-extrabold tracking-tighter gap-2'>
          Confirmar registro en
          <span className='relative bg-clip-text [-webkit-background-clip:text] [-webkit-text-fill-color:transparent] animate-color-cycle-5'>LunchFip</span>
        </h2>
        <p className='mt-5 text-center'>
          Para confirmar tu registro escribe el código de verificación que te enviamos a tu correo institucional.
        </p>
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
          keyDown={keyDown}
          keyUp={keyUp}
        />
      </div>

      <Button
        type="submit"
        text='Confirmar'
        disabled={isLoading}
      />
    </form>
  )
}

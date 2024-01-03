'use client'

// import pkg from '@/../package.json'
// import InputShowPsw from '@/components/ChkbxPsw'
// import Input from '@/components/Input'
// import InputSelect from '@/components/InputSelect'
// import { tosty } from '@/libs/tosty'
// import { signIn } from 'next-auth/react'
// import { useRouter } from 'next-nprogress-bar'
// import Link from 'next/link'
import { useState } from 'react'
import { useForm, type FieldValues, type SubmitHandler } from 'react-hook-form'
import useTiposDocumento from '@/hooks/useTiposDocumento'
import useFacultades from '@/hooks/useFacultades'
import useProgramas from '@/hooks/useProgramas'
import useSexos from '@/hooks/useSexos'
import { Input } from '@/components/Input'
import { IoEyeOff } from 'react-icons/io5'
import { MdPhoneIphone } from 'react-icons/md'
import { FaEye, FaUserTag } from 'react-icons/fa'
import { Button } from '@/components/Button'
import { Select } from '@/components/Select'
import { Checkbox } from '@/components/Checkbox'

// import { LiaSignInAltSolid as SignupIcon } from 'react-icons/lia'

export const FormSignUp = () => {
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [passwordVisible2, setPasswordVisible2] = useState(false)
  const [isLoading, setIsLoading] = useState(false) // eslint-disable-line
  const { tiposDocumento, loadingTiposDocumento } = useTiposDocumento()
  const { facultades, loadingFacultades } = useFacultades()
  const { programas, loadingProgramas } = useProgramas()
  const { sexos, loadingSexos } = useSexos()
  // const router = useRouter()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, dirtyFields } // eslint-disable-line
  } = useForm<FieldValues>({
    defaultValues: {
      primer_nombre: '',
      segundo_nombre: '',
      primer_apellido: '',
      segundo_apellido: '',
      id_tipo_documento: '',
      numero_documento: '',
      id_facultad: '',
      id_programa: '',
      correo_institucional: '',
      clave: '',
      clave_2: '',
      id_sexo: '',
      celular: ''
    }
  })

  const toggleVisibility = () => { setPasswordVisible(!passwordVisible) }
  const toggleVisibility2 = () => { setPasswordVisible2(!passwordVisible2) }

  const onSubmit: SubmitHandler<FieldValues> = async data => {
    // setIsLoading(true)

    // try {
    //   const response = await api.post('/user', data)

    //   if (response.status === 201) {
    //     tosty.success('Te registraste exitosamente!')

    //     const response = await signIn('credentials', {
    //       document: data.document,
    //       password: data.password,
    //       redirect: false
    //     })

    //     if (response?.error !== null) {
    //       return tosty.error('Datos incorrectos o usuario deshabilitado.')
    //     }

    //     if (response?.ok) {
    //       router.refresh()
    //       reset()
    //       return router.push('/profile/user')
    //     }
    //   }

    //   tosty.error('Error al registrarse!')
    // } catch (error: any) {
    //   if (error.response.data !== undefined) {
    //     const errorsMessages = Object.values(error.response.data)
    //     let errorsMessagesString = ''

    //     errorsMessages.forEach((message: any) => {
    //       errorsMessagesString += `🔸 ${message} ${'\n'}`
    //     })

    //     return tosty.error(errorsMessagesString, {
    //       options: { className: 'text-center' }
    //     })
    //   }

    //   console.error({ error })
    // } finally {
    //   setIsLoading(false)
    // }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='lg:max-w-xl mx-auto w-11/12 flex flex-col gap-5'>
      <div className='mb-5'>
        <h2 className='flex justify-center items-center flex-wrap text-4xl font-extrabold tracking-tighter gap-2'>
          Registrarse en
          <span className='relative bg-clip-text [-webkit-background-clip:text] [-webkit-text-fill-color:transparent] animate-color-cycle-5'>LunchFip</span>
        </h2>
      </div>
      <Input
        type="text"
        label="Primer nombre"
        isRequired
        name="primer_nombre"
        register={register}
      />
      <Input
        type="text"
        label="Segundo nombre"
        isRequired={false}
        name="segundo_nombre"
        register={register}
      />
      <Input
        type="text"
        label="Primer apellido"
        isRequired
        name="primer_apellido"
        register={register}
      />
      <Input
        type="text"
        label="Segundo apellido"
        isRequired={false}
        name="segundo_apellido"
        register={register}
      />
      <Select
        label="Tipo de documento"
        isRequired
        name="id_tipo_documento"
        disabled={loadingTiposDocumento}
        options={
          tiposDocumento.map(tipoDocumento => ({ label: tipoDocumento.tipo_documento, value: tipoDocumento.id_tipo_documento }))
        }
        register={register}
      />
      <Input
        type="text"
        label="Número de documento"
        isRequired
        name="numero_documento"
        register={register}
        endContent={
          <div className="h-full flex justify-center items-center">
            <FaUserTag className="text-2xl text-default-400 pointer-events-none" />
          </div>
        }
      />
      <Select
        label="Facultad"
        isRequired
        name="id_facultad"
        disabled={loadingFacultades}
        options={
          facultades.map(facultad => ({ label: facultad.facultad, value: facultad.id_facultad }))
        }
        register={register}
      />
      <Select
        label="Programa académico"
        isRequired
        name="id_programa"
        disabled={!(dirtyFields.id_facultad as boolean) || loadingProgramas}
        options={
          programas
            .filter(programa => programa.id_facultad === watch('id_facultad'))
            .map(programa => ({ label: programa.programa, value: programa.id_programa }))
        }
        register={register}
      />
      <Input
        type="text"
        label="Celular"
        isRequired
        name="celular"
        register={register}
        endContent={
          <div className="h-full flex justify-center items-center">
            <MdPhoneIphone className="text-2xl text-default-400 pointer-events-none" />
          </div>
        }
      />
      <Select
        label="Sexo"
        isRequired
        name="id_sexo"
        disabled={loadingSexos}
        options={
          sexos.map(sexo => ({ label: sexo.sexo, value: sexo.id_sexo }))
        }
        register={register}
      />
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
      />
      <Checkbox
        option='Acepto que LunchFip y el ITFIP usen mis datos y me comprometo a cumplir las políticas y condiciones de uso de la aplicación'
        checked={termsAccepted}
        onChange={() => {
          setTermsAccepted(!termsAccepted)
        }}
      />
      <Button
        type="submit"
        text='Registrarse'
        disabled={!termsAccepted || isLoading}
      />
    </form>
  )
}

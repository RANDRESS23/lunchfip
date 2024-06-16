'use client'

import { useState } from 'react'
import { useForm, type FieldValues, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import api from '@/libs/api'
import { useTiposDocumento } from '@/hooks/useTiposDocumento'
import { useFacultades } from '@/hooks/useFacultades'
import { useProgramas } from '@/hooks/useProgramas'
import { useSexos } from '@/hooks/useSexos'
import { FormVerifyCode } from './FormVerifyCode'
import { Input } from '@/components/Input'
import { IoEyeOff } from 'react-icons/io5'
import { MdPhoneIphone } from 'react-icons/md'
import { FaEye } from 'react-icons/fa'
import { HiIdentification } from 'react-icons/hi2'
import { Button } from '@/components/Button'
import { Select } from '@/components/Select'
import { Checkbox } from '@/components/Checkbox'
import { estudianteSchema } from '@/app/api/estudiantes/schema'
import { toast } from 'sonner'
import { TitleAnimated } from '@/components/TitleAnimated'
import { createClient } from '@/utils/supabase/client'

/* ➡ Este componente es el que se renderiza el formulario principal de la pagina "Registrarse" del aplicativo */
export const FormSignUp = () => {
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [passwordVisible2, setPasswordVisible2] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [pendingVerification, setPendingVerification] = useState(false)
  const [dataEstudiante, setDataEstudiante] = useState<FieldValues>({})
  const { tiposDocumento, loadingTiposDocumento } = useTiposDocumento()
  const { facultades, loadingFacultades } = useFacultades()
  const { programas, loadingProgramas } = useProgramas()
  const { sexos, loadingSexos } = useSexos()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, dirtyFields }
  } = useForm<FieldValues>({
    defaultValues: {
      id_estudiante: '',
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
    },
    resolver: zodResolver(estudianteSchema)
  })

  const toggleVisibility = () => { setPasswordVisible(!passwordVisible) }
  const toggleVisibility2 = () => { setPasswordVisible2(!passwordVisible2) }

  const onSubmit: SubmitHandler<FieldValues> = async data => {
    setIsLoading(true)

    try {
      const response = await api.post('/estudiantes/verificar', data)

      if (response.status === 200) {
        setDataEstudiante(data)

        const supabase = createClient()

        const { error } = await supabase.auth.signInWithOtp({
          email: data.correo_institucional,
          phone: data.celular
        })

        if (error) {
          console.log({ error })

          return toast.error('¡Ocurrió un error al confirmar tu registro, verifica que el código sea correcto!.')
        }

        toast.success(`Código de verificación enviado a ${data.correo_institucional} exitosamente!`)
        setPendingVerification(true)
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
        !pendingVerification && (
          <form onSubmit={handleSubmit(onSubmit)} className='lg:max-w-[590px] mx-auto w-11/12 flex flex-col gap-5'>

            <TitleAnimated
              text1='Registrarse en'
              text2='LunchFip'
            />

            <Input
              type="text"
              label="Primer nombre"
              isRequired
              name="primer_nombre"
              register={register}
              disabled={isLoading}
              errors={errors}
            />

            <Input
              type="text"
              label="Segundo nombre"
              isRequired={false}
              name="segundo_nombre"
              register={register}
              disabled={isLoading}
              errors={errors}
            />

            <Input
              type="text"
              label="Primer apellido"
              isRequired
              name="primer_apellido"
              register={register}
              disabled={isLoading}
              errors={errors}
            />

            <Input
              type="text"
              label="Segundo apellido"
              isRequired={false}
              name="segundo_apellido"
              register={register}
              disabled={isLoading}
              errors={errors}
            />

            <Select
              label="Tipo de documento"
              isRequired
              name="id_tipo_documento"
              disabled={loadingTiposDocumento || isLoading}
              options={
                tiposDocumento.map(tipoDocumento => ({ label: tipoDocumento.tipo_documento, value: tipoDocumento.id_tipo_documento }))
              }
              register={register}
              errors={errors}
            />

            <Input
              type="number"
              label="Número de documento"
              isRequired
              name="numero_documento"
              register={register}
              disabled={isLoading}
              endContent={
                <div className="h-full flex justify-center items-center">
                  <HiIdentification className="text-2xl text-default-400 pointer-events-none" />
                </div>
              }
              errors={errors}
            />

            <Select
              label="Facultad"
              isRequired
              name="id_facultad"
              disabled={loadingFacultades || isLoading}
              options={
                facultades.map(facultad => ({ label: facultad.facultad, value: facultad.id_facultad }))
              }
              register={register}
              errors={errors}
            />

            <Select
              label="Programa académico"
              isRequired
              name="id_programa"
              disabled={!(dirtyFields.id_facultad as boolean) || loadingProgramas || isLoading}
              options={
                programas
                  .filter(programa => programa.id_facultad === watch('id_facultad'))
                  .map(programa => ({ label: programa.programa, value: programa.id_programa }))
              }
              register={register}
              errors={errors}
            />

            <Input
              type="text"
              label="Celular"
              isRequired
              name="celular"
              register={register}
              disabled={isLoading}
              endContent={
                <div className="h-full flex justify-center items-center">
                  <MdPhoneIphone className="text-2xl text-default-400 pointer-events-none" />
                </div>
              }
              errors={errors}
            />

            <Select
              label="Sexo"
              isRequired
              name="id_sexo"
              disabled={loadingSexos || isLoading}
              options={
                sexos.map(sexo => ({ label: sexo.sexo, value: sexo.id_sexo }))
              }
              register={register}
              errors={errors}
            />

            <Input
              type="text"
              label="Correo institucional"
              isRequired
              name="correo_institucional"
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

            <Input
              type={passwordVisible2 ? 'text' : 'password'}
              label="Confirmar contraseña"
              isRequired
              name="clave_2"
              register={register}
              disabled={isLoading}
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

            <Checkbox
              option='Acepto que LunchFip y el ITFIP usen mis datos y me comprometo a cumplir las políticas y condiciones de uso de la aplicación'
              checked={termsAccepted}
              onChange={() => {
                setTermsAccepted(!termsAccepted)
              }}
              className='mb-5'
            />

            <Button
              type="submit"
              text={isLoading ? 'Cargando...' : 'Registrarse'}
              disabled={!termsAccepted || isLoading}
            />
          </form>
        )
      }
      {
        pendingVerification && <FormVerifyCode dataEstudiante={dataEstudiante} />
      }
    </div>
  )
}

import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@nextui-org/react'
import Image from 'next/image'
import { cn } from '@/libs/utils'
import { HiIdentification } from 'react-icons/hi2'
import { MdEmail, MdPhoneIphone } from 'react-icons/md'
import { BsCashCoin } from 'react-icons/bs'
import { FaUniversity } from 'react-icons/fa'
import { toast } from 'sonner'
import api from '@/libs/api'
import { useState } from 'react'
import { useEstudiante } from '@/hooks/useEstudiante'
import { useEmpleado } from '@/hooks/useEmpleado'
import Realistic from 'react-canvas-confetti/dist/presets/realistic'
import { useConfetti } from '@/hooks/useConfetti'
import { TitleAnimated } from '@/components/TitleAnimated'
import { ButtonLitUpBorders } from '@/components/Button/ButtonLitUpBoders'
import { Button } from '@/components/Button'
import { MyInput } from '@/components/Input/InputExtend'

interface ModalRechargeProps {
  numeroDocumento: string
  nombreCompleto: string
  tipoDocumento: string
  programa: string
  correoInstitucional: string
  celular: string
  saldo: number
  isOpen: boolean
  onClose: () => void
  reset?: () => void
}

export const ModalRecharge = ({
  numeroDocumento, nombreCompleto, tipoDocumento, programa, correoInstitucional, celular, saldo, isOpen, onClose, reset
}: ModalRechargeProps) => {
  const [loadingRechargeBalance, setRechargeBalance] = useState(false)
  const [newSaldo, setNewSaldo] = useState(0)
  const { empleado } = useEmpleado()
  const { estudiante } = useEstudiante()

  const saldoString = saldo.toString()
  const saldoParsed = saldoString.slice(0, saldoString.length - 3)
  const saldoParsed2 = saldoString.slice(saldoString.length - 3)
  const saldoParsed3 = saldoParsed !== '' ? `$ ${saldoParsed}.${saldoParsed2}` : '$ 0'

  const { onInitHandler, onShoot } = useConfetti()

  const rechargeBalance = async () => {
    try {
      if (newSaldo < 500) {
        toast.error('El monto mínimo de recarga es de $500')
        return
      }

      if (newSaldo > 50000) {
        toast.error('El monto máximo de recarga es de $50.000')
        return
      }

      setRechargeBalance(true)

      const response = await api.post('/almuerzos/recargas', {
        id_empleado: empleado.id_empleado,
        id_estudiante: estudiante.id_estudiante,
        new_saldo: newSaldo
      })

      if (response.status === 201) {
        onShoot()
        toast.success('¡Recarga realizada exitosamente!')

        if (reset !== undefined) reset()
        onClose()
      }
    } catch (error: any) {
      if (error.response.data !== undefined) {
        const { message } = error.response.data

        toast.error(message as string)
      }
    } finally {
      setRechargeBalance(false)
    }
  }

  return (
    <>
      <Modal backdrop='blur' size='3xl' isOpen={isOpen} onClose={onClose} className='border border-black dark:border-white font-inter-sans'>
        <ModalContent>
          {(onClose) => (
            <>
              <div className='relative bg-grid-black dark:bg-grid-white'>
                <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_0.5%,black)]" />
                <ModalHeader className="flex justify-between items-center gap-1">
                  <TitleAnimated
                    text1='Recargar'
                    text2='Saldo'
                    textSize='text-3xl'
                    isTextLeft
                  />
                  <Image
                    src='/svgs/logo-lunchfip-dark.svg'
                    alt='logo lunchfip'
                    width={130}
                    height={130}
                    className='hidden dark:flex w-32 z-10 -mt-5'
                  />
                  <Image
                    src='/svgs/logo-lunchfip-light.svg'
                    alt='logo lunchfip'
                    width={130}
                    height={130}
                    className='flex dark:hidden w-32 z-10 -mt-2'
                  />
                </ModalHeader>
                <ModalBody>
                  <hr className='-mt-7 mb-3 border-black dark:border-white z-10' />
                  <div className='flex gap-5'>
                    <section className='w-2/5 flex justify-center items-center relative overflow-hidden rounded-xl z-10'>
                      <Image
                        src={`https://guia.itfip.edu.co/sgacampus/images/dynamic/foto/1/${numeroDocumento}/${numeroDocumento}.jpg?width=1000&cut=1`}
                        alt='Foto de perfil del estudiante'
                        width={1000}
                        height={1000}
                        className='w-full h-full rounded-xl p-[3px]'
                      />
                      <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#00aaff_0%,#ff3366_50%,#00aaff_100%)] -z-10" />
                    </section>
                    <section className='w-3/5 flex flex-col justify-between z-10'>
                      <div>
                        <div>
                          <p className='text-2xl font-semibold'>
                            {nombreCompleto}
                          </p>
                        </div>
                        <div className='flex items-center gap-2'>
                          <HiIdentification className="text-2xl" />
                          <p className='font-semibold text-lg'>
                            {`${numeroDocumento} ${tipoDocumento === 'Cédula de Ciudadanía' ? 'C.C' : 'T.I'}`}
                          </p>
                        </div>
                        <hr className='mt-2 border-black dark:border-white' />
                      </div>
                      <div className='flex flex-col gap-4'>
                        <div className={cn(
                          'flex gap-2',
                          programa.length > 45 ? '' : 'items-center'
                        )}>
                          <FaUniversity className="text-2xl" />
                          <p className='text-lg'>
                            {programa}
                          </p>
                        </div>
                        <div className={cn(
                          'flex gap-2',
                          correoInstitucional.length > 45 ? '' : 'items-center'
                        )}>
                          <MdEmail className="text-2xl" />
                          <p className='text-lg'>
                            {correoInstitucional}
                          </p>
                        </div>
                        <div className={cn(
                          'flex gap-2',
                          celular.length > 45 ? '' : 'items-center'
                        )}>
                          <MdPhoneIphone className="text-2xl" />
                          <p className='text-lg'>
                            {celular}
                          </p>
                        </div>
                        <div className={cn(
                          'flex gap-2',
                          celular.length > 45 ? '' : 'items-center'
                        )}>
                          <BsCashCoin className="text-2xl" />
                          <p className='text-lg'>
                            {saldo === 0 ? '$ 0' : saldoParsed3}
                          </p>
                        </div>
                      </div>
                    </section>
                  </div>
                  <hr className='mt-3 border-black dark:border-white z-10' />
                </ModalBody>
                <ModalFooter className='flex items-center gap-4'>
                  <div className='w-3/5 flex justify-center z-10'>
                    <MyInput
                      type='number'
                      label='Saldo a recargar'
                      size='lg'
                      isDisabled={false}
                      color='stone'
                      className='border border-black dark:border-white rounded-xl'
                      endContent={
                        <div className="h-full flex justify-center items-center">
                          <BsCashCoin className="text-2xl text-default-400 pointer-events-none" />
                        </div>
                      }
                      onChange={(e) => { setNewSaldo(Number(e.target.value)) }}
                    />
                  </div>
                  <div className='w-2/5 flex flex-col justify-center items-end gap-3'>
                    <ButtonLitUpBorders
                      type="button"
                      text='Cancelar Proceso'
                      disabled={loadingRechargeBalance}
                      onClick={onClose}
                    />
                    <Button
                      type="button"
                      text={loadingRechargeBalance ? 'Cargando...' : 'Recargar Saldo'}
                      disabled={loadingRechargeBalance}
                      onClick={rechargeBalance}
                    />
                  </div>
                </ModalFooter>

              </div>
            </>
          )}
        </ModalContent>
      </Modal>
      <Realistic onInit={onInitHandler} />
    </>
  )
}

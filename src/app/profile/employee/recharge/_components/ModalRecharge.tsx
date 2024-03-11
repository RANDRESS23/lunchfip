import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input as InputUI } from '@nextui-org/react'
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
      <Modal backdrop='blur' size='3xl' isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Recargar Saldo</ModalHeader>
              <ModalBody>
                <div className='flex gap-5'>
                  <section className='w-2/5 flex justify-center items-center'>
                    <Image
                      src={`https://guia.itfip.edu.co/sgacampus/images/dynamic/foto/1/${numeroDocumento}/${numeroDocumento}.jpg?width=1000&cut=1`}
                      alt='Foto de perfil del estudiante'
                      width={1000}
                      height={1000}
                      className='w-full h-full rounded-xl'
                    />
                  </section>
                  <section className='w-3/5 flex flex-col justify-between'>
                    <div>
                      <div>
                        <p className='text-xl font-semibold'>
                          {nombreCompleto}
                        </p>
                      </div>
                      <div className='flex items-center gap-1'>
                        <HiIdentification className="text-2xl" />
                        <p className='font-semibold'>
                          {`${numeroDocumento} ${tipoDocumento === 'Cédula de Ciudadanía' ? 'C.C' : 'T.I'}`}
                        </p>
                      </div>
                    </div>
                    <div className='flex flex-col gap-6'>
                      <div className={cn(
                        'flex gap-1',
                        programa.length > 45 ? '' : 'items-center'
                      )}>
                        <FaUniversity className="text-2xl" />
                        <p className='font-semibold'>
                          {programa}
                        </p>
                      </div>
                      <div className={cn(
                        'flex gap-1',
                        correoInstitucional.length > 45 ? '' : 'items-center'
                      )}>
                        <MdEmail className="text-2xl" />
                        <p className='font-semibold'>
                          {correoInstitucional}
                        </p>
                      </div>
                      <div className={cn(
                        'flex gap-1',
                        'Técnica Profesional en Programación Webqwesss'.length > 45 ? '' : 'items-center'
                      )}>
                        <MdPhoneIphone className="text-2xl" />
                        <p className='font-semibold'>
                          {celular}
                        </p>
                      </div>
                      <div className={cn(
                        'flex gap-1',
                        'Técnica Profesional en Programación Webqwesss'.length > 45 ? '' : 'items-center'
                      )}>
                        <BsCashCoin className="text-2xl" />
                        <p className='font-semibold'>
                          {saldo === 0 ? '$ 0' : saldoParsed3}
                        </p>
                      </div>
                    </div>
                  </section>
                </div>
              </ModalBody>
              <ModalFooter className='flex items-center'>
                <InputUI
                  type='number'
                  label='Saldo a recargar'
                  isDisabled={false}
                  endContent={
                    <div className="h-full flex justify-center items-center">
                      <BsCashCoin className="text-2xl text-default-400 pointer-events-none" />
                    </div>
                  }
                  onChange={(e) => { setNewSaldo(Number(e.target.value)) }}
                />
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button
                  color="primary"
                  isDisabled={loadingRechargeBalance}
                  onPress={rechargeBalance}
                >
                  Recargar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <Realistic onInit={onInitHandler} />
    </>
  )
}

import { Modal, ModalContent, ModalHeader, ModalBody } from '@nextui-org/react'
import Image from 'next/image'
import Realistic from 'react-canvas-confetti/dist/presets/realistic'
import { useConfetti } from '@/hooks/useConfetti'
import { TitleAnimated } from '@/components/TitleAnimated'
import { FormEditEmployee } from './FormEditEmployee'

interface ModalRegisterEmployeeProps {
  isOpen: boolean
  onClose: () => void
  supabaseUrl: string
  serviceRolKey: string
}

export const ModalEditEmployee = ({
  isOpen, onClose, supabaseUrl, serviceRolKey
}: ModalRegisterEmployeeProps) => {
  const { onInitHandler, onShoot } = useConfetti()

  return (
    <>
      <Modal placement='top' backdrop='blur' size='xl' isOpen={isOpen} onClose={onClose} className='border border-black dark:border-white font-inter-sans'>
        <ModalContent>
          {(onClose) => (
            <>
              <div className='relative bg-grid-black dark:bg-grid-white'>
                <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_0.5%,black)]" />
                <ModalHeader className="flex justify-between items-center gap-1">
                  <TitleAnimated
                    text1='Editar'
                    text2='Empleado'
                    textSize='text-[27px]'
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
                <ModalBody className='mb-3'>
                  <hr className='-mt-6 mb-3 border-black dark:border-white z-10' />
                  <FormEditEmployee
                    onClose={onClose}
                    onShoot={onShoot}
                    supabaseUrl={supabaseUrl}
                    serviceRolKey={serviceRolKey}
                  />
                </ModalBody>
              </div>
            </>
          )}
        </ModalContent>
      </Modal>
      <Realistic onInit={onInitHandler} />
    </>
  )
}

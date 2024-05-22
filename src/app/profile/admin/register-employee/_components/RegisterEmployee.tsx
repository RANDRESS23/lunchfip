'use client'

import { Button, useDisclosure } from '@nextui-org/react'
import { UserIcon } from '../icons/UserIcon'
import { ModalRegisterEmployee } from './ModalRegisterEmployee'
import { PlusIcon } from '../icons/PlusIcon'

interface RegisterEmployeeProps {
  supabaseUrl: string
  serviceRolKey: string
}

export const RegisterEmployee = ({ supabaseUrl, serviceRolKey }: RegisterEmployeeProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <div className='w-full flex justify-start mb-3 font-inter-sans'>
      <Button
        color="success"
        variant="bordered"
        startContent={
          <div className='flex justify-center items-center'>
            <UserIcon/>
            <PlusIcon className='-ml-2' />
          </div>
        }
        onClick={onOpen}
      >
        Registrar Nuevo Empleado
      </Button>
      <ModalRegisterEmployee
        isOpen={isOpen}
        onClose={onClose}
        supabaseUrl={supabaseUrl}
        serviceRolKey={serviceRolKey}
      />
    </div>
  )
}

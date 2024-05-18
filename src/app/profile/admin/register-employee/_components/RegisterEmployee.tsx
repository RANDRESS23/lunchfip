'use client'

import { Button, useDisclosure } from '@nextui-org/react'
import { UserIcon } from '../icons/UserIcon'
import { ModalRegisterEmployee } from './ModalRegisterEmployee'

interface RegisterEmployeeProps {
  supabaseUrl: string
  serviceRolKey: string
}

export const RegisterEmployee = ({ supabaseUrl, serviceRolKey }: RegisterEmployeeProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <div className='w-full flex justify-start mb-5'>
      <Button color="success" variant="bordered" startContent={<UserIcon/>} onClick={onOpen}>
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

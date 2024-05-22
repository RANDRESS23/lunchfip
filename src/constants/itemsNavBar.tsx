'use client'

import { FaMoneyBill1Wave, FaUserPlus } from 'react-icons/fa6'
import { PiNotePencilFill } from 'react-icons/pi'
import { IoFastFoodSharp } from 'react-icons/io5'
import { GiBowlOfRice } from 'react-icons/gi'
import { FaUserGraduate } from 'react-icons/fa'
import { BiSolidFoodMenu } from 'react-icons/bi'

import { cn } from '@/libs/utils'

export const menuItems = [
  {
    title: 'Inicio',
    href: '/'
  },
  {
    title: 'Contacto',
    href: '/contact'
  },
  {
    title: 'Nosotros',
    href: '/about'
  }
]

export const menuItemsStudent = [
  {
    title: 'Inicio',
    href: '/profile/student/home'
  },
  {
    title: 'Reservas',
    href: '/profile/student/reservation'
  },
  {
    title: 'Perfil',
    href: '/profile/student/info'
  }
]

export const menuItemsEmployee = [
  {
    title: 'Reservar Almuerzo',
    href: '/profile/employee/reserve',
    icon: (pathname: string) => (
      <PiNotePencilFill
        className={cn(
          'text-2xl',
          pathname === '/profile/employee/reserve' ? 'text-black dark:text-white' : 'text-nav-link-light dark:text-nav-link-dark'
        )}
      />
    )
  },
  {
    title: 'Entregar Almuerzo',
    href: '/profile/employee/deliver',
    icon: (pathname: string) => (
      <GiBowlOfRice
        className={cn(
          'text-2xl',
          pathname === '/profile/employee/deliver' ? 'text-black dark:text-white' : 'text-nav-link-light dark:text-nav-link-dark'
        )}
      />
    )
  },
  {
    title: 'Recargar Saldo',
    href: '/profile/employee/recharge',
    icon: (pathname: string) => (
      <FaMoneyBill1Wave
        className={cn(
          'text-2xl',
          pathname === '/profile/employee/recharge' ? 'text-black dark:text-white' : 'text-nav-link-light dark:text-nav-link-dark'
        )}
      />
    )
  }
]

export const menuItemsAdmin = [
  {
    title: 'Registrar Empleados',
    href: '/profile/admin/register-employee',
    icon: (pathname: string) => (
      <FaUserPlus
        className={cn(
          'text-2xl',
          pathname === '/profile/admin/register-employee' ? 'text-black dark:text-white' : 'text-nav-link-light dark:text-nav-link-dark'
        )}
      />
    )
  },
  {
    title: 'Definir Almuerzos',
    href: '/profile/admin/lunch',
    icon: (pathname: string) => (
      <IoFastFoodSharp
        className={cn(
          'text-2xl',
          pathname === '/profile/admin/lunch' ? 'text-black dark:text-white' : 'text-nav-link-light dark:text-nav-link-dark'
        )}
      />
    )
  },
  {
    title: 'Estudiantes Registrados',
    href: '/profile/admin/list-students',
    icon: (pathname: string) => (
      <FaUserGraduate
        className={cn(
          'text-2xl',
          pathname === '/profile/admin/list-students' ? 'text-black dark:text-white' : 'text-nav-link-light dark:text-nav-link-dark'
        )}
      />
    )
  },
  {
    title: 'Reporte Almuerzos',
    href: '/profile/admin/report-lunches',
    icon: (pathname: string) => (
      <BiSolidFoodMenu
        className={cn(
          'text-2xl',
          pathname === '/profile/admin/report-lunches' ? 'text-black dark:text-white' : 'text-nav-link-light dark:text-nav-link-dark'
        )}
      />
    )
  }
]

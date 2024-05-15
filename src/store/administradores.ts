import { ADMINISTRADOR_INITIAL_VALUES } from '@/initial-values/administrador'
import { type Administrador } from '@/types/administradores'
import { create } from 'zustand'

interface AdministradorStore {
  administrador: Administrador
  setAdministrador: (administrador: Administrador) => void
}

export const useAdministradorStore = create<AdministradorStore>((set) => ({
  administrador: ADMINISTRADOR_INITIAL_VALUES,
  setAdministrador: (administrador: Administrador) => { set({ administrador }) }
}))

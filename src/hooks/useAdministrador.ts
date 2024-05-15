import { useEffect } from 'react'
import { useLocalStorage, useReadLocalStorage } from 'usehooks-ts'
import { type Administrador } from '@/types/administradores'
import { ADMINISTRADOR_INITIAL_VALUES } from '@/initial-values/administrador'
import { useAdministradorStore } from '@/store/administradores'

export const useAdministrador = () => {
  const administrador = useAdministradorStore(state => state.administrador)
  const setAdministrador = useAdministradorStore(state => state.setAdministrador)
  const administradorStorage: Administrador | null = useReadLocalStorage('administrador')
  const [administradorStorageInitial, setAdministradorStorage] = useLocalStorage<Administrador>('administrador', () => ADMINISTRADOR_INITIAL_VALUES)

  const setAdministradorStorageMemo = (administrador: Administrador) => {
    setAdministradorStorage(administrador)
    setAdministrador(administrador)
  }

  useEffect(() => {
    if (administradorStorage === null) setAdministradorStorage(administradorStorageInitial)
    else if (administradorStorage.correo !== '') setAdministrador(administradorStorage)
  }, [])

  return { administrador, setAdministrador: setAdministradorStorageMemo }
}

import api from '@/libs/api'
import { type Administrador } from '@/types/administradores'

/* ➡ Función para obtener los emails de todos los administradores */
export const getAdminEmails = async () => {
  let adminEmails: string[] = []

  try {
    const { data } = await api.get('/administradores')
    const emails: string[] = data.map((admin: Administrador) => admin.correo)

    adminEmails = emails
  } catch (error) {
    console.log(error)
  }

  return adminEmails
}

import api from '@/libs/api'

/* ➡ Función para obtener los emails de todos los administradores */
export const getAdminEmails = async () => {
  let adminEmails: string[] = []

  try {
    const { data: { emailsAdministradores } } = await api.get('/administradores')

    adminEmails = emailsAdministradores
  } catch (error) {
    console.log(error)
  }

  return adminEmails
}

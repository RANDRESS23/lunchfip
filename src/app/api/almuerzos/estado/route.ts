import { db } from '@/libs/prismaDB'
import { validateAccessAPI } from '@/libs/validateAccessAPI'
import { NextResponse } from 'next/server'

export async function POST (request: Request) {
  try {
    const body = await request.json()

    const isValidateAccessAPI = await validateAccessAPI()

    if (isValidateAccessAPI) {
      return NextResponse.json(
        { message: '¡No tienes permisos para acceder a esta información!' },
        { status: 401 }
      )
    }

    const { id_almuerzo: idAlmuerzo } = body

    const dateAux = new Date()
    dateAux.setUTCHours(dateAux.getUTCHours() - 5)
    const currentDate = new Date(dateAux.toString())

    const almuerzos = await db.almuerzos.findFirst({
      where: { id_almuerzo: idAlmuerzo },
      select: { id_almuerzo: true }
    })

    if (almuerzos === null) {
      return NextResponse.json({ message: '¡No se encontró el servicio de almuerzos para poder finalizarlo!' }, { status: 404 })
    }

    const estadoInactivo = await db.estados.findFirst({
      where: { estado: 'Inactivo' },
      select: { id_estado: true }
    })

    if (estadoInactivo === null) {
      return NextResponse.json({ message: '¡No se encontró el estado Inactivo para poder finalizar el servicio de almuerzos!' }, { status: 404 })
    }

    const estadoAlmuerzos = await db.estados_Almuerzos.updateMany({
      data: {
        id_estado: estadoInactivo.id_estado,
        updatedAt: currentDate
      },
      where: { id_almuerzo: idAlmuerzo }
    })

    return NextResponse.json(
      { message: '¡Servicio de almuerzos finalizado exitosamente!', estadoAlmuerzos },
      { status: 201 }
    )
  } catch (error: any) {
    console.error({ error })

    if (error?.errors !== null) {
      const errorsMessages: Record<string, string> = {}
      const { errors } = error

      errors.forEach(
        ({ message, path }: { message: string, path: string[] }) => {
          if (!Object.values(errorsMessages).includes(message)) {
            errorsMessages[path.join('')] = message
          }
        }
      )

      return NextResponse.json(errorsMessages, { status: 500 })
    }

    return NextResponse.json(
      { message: 'Something went wrong.', error },
      { status: 500 }
    )
  }
}

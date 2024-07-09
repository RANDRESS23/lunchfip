import { db } from '@/libs/prismaDB'
import { format } from '@formkit/tempo'
import { NextResponse } from 'next/server'

export async function GET () {
  try {
    const almuerzosFecha = await db.almuerzos_Fecha.findMany()

    if (almuerzosFecha.length === 0) {
      return NextResponse.json({ message: '¡No hay fechas registradas para habilitar el servicio de almuerzos!' }, { status: 404 })
    }

    const almuerzos = await db.almuerzos.findFirst({
      where: { id_almuerzos_fecha: almuerzosFecha[almuerzosFecha.length - 1].id_almuerzos_fecha }
    })

    const estadoActivo = await db.estados.findFirst({
      where: { estado: 'Activo' }
    })

    const estadoAlmuerzos = await db.estados_Almuerzos.findFirst({
      where: { id_almuerzo: almuerzos?.id_almuerzo ?? '' }
    })

    const fechaAlmuerzosAux = new Date(almuerzosFecha[almuerzosFecha.length - 1].fecha?.toString() ?? '')

    if (process.env.NODE_ENV === 'development') {
      fechaAlmuerzosAux.setUTCHours(fechaAlmuerzosAux.getUTCHours() + 5)
    }

    const fechaAlmuerzosAux2 = new Date(fechaAlmuerzosAux.toString())
    const fechaAlmuerzo = format(fechaAlmuerzosAux2, 'DD/MM/YYYY')
    console.log({ almuerzos, estadoAlmuerzos, estadoActivo })
    if ((estadoAlmuerzos?.id_estado !== estadoActivo?.id_estado) && estadoAlmuerzos !== null && almuerzos !== null) {
      return NextResponse.json({ message: `¡Ya hubo servicio de almuerzos habilitados para la fecha ${fechaAlmuerzo}.!` }, { status: 404 })
    }

    return NextResponse.json({
      almuerzosFecha: almuerzosFecha[almuerzosFecha.length - 1]
    })
  } catch (error) {
    console.error({ error })

    return NextResponse.json(
      { message: 'Something went wrong.', error },
      { status: 500 }
    )
  }
}

export async function POST (request: Request) {
  try {
    const body = await request.json()
    const { newFecha } = body

    const fecha = new Date(newFecha as string)

    const dateAux = new Date()
    dateAux.setUTCHours(dateAux.getUTCHours() - 5)
    const currentDate = new Date(dateAux.toString())

    const almuerzosFecha = await db.almuerzos_Fecha.findMany()
    const existingLunchesDate = await db.almuerzos_Fecha.findUnique({
      where: { fecha }
    })

    if (fecha < almuerzosFecha[almuerzosFecha.length - 1]?.fecha) {
      return NextResponse.json(
        { messsage: '¡No puedes seleccionar una fecha menor a la ultima fecha de servicio!' },
        { status: 400 }
      )
    }

    if (existingLunchesDate !== null) {
      return NextResponse.json(
        { messsage: '¡Ya hubo servicio de almuerzos para la fecha seleccionada!' },
        { status: 400 }
      )
    }

    const newAlmuerzosFecha = await db.almuerzos_Fecha.create({
      data: {
        fecha,
        createdAt: currentDate,
        updatedAt: currentDate
      }
    })

    return NextResponse.json(
      {
        almuerzosFecha: newAlmuerzosFecha,
        message: '¡Fecha registrada exitosamente para habilitar el servicio de almuerzos!'
      },
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

export async function PATCH (request: Request) {
  try {
    const body = await request.json()
    const { id_almuerzos_fecha: idAlmuerzosFecha, newFecha } = body

    const fecha = new Date(newFecha as string)

    const dateAux = new Date()
    dateAux.setUTCHours(dateAux.getUTCHours() - 5)
    const currentDate = new Date(dateAux.toString())

    const almuerzosFecha = await db.almuerzos_Fecha.findUnique({
      where: { id_almuerzos_fecha: idAlmuerzosFecha }
    })

    if (almuerzosFecha === null) {
      return NextResponse.json(
        { message: '¡No se encontró el registro de la fecha seleccionada para el servicio de los almuerzos!' },
        { status: 400 }
      )
    }

    const almuerzos = await db.almuerzos.findFirst({
      where: { id_almuerzos_fecha: idAlmuerzosFecha }
    })

    if (almuerzos !== null) {
      return NextResponse.json(
        { message: '¡No se puede actualizar la fecha para el día del servicio de almuerzos, ya que el administrador definió la cantidad de almuerzos para la fecha actual!' },
        { status: 400 }
      )
    }

    const almuerzosFechaUpdated = await db.almuerzos_Fecha.update({
      data: { fecha, updatedAt: currentDate },
      where: { id_almuerzos_fecha: idAlmuerzosFecha }
    })

    if (almuerzosFechaUpdated === null) {
      return NextResponse.json({
        message: '¡No se pudo actualizar la fecha para el día del servicio de almuerzos!'
      })
    }

    return NextResponse.json(
      {
        almuerzosFecha: almuerzosFechaUpdated,
        message: '¡Fecha actualizada exitosamente para habilitar el servicio de almuerzos!'
      },
      { status: 201 }
    )
  } catch (error) {
    console.error({ error })

    return NextResponse.json(
      { message: 'Something went wrong.', error },
      { status: 500 }
    )
  }
}

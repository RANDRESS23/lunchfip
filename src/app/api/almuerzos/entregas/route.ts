import { db } from '@/libs/prismaDB'
import { NextResponse } from 'next/server'
import { entregasSchema } from './schema'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

export async function GET () {
  try {
    const entregas = await db.entregas.findMany()

    return NextResponse.json(entregas)
  } catch (error) {
    console.error({ error })

    return NextResponse.json(
      { message: 'Something went wrong.', error },
      { status: 500 }
    )
  }
}

export async function POST (request: Request) {
  const body = await request.json()

  try {
    const {
      id_empleado: idEmpleado,
      id_estudiante: idEstudiante,
      id_almuerzo: idAlmuerzo
    } = entregasSchema.parse(body)

    const estudianteReserva = await db.estudiantes_Reservas.findFirst({
      where: { id_estudiante: idEstudiante }
    })

    if (estudianteReserva === null) {
      return NextResponse.json(
        { message: '¡No existe reserva disponible para el código QR escaneado!' },
        { status: 400 }
      )
    }

    const dateAux = new Date()
    dateAux.setUTCHours(dateAux.getUTCHours() - 5)
    const currentDate = new Date(dateAux.toString())

    const newEntrega = await db.entregas.create({
      data: {
        id_empleado: idEmpleado,
        id_almuerzo: idAlmuerzo,
        fecha: currentDate,
        createdAt: currentDate,
        updatedAt: currentDate
      }
    })

    const estados = await db.estados.findMany()

    await db.estados_Reservas.updateMany({
      data: {
        id_estado: estados[1].id_estado,
        updatedAt: currentDate
      },
      where: { id_reserva: estudianteReserva.id_reserva }
    })

    await db.estudiantes_Entregas.create({
      data: {
        id_entrega: newEntrega.id_entrega,
        id_estudiante_reserva: estudianteReserva.id_estudiante_reserva,
        createdAt: currentDate,
        updatedAt: currentDate
      }
    })

    const codigoQRReserva = await db.codigos_QR_Reservas.findFirst({
      where: { id_reserva: estudianteReserva.id_reserva }
    })

    if (codigoQRReserva === null) {
      return NextResponse.json(
        { message: '¡No existe código QR disponible para la reserva!' },
        { status: 400 }
      )
    }

    const CLOUDINARY_URL = codigoQRReserva.url_codigo_qr
    const urlArr = CLOUDINARY_URL.split('/')
    const nameCodigoQR = urlArr[urlArr.length - 1]
    const [idCodigoQR] = nameCodigoQR.split('.')

    await cloudinary.uploader.destroy(idCodigoQR)

    const updatedAlmuerzosEntregados = await db.almuerzos_Entregados.update({
      data: {
        cantidad: { increment: 1 },
        updatedAt: currentDate
      },
      where: { id_almuerzo: idAlmuerzo }
    })

    return NextResponse.json(
      {
        almuerzosEntregados: updatedAlmuerzosEntregados,
        message: 'Entrega realizada exitosamente!'
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

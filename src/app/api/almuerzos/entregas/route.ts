import { db } from '@/libs/prismaDB'
import { NextResponse } from 'next/server'
import { entregasSchema } from './schema'
import { v2 as cloudinary } from 'cloudinary'
import { validateAccessAPI } from '@/libs/validateAccessAPI'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

export async function GET () {
  try {
    const isValidateAccessAPI = await validateAccessAPI()

    if (isValidateAccessAPI) {
      return NextResponse.json(
        { message: '¡No tienes permisos para acceder a esta información!' },
        { status: 401 }
      )
    }

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
  try {
    const body = await request.json()

    const isValidateAccessAPI = await validateAccessAPI()

    if (isValidateAccessAPI) {
      return NextResponse.json(
        { message: '¡No tienes permisos para acceder a esta información!' },
        { status: 401 }
      )
    }

    const {
      id_empleado: idEmpleado,
      id_estudiante: idEstudiante,
      id_almuerzo: idAlmuerzo
    } = entregasSchema.parse(body)

    const estadoInactivo = await db.estados.findFirst({
      where: { estado: 'Inactivo' },
      select: { id_estado: true }
    })

    const estadoAlmuerzos = await db.estados_Almuerzos.findFirst({
      where: { id_almuerzo: idAlmuerzo },
      select: { id_estado: true }
    })

    if (estadoAlmuerzos?.id_estado === estadoInactivo?.id_estado) {
      return NextResponse.json(
        { message: '¡Ya finalizó el servicio de almuerzos!.' },
        { status: 404 }
      )
    }

    const reservas = await db.reservas.findMany({
      where: { id_almuerzo: idAlmuerzo },
      select: { id_reserva: true }
    })

    if (reservas.length === 0) {
      return NextResponse.json(
        { message: '¡No existen reservas disponibles para el día indicado!' },
        { status: 400 }
      )
    }

    const estudianteReserva = await db.estudiantes_Reservas.findFirst({
      where: { id_estudiante: idEstudiante, id_reserva: { in: reservas.map((reserva) => reserva.id_reserva) } },
      select: { id_reserva: true, id_estudiante_reserva: true }
    })

    if (estudianteReserva === null) {
      return NextResponse.json(
        { message: '¡No existe reserva disponible para el estudiante!' },
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
      },
      select: { id_entrega: true }
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
      where: { id_reserva: estudianteReserva.id_reserva },
      select: { url_codigo_qr: true }
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

    await cloudinary.uploader.destroy(`codigos_qr_reservas/${idCodigoQR}`)

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

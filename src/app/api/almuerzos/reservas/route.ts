import { db } from '@/libs/prismaDB'
import { NextResponse } from 'next/server'
import { reservasSchema } from './schema'
import { type UploadApiResponse, v2 as cloudinary } from 'cloudinary'
import QRCode from 'qrcode'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

export async function GET () {
  try {
    const reservas = await db.reservas.findMany()

    return NextResponse.json(reservas)
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
    } = reservasSchema.parse(body)

    if (idAlmuerzo === '') {
      return NextResponse.json(
        { message: '¡El administrador no ha definido la cantidad total de almuerzos para reservar, intente más tarde!.' },
        { status: 404 }
      )
    }

    const almuerzosTotalesDia = await db.almuerzos.findUnique({
      where: { id_almuerzo: idAlmuerzo },
      select: { total_almuerzos: true }
    })

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

    const almuerzosReservadosTotales = await db.almuerzos_Reservados.findUnique({
      where: { id_almuerzo: idAlmuerzo },
      select: { cantidad: true }
    })

    if (almuerzosReservadosTotales?.cantidad === almuerzosTotalesDia?.total_almuerzos) {
      return NextResponse.json(
        { message: '¡Ya no hay almuerzos disponibles para reservar!.' },
        { status: 404 }
      )
    }

    const dateAux = new Date()
    dateAux.setUTCHours(dateAux.getUTCHours() - 5)
    const currentDate = new Date(dateAux.toString())

    const newReserva = await db.reservas.create({
      data: {
        id_almuerzo: idAlmuerzo,
        fecha: currentDate,
        createdAt: currentDate,
        updatedAt: currentDate
      },
      select: { id_reserva: true }
    })

    if (idEmpleado) {
      await db.reservas_Empleados.create({
        data: {
          id_reserva: newReserva.id_reserva,
          id_empleado: idEmpleado,
          createdAt: currentDate,
          updatedAt: currentDate
        }
      })
    } else {
      await db.reservas_Virtuales.create({
        data: {
          id_reserva: newReserva.id_reserva,
          createdAt: currentDate,
          updatedAt: currentDate
        }
      })

      await db.estudiantes.update({
        data: {
          saldo: { decrement: 1500 },
          updatedAt: currentDate
        },
        where: { id_estudiante: idEstudiante }
      })
    }

    const estados = await db.estados.findMany()

    await db.estados_Reservas.create({
      data: {
        id_reserva: newReserva.id_reserva,
        id_estado: estados[0].id_estado,
        createdAt: currentDate,
        updatedAt: currentDate
      }
    })

    const newEstudianteReserva = await db.estudiantes_Reservas.create({
      data: {
        id_reserva: newReserva.id_reserva,
        id_estudiante: idEstudiante,
        createdAt: currentDate,
        updatedAt: currentDate
      },
      select: { id_estudiante_reserva: true }
    })

    const qrBase64Str = await QRCode.toDataURL(newEstudianteReserva.id_estudiante_reserva, { version: 10 })
    const qrStr = qrBase64Str.split(',')[1]
    const buffer = Buffer.from(qrStr, 'base64')

    const responseCloudinary: UploadApiResponse = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream({ folder: 'codigos_qr_reservas' }, (error, result) => {
        if (error !== undefined) reject(error)

        if (result !== undefined) resolve(result)
      }).end(buffer)
    })

    await db.codigos_QR_Reservas.create({
      data: {
        id_reserva: newReserva.id_reserva,
        url_codigo_qr: responseCloudinary.secure_url,
        createdAt: currentDate,
        updatedAt: currentDate
      }
    })

    const updatedAlmuerzosReservados = await db.almuerzos_Reservados.update({
      data: {
        cantidad: { increment: 1 },
        updatedAt: currentDate
      },
      where: { id_almuerzo: idAlmuerzo }
    })

    return NextResponse.json(
      {
        almuerzosReservados: updatedAlmuerzosReservados,
        message: '¡Reserva realizada exitosamente!'
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

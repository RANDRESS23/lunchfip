import { NextResponse } from 'next/server'
import { db } from '@/libs/prismaDB'

export async function GET (_: Request, { params }: { params: { idEstudiante: string } }) {
  try {
    const { idEstudiante } = params

    const estudiante = await db.estudiantes.findUnique({
      where: { id_estudiante: idEstudiante }
    })

    if (estudiante === null) {
      return NextResponse.json(
        { message: '¡El ID del estudiante ingresado no está registrado!' },
        { status: 404 }
      )
    }

    const estudianteReservas = await db.estudiantes_Reservas.findMany({
      where: { id_estudiante: idEstudiante }
    })

    const estudianteEntregas = await db.estudiantes_Entregas.findMany({
      where: { id_estudiante_reserva: estudianteReservas[0]?.id_estudiante_reserva }
    })

    const estudianteRecargas = await db.estudiantes_Recargas.findMany({
      where: { id_estudiante: idEstudiante }
    })

    const reserva = await db.reservas.findUnique({
      where: { id_reserva: estudianteReservas[estudianteReservas.length - 1]?.id_reserva }
    })

    const entrega = await db.entregas.findUnique({
      where: { id_entrega: estudianteEntregas[estudianteEntregas.length - 1]?.id_entrega }
    })

    const recarga = await db.recargas.findUnique({
      where: { id_recarga: estudianteRecargas[estudianteRecargas.length - 1]?.id_recarga }
    })

    const fechaReservaAux = new Date(reserva?.fecha?.toString() ?? '')
    fechaReservaAux.setUTCHours(fechaReservaAux.getUTCHours() + 5)

    const yearReserva = fechaReservaAux.getFullYear()
    const monthReserva = fechaReservaAux.getMonth() + 1
    const dayReserva = fechaReservaAux.getDate()
    const fechaReserva = `${yearReserva < 10 ? '0' : ''}${dayReserva}/${monthReserva < 10 ? '0' : ''}${monthReserva}/${yearReserva}`

    const fechaEntregaAux = new Date(entrega?.fecha?.toString() ?? '')
    fechaEntregaAux.setUTCHours(fechaEntregaAux.getUTCHours() + 5)

    const yearEntrega = fechaEntregaAux?.getFullYear()
    const monthEntrega = fechaEntregaAux?.getMonth() + 1
    const dayEntrega = fechaEntregaAux?.getDate()

    const fechaEntrega = `${yearEntrega < 10 ? '0' : ''}${dayEntrega}/${monthEntrega < 10 ? '0' : ''}${monthEntrega}/${yearEntrega}`

    const fechaRecargaAux = new Date(recarga?.fecha?.toString() ?? '')
    fechaRecargaAux.setUTCHours(fechaRecargaAux.getUTCHours() + 5)

    const yearRecarga = fechaRecargaAux?.getFullYear()
    const monthRecarga = fechaRecargaAux?.getMonth() + 1
    const dayRecarga = fechaRecargaAux?.getDate()

    const fechaRecarga = `${yearRecarga < 10 ? '0' : ''}${dayRecarga}/${monthRecarga < 10 ? '0' : ''}${monthRecarga}/${yearRecarga}`

    return NextResponse.json(
      {
        cantidadReservas: estudianteReservas.length,
        cantidadReclamados: estudianteEntregas.length,
        cantidadSinReclamar: estudianteReservas.length - estudianteEntregas.length,
        cantidadRecargas: estudianteRecargas.length,
        fechaUltimaReserva: fechaReserva ?? 'N/A',
        fechaUltimoReclamo: fechaEntrega ?? 'N/A',
        fechaUltimaRecarga: fechaRecarga ?? 'N/A',
        message: '¡Estadísticas obtenidas exitosamente!'
      },
      { status: 200 }
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

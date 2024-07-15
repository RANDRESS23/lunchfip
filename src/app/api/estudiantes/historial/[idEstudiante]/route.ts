import { db } from '@/libs/prismaDB'
import { format } from '@formkit/tempo'
import { NextResponse } from 'next/server'

export async function GET (request: Request, { params }: { params: { idEstudiante: string } }) {
  try {
    const searchParams = new URL(request.url).searchParams
    const page = searchParams.get('page')
    const rows = searchParams.get('rows')
    const { idEstudiante } = params

    if (page === null) {
      return NextResponse.json(
        { messsage: '¡El parámetro "page" es requerido!' },
        { status: 400 }
      )
    }

    if (rows === null) {
      return NextResponse.json(
        { messsage: '¡El parámetro "rows" es requerido!' },
        { status: 400 }
      )
    }

    const estudiante = await db.estudiantes.findUnique({
      where: { id_estudiante: idEstudiante },
      select: { id_estudiante: true }
    })

    if (estudiante === null) {
      return NextResponse.json(
        { messsage: '¡No se pudo encontrar al estudiante!' },
        { status: 400 }
      )
    }

    const estudianteReservas = await db.estudiantes_Reservas.findMany({
      where: { id_estudiante: idEstudiante }
    })
    const estudianteRecargas = await db.estudiantes_Recargas.findMany({
      where: { id_estudiante: idEstudiante }
    })

    const estudianteReservasSliced = estudianteReservas.slice(Number(rows) * (Number(page) - 1), Number(rows) * Number(page))
    const estudianteRecargasSliced = estudianteRecargas.slice(Number(rows) * (Number(page) - 1), Number(rows) * Number(page))

    const estudianteHistorialReservas = await Promise.all(estudianteReservasSliced.map(async (reservaEstudiante) => {
      const reservaPromise = await db.reservas.findUnique({
        where: { id_reserva: reservaEstudiante?.id_reserva },
        select: { fecha: true }
      })

      const reservaEmpleadoPromise = await db.reservas_Empleados.findFirst({
        where: { id_reserva: reservaEstudiante.id_reserva },
        select: { id_reserva: true }
      })

      const reservaVirtualPromise = await db.reservas_Virtuales.findFirst({
        where: { id_reserva: reservaEstudiante.id_reserva },
        select: { id_reserva: true }
      })

      const estadoReservaPromise = await db.estados_Reservas.findFirst({
        where: { id_reserva: reservaEstudiante?.id_reserva },
        select: { id_estado: true }
      })

      const estudianteEntregaPromise = await db.estudiantes_Entregas.findFirst({
        where: { id_estudiante_reserva: reservaEstudiante?.id_estudiante_reserva },
        select: { id_entrega: true }
      })

      const [
        reserva,
        reservaEmpleado,
        reservaVirtual,
        estadoReserva,
        estudianteEntrega
      ] = await Promise.all([
        reservaPromise,
        reservaEmpleadoPromise,
        reservaVirtualPromise,
        estadoReservaPromise,
        estudianteEntregaPromise
      ])

      const estadoPromise = await db.estados.findUnique({
        where: { id_estado: estadoReserva?.id_estado },
        select: { estado: true }
      })

      const entregaPromise = await db.entregas.findUnique({
        where: { id_entrega: estudianteEntrega?.id_entrega ?? '' },
        select: { fecha: true }
      })

      const [
        estado,
        entrega
      ] = await Promise.all([
        estadoPromise,
        entregaPromise
      ])

      const fechaReservaAux = new Date(reserva?.fecha?.toString() ?? '')

      if (process.env.NODE_ENV === 'development') {
        fechaReservaAux.setUTCHours(fechaReservaAux.getUTCHours() + 5)
      }

      const fechaReservaAux2 = new Date(fechaReservaAux.toString())

      const fechaReserva = format(fechaReservaAux2, 'DD/MM/YYYY')
      const horaReserva = format(fechaReservaAux2, 'h:mm A')

      let fechaEntrega = null
      let horaEntrega = null

      if (entrega !== null) {
        const fechaEntregaAux = new Date(entrega?.fecha?.toString() ?? '')

        if (process.env.NODE_ENV === 'development') {
          fechaEntregaAux.setUTCHours(fechaEntregaAux.getUTCHours() + 5)
        }

        const fechaEntregaAux2 = new Date(fechaEntregaAux.toString())

        fechaEntrega = format(fechaEntregaAux2, 'DD/MM/YYYY')
        horaEntrega = format(fechaEntregaAux2, 'h:mm A')
      }

      return {
        tipo_reserva: reservaEmpleado ? 'Presencial' : reservaVirtual ? 'Virtual' : 'N/A',
        fecha_reserva: fechaReserva,
        hora_reserva: horaReserva,
        estado_reserva: estado?.estado,
        fecha_entrega: fechaEntrega ?? 'N/A',
        hora_entrega: horaEntrega ?? 'N/A'
      }
    }))

    const estudianteHistorialRecargas = await Promise.all(estudianteRecargasSliced.map(async (recargaEstudiante) => {
      const recargaPromise = await db.recargas.findUnique({
        where: { id_recarga: recargaEstudiante?.id_recarga },
        select: { id_recarga: true, fecha: true, saldo: true }
      })

      const [
        recarga
      ] = await Promise.all([
        recargaPromise
      ])

      const fechaRecargaAux = new Date(recarga?.fecha?.toString() ?? '')

      const yearRecarga = fechaRecargaAux.getFullYear()
      const monthRecarga = fechaRecargaAux.getMonth() + 1
      const dayRecarga = fechaRecargaAux.getDate()
      const horaRecarga = fechaRecargaAux.toLocaleString('es-ES', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
      })

      const fechaRecarga = `${yearRecarga < 10 ? '0' : ''}${dayRecarga}/${monthRecarga < 10 ? '0' : ''}${monthRecarga}/${yearRecarga}`

      return {
        id_recarga: recarga?.id_recarga,
        fecha_recarga: fechaRecarga,
        hora_recarga: horaRecarga,
        saldo_recargado: recarga?.saldo
      }
    }))

    return NextResponse.json({
      estudianteHistorialReservas,
      estudianteHistorialReservasCount: estudianteReservas.length,
      estudianteHistorialRecargas,
      estudianteHistorialRecargasCount: estudianteRecargas.length
    })
  } catch (error) {
    console.error({ error })

    return NextResponse.json(
      { message: 'Something went wrong.', error },
      { status: 500 }
    )
  }
}

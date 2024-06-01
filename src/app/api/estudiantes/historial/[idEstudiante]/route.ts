import { db } from '@/libs/prismaDB'
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
      where: { id_estudiante: idEstudiante }
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

    const estudianteReservasSliced = estudianteReservas.slice(Number(rows) * (Number(page) - 1), Number(rows) * Number(page))

    const estudianteHistorialReservas = await Promise.all(estudianteReservasSliced.map(async (reservaEstudiante) => {
      const reservaPromise = await db.reservas.findUnique({
        where: { id_reserva: reservaEstudiante?.id_reserva }
      })

      const reservaEmpleadoPromise = await db.reservas_Empleados.findFirst({
        where: { id_reserva: reservaEstudiante.id_reserva }
      })

      const reservaVirtualPromise = await db.reservas_Virtuales.findFirst({
        where: { id_reserva: reservaEstudiante.id_reserva }
      })

      const estadoReservaPromise = await db.estados_Reservas.findFirst({
        where: { id_reserva: reservaEstudiante?.id_reserva }
      })

      const estudianteEntregaPromise = await db.estudiantes_Entregas.findFirst({
        where: { id_estudiante_reserva: reservaEstudiante?.id_estudiante_reserva }
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
        where: { id_estado: estadoReserva?.id_estado }
      })

      const entregaPromise = await db.entregas.findUnique({
        where: { id_entrega: estudianteEntrega?.id_entrega ?? '' }
      })

      const [
        estado,
        entrega
      ] = await Promise.all([
        estadoPromise,
        entregaPromise
      ])

      const fechaReservaAux = new Date(reserva?.fecha?.toString() ?? '')
      fechaReservaAux.setUTCHours(fechaReservaAux.getUTCHours() + 5)

      const yearReserva = fechaReservaAux.getFullYear()
      const monthReserva = fechaReservaAux.getMonth() + 1
      const dayReserva = fechaReservaAux.getDate()
      const horaReserva = fechaReservaAux.toLocaleString('es-ES', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
      })

      let fechaEntrega = null
      let horaEntrega = null

      if (entrega !== null) {
        const fechaEntregaAux = new Date(entrega?.fecha?.toString() ?? '')
        fechaEntregaAux.setUTCHours(fechaEntregaAux.getUTCHours() + 5)

        const yearEntrega = fechaEntregaAux?.getFullYear()
        const monthEntrega = fechaEntregaAux?.getMonth() + 1
        const dayEntrega = fechaEntregaAux?.getDate()

        fechaEntrega = `${yearEntrega < 10 ? '0' : ''}${dayEntrega}/${monthEntrega < 10 ? '0' : ''}${monthEntrega}/${yearEntrega}`
        horaEntrega = fechaEntregaAux?.toLocaleString('es-ES', {
          hour: 'numeric',
          minute: 'numeric',
          hour12: true
        })
      }

      const fechaReserva = `${yearReserva < 10 ? '0' : ''}${dayReserva}/${monthReserva < 10 ? '0' : ''}${monthReserva}/${yearReserva}`

      return {
        tipo_reserva: reservaEmpleado ? 'Presencial' : reservaVirtual ? 'Virtual' : 'N/A',
        fecha_reserva: fechaReserva,
        hora_reserva: horaReserva,
        estado_reserva: estado?.estado,
        fecha_entrega: fechaEntrega ?? 'N/A',
        hora_entrega: horaEntrega ?? 'N/A'
      }
    }))

    return NextResponse.json({
      estudianteHistorialReservas,
      estudianteHistorialReservasCount: estudianteReservas.length,
      estudianteHistorialRecargas: []
    })
  } catch (error) {
    console.error({ error })

    return NextResponse.json(
      { message: 'Something went wrong.', error },
      { status: 500 }
    )
  }
}
import { db } from '@/libs/prismaDB'
import { NextResponse } from 'next/server'

export async function GET (request: Request, { params }: { params: { fecha: string } }) {
  try {
    const fechaAux = new Date(params.fecha)
    const año = fechaAux.getFullYear()
    const mes = fechaAux.getMonth() + 1
    const dia = fechaAux.getDate()

    const fecha = new Date(`${año}-${mes < 10 ? '0' : ''}${mes}-${dia < 10 ? '0' : ''}${dia}`)
    const searchParams = new URL(request.url).searchParams
    const page = searchParams.get('page')
    const rows = searchParams.get('rows')

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

    const almuerzos = await db.almuerzos.findUnique({
      where: { fecha }
    })

    if (almuerzos === null) {
      return NextResponse.json({
        estudiantesAlmuerzos: [],
        estudiantesAlmuerzosCount: 0
      })
    }

    const reservas = await db.reservas.findMany({
      where: { id_almuerzo: almuerzos.id_almuerzo }
    })
    const estudiantesReservas = await db.estudiantes_Reservas.findMany({
      where: { id_reserva: { in: reservas.map(reserva => reserva.id_reserva) } }
    })
    const estudiantesTotal = await db.estudiantes.findMany({
      where: { id_estudiante: { in: estudiantesReservas.map(estudianteReserva => estudianteReserva.id_estudiante) } }
    })

    const estudiantes = estudiantesTotal.slice(Number(rows) * (Number(page) - 1), Number(rows) * Number(page))

    const estudiantesLunchFip = await Promise.all(estudiantes.map(async (estudiante) => {
      const tipoDocumentoPromise = await db.tipos_Documento.findUnique({
        where: { id_tipo_documento: estudiante.id_tipo_documento }
      })

      const programaPromise = await db.programas.findUnique({
        where: { id_programa: estudiante.id_programa }
      })

      const imageEstudiantePromise = await db.imagenes_Perfil_Estudiantes.findFirst({
        where: { id_estudiante: estudiante.id_estudiante }
      })

      const estudianteReservaPromise = await db.estudiantes_Reservas.findFirst({
        where: { id_estudiante: estudiante.id_estudiante, id_reserva: { in: reservas.map(reserva => reserva.id_reserva) } }
      })

      const [
        tipoDocumento,
        programa,
        imageEstudiante,
        estudianteReserva
      ] = await Promise.all([
        tipoDocumentoPromise,
        programaPromise,
        imageEstudiantePromise,
        estudianteReservaPromise
      ])

      const facultadPromise = await db.facultades.findUnique({
        where: { id_facultad: programa?.id_facultad }
      })

      const estadoReservaPromise = await db.estados_Reservas.findFirst({
        where: { id_reserva: estudianteReserva?.id_reserva }
      })

      const reservaPromise = await db.reservas.findUnique({
        where: { id_reserva: estudianteReserva?.id_reserva }
      })

      const estudianteEntregaPromise = await db.estudiantes_Entregas.findFirst({
        where: { id_estudiante_reserva: estudianteReserva?.id_estudiante_reserva }
      })

      const reservaEmpleadoPromise = await db.reservas_Empleados.findFirst({
        where: { id_reserva: estudianteReserva?.id_reserva }
      })

      const reservaVirtualPromise = await db.reservas_Virtuales.findFirst({
        where: { id_reserva: estudianteReserva?.id_reserva }
      })

      const [
        facultad,
        estadoReserva,
        reserva,
        estudianteEntrega,
        reservaEmpleado,
        reservaVirtual
      ] = await Promise.all([
        facultadPromise,
        estadoReservaPromise,
        reservaPromise,
        estudianteEntregaPromise,
        reservaEmpleadoPromise,
        reservaVirtualPromise
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

      const { id_tipo_documento: a, id_programa: b, id_rol: c, id_sexo: d, saldo: e, clave: f, createdAt: g, updatedAt: h, ...resEstudiantes } = estudiante

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
        horaEntrega = horaEntrega[0] === '0' ? `12${horaEntrega.slice(1)}` : horaEntrega
      }

      const fechaReserva = `${yearReserva < 10 ? '0' : ''}${dayReserva}/${monthReserva < 10 ? '0' : ''}${monthReserva}/${yearReserva}`

      return {
        ...resEstudiantes, tipo_documento: tipoDocumento?.tipo_documento, programa: programa?.programa, facultad: facultad?.facultad, imageUrl: imageEstudiante?.url_imagen_perfil, estado_reserva: estado?.estado, fecha_reserva: fechaReserva, hora_reserva: horaReserva, fecha_entrega: fechaEntrega ?? 'N/A', hora_entrega: horaEntrega ?? 'N/A', reserva_empleado: !!reservaEmpleado, reserva_virtual: !!reservaVirtual
      }
    }))

    return NextResponse.json({
      estudiantesAlmuerzos: estudiantesLunchFip,
      estudiantesAlmuerzosCount: estudiantesReservas.length
    })
  } catch (error) {
    console.error({ error })

    return NextResponse.json(
      { message: 'Something went wrong.', error },
      { status: 500 }
    )
  }
}

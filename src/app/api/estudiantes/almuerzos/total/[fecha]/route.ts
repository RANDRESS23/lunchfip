import { db } from '@/libs/prismaDB'
import { validateAccessAPI } from '@/libs/validateAccessAPI'
import { format } from '@formkit/tempo'
import { NextResponse } from 'next/server'

export async function GET (_: Request, { params }: { params: { fecha: string } }) {
  try {
    const isValidateAccessAPI = await validateAccessAPI()

    if (isValidateAccessAPI) {
      return NextResponse.json(
        { message: '¡No tienes permisos para acceder a esta información!' },
        { status: 401 }
      )
    }

    const fecha = new Date(params.fecha)

    const almuerzosFecha = await db.almuerzos_Fecha.findUnique({
      where: { fecha },
      select: { id_almuerzos_fecha: true }
    })

    if (almuerzosFecha === null) {
      return NextResponse.json(
        {
          totalEstudiantesAlmuerzos: [],
          message: '¡No hay fecha definida para el servicio de almuerzos!'
        },
        { status: 404 }
      )
    }

    const almuerzos = await db.almuerzos.findFirst({
      where: { id_almuerzos_fecha: almuerzosFecha.id_almuerzos_fecha },
      select: { id_almuerzo: true }
    })

    if (almuerzos === null) {
      return NextResponse.json({
        totalEstudiantesAlmuerzos: []
      })
    }

    const reservas = await db.reservas.findMany({
      where: { id_almuerzo: almuerzos.id_almuerzo },
      select: { id_reserva: true }
    })
    const estudiantesReservas = await db.estudiantes_Reservas.findMany({
      where: { id_reserva: { in: reservas.map(reserva => reserva.id_reserva) } },
      select: { id_estudiante: true }
    })
    const estudiantesTotal = await db.estudiantes.findMany({
      where: { id_estudiante: { in: estudiantesReservas.map(estudianteReserva => estudianteReserva.id_estudiante) } }
    })

    const totalEstudiantesAlmuerzos = await Promise.all(estudiantesTotal.map(async (estudiante) => {
      const tipoDocumentoPromise = await db.tipos_Documento.findUnique({
        where: { id_tipo_documento: estudiante.id_tipo_documento },
        select: { tipo_documento: true }
      })

      const programaPromise = await db.programas.findUnique({
        where: { id_programa: estudiante.id_programa },
        select: { programa: true, id_facultad: true }
      })

      const imageEstudiantePromise = await db.imagenes_Perfil_Estudiantes.findFirst({
        where: { id_estudiante: estudiante.id_estudiante },
        select: { url_imagen_perfil: true }
      })

      const estudianteReservaPromise = await db.estudiantes_Reservas.findFirst({
        where: { id_estudiante: estudiante.id_estudiante, id_reserva: { in: reservas.map(reserva => reserva.id_reserva) } },
        select: { id_reserva: true, id_estudiante_reserva: true }
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
        where: { id_facultad: programa?.id_facultad },
        select: { facultad: true }
      })

      const estadoReservaPromise = await db.estados_Reservas.findFirst({
        where: { id_reserva: estudianteReserva?.id_reserva },
        select: { id_estado: true }
      })

      const reservaPromise = await db.reservas.findUnique({
        where: { id_reserva: estudianteReserva?.id_reserva },
        select: { fecha: true }
      })

      const estudianteEntregaPromise = await db.estudiantes_Entregas.findFirst({
        where: { id_estudiante_reserva: estudianteReserva?.id_estudiante_reserva },
        select: { id_entrega: true }
      })

      const reservaEmpleadoPromise = await db.reservas_Empleados.findFirst({
        where: { id_reserva: estudianteReserva?.id_reserva },
        select: { id_reserva_empleado: true }
      })

      const reservaVirtualPromise = await db.reservas_Virtuales.findFirst({
        where: { id_reserva: estudianteReserva?.id_reserva },
        select: { id_reserva_virtual: true }
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

      const { id_tipo_documento: a, id_programa: b, id_rol: c, id_sexo: d, saldo: e, clave: f, createdAt: g, updatedAt: h, ...resEstudiantes } = estudiante

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
        ...resEstudiantes, tipo_documento: tipoDocumento?.tipo_documento, programa: programa?.programa, facultad: facultad?.facultad, imageUrl: imageEstudiante?.url_imagen_perfil, estado_reserva: estado?.estado, fecha_reserva: fechaReserva, hora_reserva: horaReserva, fecha_entrega: fechaEntrega ?? 'N/A', hora_entrega: horaEntrega ?? 'N/A', reserva_empleado: !!reservaEmpleado, reserva_virtual: !!reservaVirtual
      }
    }))

    return NextResponse.json({
      totalEstudiantesAlmuerzos
    })
  } catch (error) {
    console.error({ error })

    return NextResponse.json(
      { message: 'Something went wrong.', error },
      { status: 500 }
    )
  }
}

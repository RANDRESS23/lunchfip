import { db } from '@/libs/prismaDB'
import { format } from '@formkit/tempo'
import { NextResponse } from 'next/server'

const getDayAndMonthString = (fechaAux: Date) => {
  const fechaAuxParsed = new Date(fechaAux)

  return format(fechaAuxParsed, 'DD/MM')
}

const getDefaultData = (fechaInicioAux: Date, fechaFinAux: Date) => [
  {
    name: getDayAndMonthString(fechaInicioAux),
    cantidad: 0
  },
  {
    name: getDayAndMonthString(fechaFinAux),
    cantidad: 0
  }
]

export async function GET (_: Request, { params }: { params: { fechaInicio: string, fechaFin: string } }) {
  try {
    const fechaInicioAux = new Date(params.fechaInicio)
    const fechaFinAux = new Date(params.fechaFin)

    const fechaInicioString = format(fechaInicioAux, 'DD-MM-YYYY')
    const fechaFinString = format(fechaFinAux, 'DD-MM-YYYY')

    const existingLunchesDate = await db.almuerzos_Fecha.findMany({
      where: {
        fecha: {
          gte: fechaInicioAux,
          lte: fechaFinAux
        }
      },
      orderBy: { fecha: 'asc' }
    })

    const almuerzos = await db.almuerzos.findMany({
      where: {
        id_almuerzos_fecha: { in: existingLunchesDate.map(almuerzosFecha => almuerzosFecha.id_almuerzos_fecha) }
      }
    })

    if (almuerzos === null) {
      return NextResponse.json({
        almuerzosEstadisticas: {
          totalAlmuerzosDefinidos: 0,
          dataTotalAlmuerzosDefinidos: getDefaultData(fechaInicioAux, fechaFinAux),
          totalAlmuerzosReservados: 0,
          dataTotalAlmuerzosReservados: getDefaultData(fechaInicioAux, fechaFinAux),
          totalAlmuerzosReservadosPresencial: 0,
          dataTotalAlmuerzosReservadosPresencial: getDefaultData(fechaInicioAux, fechaFinAux),
          totalAlmuerzosReservadosVirtual: 0,
          dataTotalAlmuerzosReservadosVirtual: getDefaultData(fechaInicioAux, fechaFinAux),
          totalAlmuerzosEntregados: 0,
          dataTotalAlmuerzosEntregados: getDefaultData(fechaInicioAux, fechaFinAux),
          totalAlmuerzosSinEntregar: 0,
          dataTotalAlmuerzosSinEntregar: getDefaultData(fechaInicioAux, fechaFinAux),
          totalRecargas: 0,
          dataTotalRecargas: getDefaultData(fechaInicioAux, fechaFinAux),
          fechaInicio: fechaInicioString,
          fechaFin: fechaFinString
        }
      })
    }

    const dataTotalAlmuerzosEstadisticas = await Promise.all(almuerzos.map(async (almuerzo) => {
      const almuerzoFechaPromise = await db.almuerzos_Fecha.findUnique({
        where: { id_almuerzos_fecha: almuerzo.id_almuerzos_fecha }
      })

      const reservasDatePromise = await db.reservas.findMany({
        where: { id_almuerzo: almuerzo.id_almuerzo }
      })

      const entregasDatePromise = await db.entregas.findMany({
        where: { id_almuerzo: almuerzo.id_almuerzo }
      })

      const [
        almuerzoFecha,
        reservasDate,
        entregasDate
      ] = await Promise.all([
        almuerzoFechaPromise,
        reservasDatePromise,
        entregasDatePromise
      ])

      const reservaPresencialDatePromise = await db.reservas_Empleados.count({
        where: { id_reserva: { in: reservasDate.map((reserva) => reserva.id_reserva) } }
      })
      const reservaVirtualDatePromise = await db.reservas_Virtuales.count({
        where: { id_reserva: { in: reservasDate.map((reserva) => reserva.id_reserva) } }
      })

      const [
        reservaPresencialDate,
        reservaVirtualDate
      ] = await Promise.all([
        reservaPresencialDatePromise,
        reservaVirtualDatePromise
      ])

      return {
        dataTotalAlmuerzosReservados: {
          name: getDayAndMonthString((almuerzoFecha?.fecha ?? new Date()) as Date),
          cantidad: reservasDate.length
        },
        dataTotalAlmuerzosReservadosPresencial: {
          name: getDayAndMonthString((almuerzoFecha?.fecha ?? new Date()) as Date),
          cantidad: reservaPresencialDate
        },
        dataTotalAlmuerzosReservadosVirtual: {
          name: getDayAndMonthString((almuerzoFecha?.fecha ?? new Date()) as Date),
          cantidad: reservaVirtualDate
        },
        dataTotalAlmuerzosSinEntregar: {
          name: getDayAndMonthString((almuerzoFecha?.fecha ?? new Date()) as Date),
          cantidad: reservasDate.length - entregasDate.length
        },
        dataTotalAlmuerzosEntregados: {
          name: getDayAndMonthString((almuerzoFecha?.fecha ?? new Date()) as Date),
          cantidad: entregasDate.length
        }
      }
    }))

    const dataTotalAlmuerzosReservados: Array<{ name: string, cantidad: number }> = dataTotalAlmuerzosEstadisticas.map(({ dataTotalAlmuerzosReservados }) => dataTotalAlmuerzosReservados)
    const dataTotalAlmuerzosReservadosPresencial: Array<{ name: string, cantidad: number }> = dataTotalAlmuerzosEstadisticas.map(({ dataTotalAlmuerzosReservadosPresencial }) => dataTotalAlmuerzosReservadosPresencial)
    const dataTotalAlmuerzosReservadosVirtual: Array<{ name: string, cantidad: number }> = dataTotalAlmuerzosEstadisticas.map(({ dataTotalAlmuerzosReservadosVirtual }) => dataTotalAlmuerzosReservadosVirtual)
    const dataTotalAlmuerzosEntregados: Array<{ name: string, cantidad: number }> = dataTotalAlmuerzosEstadisticas.map(({ dataTotalAlmuerzosEntregados }) => dataTotalAlmuerzosEntregados)
    const dataTotalAlmuerzosSinEntregar: Array<{ name: string, cantidad: number }> = dataTotalAlmuerzosEstadisticas.map(({ dataTotalAlmuerzosSinEntregar }) => dataTotalAlmuerzosSinEntregar)

    const totalRecargasFecha = await db.recargas.findMany({
      where: {
        fecha: {
          gte: fechaInicioAux,
          lte: fechaFinAux
        }
      },
      orderBy: { fecha: 'asc' }
    })

    let fechasAux: string[] = []

    const dataTotalRecargasEstadisticas = await Promise.all(totalRecargasFecha.map(async (recarga) => {
      const startDate = new Date(recarga.fecha)
      startDate.setUTCHours(0, 0, 0, 0)

      if (fechasAux.includes(startDate.toString())) {
        return {
          dataTotalRecargas: null
        }
      }

      fechasAux = [...fechasAux, startDate.toString()]

      const endDate = new Date(startDate)
      endDate.setUTCDate(startDate.getUTCDate() + 1)

      const recargasDatePromise = await db.recargas.count({
        where: {
          fecha: {
            gte: startDate,
            lt: endDate
          }
        }
      })

      const [
        recargasDate
      ] = await Promise.all([
        recargasDatePromise
      ])

      return {
        dataTotalRecargas: {
          name: getDayAndMonthString(recarga.fecha),
          cantidad: recargasDate
        }
      }
    }))

    const dataTotalRecargas: Array<{ name: string, cantidad: number } | null> = dataTotalRecargasEstadisticas
      .filter(data => data.dataTotalRecargas !== null)
      .map(({ dataTotalRecargas }) => dataTotalRecargas)

    const totalAlmuerzosDefinidos = almuerzos.reduce((acc, almuerzo) => acc + almuerzo.total_almuerzos, 0)

    const dataTotalAlmuerzosDefinidos = await Promise.all(almuerzos.map(async (almuerzo) => {
      const almuerzoFechaPromise = await db.almuerzos_Fecha.findUnique({
        where: { id_almuerzos_fecha: almuerzo.id_almuerzos_fecha }
      })

      const [
        almuerzoFecha
      ] = await Promise.all([
        almuerzoFechaPromise
      ])

      return {
        dataTotalAlmuerzosReservados: {
          name: getDayAndMonthString((almuerzoFecha ? almuerzoFecha.fecha : new Date()) as Date),
          cantidad: almuerzo.total_almuerzos
        }
      }
    }))

    const totalAlmuerzosReservados = await db.reservas.findMany({
      where: { id_almuerzo: { in: almuerzos.map(almuerzo => almuerzo.id_almuerzo) } }
    })

    const totalAlmuerzosReservadosPresencial = await db.reservas_Empleados.count({
      where: { id_reserva: { in: totalAlmuerzosReservados.map(reserva => reserva.id_reserva) } }
    })

    const totalAlmuerzosReservadosVirtual = await db.reservas_Virtuales.count({
      where: { id_reserva: { in: totalAlmuerzosReservados.map(reserva => reserva.id_reserva) } }
    })

    const totalAlmuerzosEntregados = await db.entregas.count({
      where: { id_almuerzo: { in: almuerzos.map(almuerzo => almuerzo.id_almuerzo) } }
    })

    const totalAlmuerzosSinEntregar = totalAlmuerzosReservados.length - totalAlmuerzosEntregados

    const totalRecargas = await db.recargas.count({
      where: {
        fecha: {
          gte: fechaInicioAux,
          lte: fechaFinAux
        }
      }
    })

    return NextResponse.json({
      almuerzosEstadisticas: {
        totalAlmuerzosDefinidos,
        dataTotalAlmuerzosDefinidos,
        totalAlmuerzosReservados: totalAlmuerzosReservados.length,
        dataTotalAlmuerzosReservados,
        totalAlmuerzosReservadosPresencial,
        dataTotalAlmuerzosReservadosPresencial,
        totalAlmuerzosReservadosVirtual,
        dataTotalAlmuerzosReservadosVirtual,
        totalAlmuerzosEntregados,
        dataTotalAlmuerzosEntregados,
        totalAlmuerzosSinEntregar,
        dataTotalAlmuerzosSinEntregar,
        totalRecargas,
        dataTotalRecargas,
        fechaInicio: fechaInicioString,
        fechaFin: fechaFinString
      }
    })
  } catch (error) {
    console.error({ error })

    return NextResponse.json(
      { message: 'Something went wrong.', error },
      { status: 500 }
    )
  }
}

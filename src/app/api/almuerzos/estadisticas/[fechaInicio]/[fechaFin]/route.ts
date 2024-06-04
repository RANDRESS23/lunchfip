import { db } from '@/libs/prismaDB'
import { NextResponse } from 'next/server'

const getDayAndMonthString = (fechaAux: Date) => {
  const fechaAuxParsed = new Date(fechaAux.toString())

  const mesAux = new Date(fechaAuxParsed.toString()).getMonth() + 1
  const diaAux = new Date(fechaAuxParsed.toString()).getDate()

  const fechaString = `${diaAux < 10 ? '0' : ''}${diaAux}/${mesAux < 10 ? '0' : ''}${mesAux}`

  return fechaString
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

    const añoInicio = fechaInicioAux.getFullYear()
    const mesInicio = fechaInicioAux.getMonth() + 1
    const diaInicio = fechaInicioAux.getDate()

    const añoFin = fechaFinAux.getFullYear()
    const mesFin = fechaFinAux.getMonth() + 1
    const diaFin = fechaFinAux.getDate()

    const fechaInicioParsed = new Date(`${añoInicio}-${mesInicio < 10 ? '0' : ''}${mesInicio}-${diaInicio < 10 ? '0' : ''}${diaInicio}`)
    const fechaFinParsed = new Date(`${añoFin}-${mesFin < 10 ? '0' : ''}${mesFin}-${diaFin < 10 ? '0' : ''}${diaFin}`)

    const fechaInicioString = `${diaInicio < 10 ? '0' : ''}${diaInicio}/${mesInicio < 10 ? '0' : ''}${mesInicio}/${añoInicio}`
    const fechaFinString = `${diaFin < 10 ? '0' : ''}${diaFin}/${mesFin < 10 ? '0' : ''}${mesFin}/${añoFin}`

    const almuerzos = await db.almuerzos.findMany({
      where: {
        fecha: {
          gte: fechaInicioParsed,
          lte: fechaFinParsed
        }
      },
      orderBy: { fecha: 'asc' }
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
      const reservasDatePromise = await db.reservas.findMany({
        where: { id_almuerzo: almuerzo.id_almuerzo }
      })
      const entregasDatePromise = await db.entregas.findMany({
        where: { id_almuerzo: almuerzo.id_almuerzo }
      })

      const [
        reservasDate,
        entregasDate
      ] = await Promise.all([
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
          name: getDayAndMonthString(almuerzo.fecha),
          cantidad: reservasDate.length
        },
        dataTotalAlmuerzosReservadosPresencial: {
          name: getDayAndMonthString(almuerzo.fecha),
          cantidad: reservaPresencialDate
        },
        dataTotalAlmuerzosReservadosVirtual: {
          name: getDayAndMonthString(almuerzo.fecha),
          cantidad: reservaVirtualDate
        },
        dataTotalAlmuerzosSinEntregar: {
          name: getDayAndMonthString(almuerzo.fecha),
          cantidad: reservasDate.length - entregasDate.length
        },
        dataTotalAlmuerzosEntregados: {
          name: getDayAndMonthString(almuerzo.fecha),
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
          gte: fechaInicioParsed,
          lte: fechaFinParsed
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

    const dataTotalAlmuerzosDefinidos = almuerzos.map(almuerzo => ({
      name: getDayAndMonthString(almuerzo.fecha),
      cantidad: almuerzo.total_almuerzos
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
          gte: fechaInicioParsed,
          lte: fechaFinParsed
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

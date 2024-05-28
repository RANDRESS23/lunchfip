import { db } from '@/libs/prismaDB'
import { NextResponse } from 'next/server'

const getDayAndMonthString = (fechaAux: Date, notSumDay?: boolean) => {
  const fechaAuxParsed = new Date(fechaAux.toString())
  if (!notSumDay) fechaAuxParsed.setDate(fechaAuxParsed.getDate() + 1)

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

    const dataTotalAlmuerzosReservados: Array<{ name: string, cantidad: number }> = []
    const dataTotalAlmuerzosReservadosPresencial: Array<{ name: string, cantidad: number }> = []
    const dataTotalAlmuerzosReservadosVirtual: Array<{ name: string, cantidad: number }> = []
    const dataTotalAlmuerzosEntregados: Array<{ name: string, cantidad: number }> = []
    const dataTotalAlmuerzosSinEntregar: Array<{ name: string, cantidad: number }> = []
    const dataTotalRecargas: Array<{ name: string, cantidad: number }> = []

    almuerzos.forEach(async (almuerzo) => {
      const reservasDate = await db.reservas.findMany({
        where: { id_almuerzo: almuerzo.id_almuerzo }
      })
      const entregasDate = await db.entregas.findMany({
        where: { id_almuerzo: almuerzo.id_almuerzo }
      })

      let reservasPresenciales = 0
      let reservasVirtuales = 0

      reservasDate.forEach(async (reserva, index) => {
        const reservaPresencialDate = await db.reservas_Empleados.findFirst({
          where: { id_reserva: reserva.id_reserva }
        })
        const reservaVirtualDate = await db.reservas_Virtuales.findFirst({
          where: { id_reserva: reserva.id_reserva }
        })

        if (reservaPresencialDate !== null) reservasPresenciales += 1
        if (reservaVirtualDate !== null) reservasVirtuales += 1

        if (index === reservasDate.length - 1) {
          dataTotalAlmuerzosReservados.push({
            name: getDayAndMonthString(almuerzo.fecha),
            cantidad: reservasDate.length
          })
          dataTotalAlmuerzosReservadosPresencial.push({
            name: getDayAndMonthString(almuerzo.fecha),
            cantidad: reservasPresenciales
          })
          dataTotalAlmuerzosReservadosVirtual.push({
            name: getDayAndMonthString(almuerzo.fecha),
            cantidad: reservasVirtuales
          })
          dataTotalAlmuerzosSinEntregar.push({
            name: getDayAndMonthString(almuerzo.fecha),
            cantidad: reservasDate.length - entregasDate.length
          })
          dataTotalAlmuerzosEntregados.push({
            name: getDayAndMonthString(almuerzo.fecha),
            cantidad: entregasDate.length
          })
        }
      })
    })

    const totalRecargasFecha = await db.recargas.findMany({
      where: {
        fecha: {
          gte: fechaInicioParsed,
          lte: fechaFinParsed
        }
      }
    })

    let fechaAux = ''

    totalRecargasFecha.forEach(async recarga => {
      const startDate = new Date(recarga.fecha)
      startDate.setUTCHours(startDate.getUTCHours() + 5)
      startDate.setUTCHours(0, 0, 0, 0)
      startDate.setUTCHours(startDate.getUTCHours() - 19)

      if (fechaAux === startDate.toString()) return

      fechaAux = startDate.toString()

      const endDate = new Date(startDate)
      endDate.setUTCDate(startDate.getUTCDate() + 1)

      const recargasDate = await db.recargas.findMany({
        where: {
          fecha: {
            gte: startDate,
            lt: endDate
          }
        }
      })

      dataTotalRecargas.push({
        name: getDayAndMonthString(recarga.fecha, true),
        cantidad: recargasDate.length
      })
    })

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

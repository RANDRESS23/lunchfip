import { db } from '@/libs/prismaDB'
import { NextResponse } from 'next/server'

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
          totalAlmuerzosReservados: 0,
          totalAlmuerzosReservadosPresencial: 0,
          totalAlmuerzosReservadosVirtual: 0,
          totalAlmuerzosEntregados: 0,
          totalAlmuerzosSinEntregar: 0,
          totalRecargas: 0,
          fechaInicio: fechaInicioString,
          fechaFin: fechaFinString
        }
      })
    }

    const totalAlmuerzosDefinidos = almuerzos.reduce((acc, almuerzo) => acc + almuerzo.total_almuerzos, 0)
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
        totalAlmuerzosReservados: totalAlmuerzosReservados.length,
        totalAlmuerzosReservadosPresencial,
        totalAlmuerzosReservadosVirtual,
        totalAlmuerzosEntregados,
        totalAlmuerzosSinEntregar,
        totalRecargas,
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

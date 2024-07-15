import { db } from '@/libs/prismaDB'
import { NextResponse } from 'next/server'

export async function GET () {
  try {
    const estudiantesTotal = await db.estudiantes.findMany()
    const totalEstudiantes = await Promise.all(estudiantesTotal.map(async (estudiante) => {
      const programa = await db.programas.findUnique({
        where: { id_programa: estudiante.id_programa },
        select: { programa: true }
      })

      const estadoEstudiante = await db.estados_Estudiantes.findFirst({
        where: { id_estudiante: estudiante.id_estudiante },
        select: { id_estado: true }
      })

      const estado = await db.estados.findUnique({
        where: { id_estado: estadoEstudiante?.id_estado },
        select: { estado: true }
      })

      return {
        ...estudiante, programa: programa?.programa, estado: estado?.estado
      }
    }))

    return NextResponse.json({
      totalEstudiantes
    })
  } catch (error) {
    console.error({ error })

    return NextResponse.json(
      { message: 'Something went wrong.', error },
      { status: 500 }
    )
  }
}

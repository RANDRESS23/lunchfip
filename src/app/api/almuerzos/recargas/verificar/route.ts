import { db } from '@/libs/prismaDB'
import { NextResponse } from 'next/server'
import { recargasSchema } from '../schema'

export async function POST (request: Request) {
  const body = await request.json()

  try {
    const {
      id_estudiante: idEstudiante
    } = recargasSchema.parse(body)

    const estudiante = await db.estudiantes.findUnique({
      where: { id_estudiante: idEstudiante }
    })

    if (estudiante === null) {
      return NextResponse.json(
        { message: '¡El estudiante no se encuentra registrado en LunchFip!' },
        { status: 400 }
      )
    }

    const estados = await db.estados.findMany()
    const [estadoEstudiante] = await db.estados_Estudiantes.findMany({
      where: { id_estudiante: estudiante.id_estudiante }
    })

    if (estadoEstudiante.id_estado !== estados[0].id_estado) {
      return NextResponse.json(
        { message: '¡El estudiante no se encuentra activo en LunchFip!' },
        { status: 400 }
      )
    }

    const programa = await db.programas.findUnique({
      where: { id_programa: estudiante.id_programa }
    })

    const tipoDocumento = await db.tipos_Documento.findUnique({
      where: { id_tipo_documento: estudiante.id_tipo_documento }
    })

    const sexo = await db.sexos.findUnique({
      where: { id_sexo: estudiante.id_sexo }
    })

    return NextResponse.json(
      {
        estudiante: { ...estudiante, programa: programa?.programa, tipo_documento: tipoDocumento?.tipo_documento, sexo: sexo?.sexo },
        message: `¡Se verificó que ${estudiante.primer_nombre} se encuentre registrado y está activo en LunchFip!`
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

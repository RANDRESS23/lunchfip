import { db } from '@/libs/prismaDB'
import { NextResponse } from 'next/server'
import { z } from 'zod'

export const documentAndIdStudentSchema = z.object({
  id_estudiante: z.string().optional(),
  numero_documento: z.string().min(7, {
    message: 'El número de documento debe tener al menos 7 caracteres.'
  }).max(12, {
    message: 'El número de documento debe tener máximo 12 caracteres.'
  }).optional()
})

export async function POST (request: Request) {
  const body = await request.json()

  try {
    const {
      numero_documento: numeroDocumento,
      id_estudiante: idEstudiante
    } = documentAndIdStudentSchema.parse(body)

    let estudiante = null

    if (numeroDocumento) {
      estudiante = await db.estudiantes.findUnique({
        where: { numero_documento: numeroDocumento }
      })
    }

    if (idEstudiante) {
      estudiante = await db.estudiantes.findUnique({
        where: { id_estudiante: idEstudiante }
      })
    }

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

    const imageEstudiante = await db.imagenes_Perfil_Estudiantes.findFirst({
      where: { id_estudiante: estudiante.id_estudiante }
    })

    const codigoQREstudiante = await db.codigos_QR_Estudiantes.findFirst({
      where: { id_estudiante: estudiante.id_estudiante }
    })

    return NextResponse.json(
      {
        estudiante: { ...estudiante, programa: programa?.programa, tipo_documento: tipoDocumento?.tipo_documento, sexo: sexo?.sexo, imageUrl: imageEstudiante?.url_imagen_perfil, codigoUrl: codigoQREstudiante?.url_codigo_qr },
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

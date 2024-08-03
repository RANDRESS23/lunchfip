import { db } from '@/libs/prismaDB'
import { validateAccessAPI } from '@/libs/validateAccessAPI'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const documentAndIdStudentSchema = z.object({
  id_estudiante: z.string().optional(),
  numero_documento: z.string().min(7, {
    message: 'El número de documento debe tener al menos 7 caracteres.'
  }).max(12, {
    message: 'El número de documento debe tener máximo 12 caracteres.'
  }).optional()
})

export async function POST (request: Request) {
  try {
    const body = await request.json()

    const isValidateAccessAPI = await validateAccessAPI()

    if (isValidateAccessAPI) {
      return NextResponse.json(
        { message: '¡No tienes permisos para acceder a esta información!' },
        { status: 401 }
      )
    }

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

    const estadoInactivo = await db.estados.findFirst({
      where: { estado: 'Inactivo' },
      select: { id_estado: true }
    })

    const estadoEstudiante = await db.estados_Estudiantes.findUnique({
      where: { id_estudiante: estudiante.id_estudiante },
      select: { id_estado: true }
    })

    if (estadoEstudiante?.id_estado === estadoInactivo?.id_estado) {
      return NextResponse.json(
        { message: '¡El estudiante no se encuentra activo en LunchFip!' },
        { status: 400 }
      )
    }

    const [tipoDocumento, sexo, programa, imageEstudiante, codigoQREstudiante] = await Promise.all([
      db.tipos_Documento.findUnique({
        where: { id_tipo_documento: estudiante.id_tipo_documento },
        select: { tipo_documento: true }
      }),
      db.sexos.findUnique({
        where: { id_sexo: estudiante.id_sexo },
        select: { sexo: true }
      }),
      db.programas.findUnique({
        where: { id_programa: estudiante.id_programa },
        select: { programa: true }
      }),
      db.imagenes_Perfil_Estudiantes.findFirst({
        where: { id_estudiante: estudiante.id_estudiante },
        select: { url_imagen_perfil: true }
      }),
      db.codigos_QR_Estudiantes.findFirst({
        where: { id_estudiante: estudiante.id_estudiante },
        select: { url_codigo_qr: true }
      })
    ])

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

import { NextResponse } from 'next/server'
import { db } from '@/libs/prismaDB'

export async function POST (request: Request) {
  try {
    const body = await request.json()

    const { correo_institucional: correoInstitucional } = body

    const estudiante = await db.estudiantes.findUnique({
      where: { correo_institucional: correoInstitucional }
    })

    if (estudiante === null) {
      return NextResponse.json(
        { message: '¡El correo ingresado no está registrado!' },
        { status: 404 }
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

    const { clave: _, ...infoEstudiante } = estudiante

    return NextResponse.json(
      {
        estudiante: { ...infoEstudiante, tipo_documento: tipoDocumento?.tipo_documento, sexo: sexo?.sexo, programa: programa?.programa, imageUrl: imageEstudiante?.url_imagen_perfil, codigoUrl: codigoQREstudiante?.url_codigo_qr },
        message: '¡Datos validados correctamente!'
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

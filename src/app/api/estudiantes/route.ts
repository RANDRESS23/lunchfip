import { encryptPassword } from '@/libs/bcrypt'
import { db } from '@/libs/prismaDB'
import { estudianteDataSchema, estudianteSchema } from './schema'
import { NextResponse } from 'next/server'
import { type UploadApiResponse, v2 as cloudinary } from 'cloudinary'
import QRCode from 'qrcode'
import { validateAccessAPI } from '@/libs/validateAccessAPI'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

export async function GET (request: Request) {
  try {
    const isValidateAccessAPI = await validateAccessAPI()

    if (isValidateAccessAPI) {
      return NextResponse.json(
        { message: '¡No tienes permisos para acceder a esta información!' },
        { status: 401 }
      )
    }

    const searchParams = new URL(request.url).searchParams
    const page = searchParams.get('page')
    const rows = searchParams.get('rows')

    if (page === null) {
      return NextResponse.json(
        { messsage: '¡El parámetro "page" es requerido!' },
        { status: 400 }
      )
    }

    if (rows === null) {
      return NextResponse.json(
        { messsage: '¡El parámetro "rows" es requerido!' },
        { status: 400 }
      )
    }

    const estudiantesTotal = await db.estudiantes.findMany()
    const estudiantes = estudiantesTotal.slice(Number(rows) * (Number(page) - 1), Number(rows) * Number(page))

    const estudiantesLunchFip = await Promise.all(estudiantes.map(async (estudiante) => {
      const tipoDocumentoPromise = await db.tipos_Documento.findUnique({
        where: { id_tipo_documento: estudiante.id_tipo_documento }
      })

      const sexoPromise = await db.sexos.findUnique({
        where: { id_sexo: estudiante.id_sexo }
      })

      const programaPromise = await db.programas.findUnique({
        where: { id_programa: estudiante.id_programa }
      })

      const imageEstudiantePromise = await db.imagenes_Perfil_Estudiantes.findFirst({
        where: { id_estudiante: estudiante.id_estudiante },
        select: { url_imagen_perfil: true }
      })

      const codigoQREstudiantePromise = await db.codigos_QR_Estudiantes.findFirst({
        where: { id_estudiante: estudiante.id_estudiante }
      })

      const estadoEstudiantePromise = await db.estados_Estudiantes.findFirst({
        where: { id_estudiante: estudiante.id_estudiante }
      })

      const [
        tipoDocumento,
        sexo,
        programa,
        imageEstudiante,
        codigoQREstudiante,
        estadoEstudiante
      ] = await Promise.all([
        tipoDocumentoPromise,
        sexoPromise,
        programaPromise,
        imageEstudiantePromise,
        codigoQREstudiantePromise,
        estadoEstudiantePromise
      ])

      const facultadPromise = await db.facultades.findUnique({
        where: { id_facultad: programa?.id_facultad }
      })

      const estadoPromise = await db.estados.findUnique({
        where: { id_estado: estadoEstudiante?.id_estado }
      })

      const [
        facultad,
        estado
      ] = await Promise.all([
        facultadPromise,
        estadoPromise
      ])

      return {
        ...estudiante, tipo_documento: tipoDocumento?.tipo_documento, sexo: sexo?.sexo, programa: programa?.programa, id_facultad: facultad?.id_facultad, facultad: facultad?.facultad, imageUrl: imageEstudiante?.url_imagen_perfil, codigoUrl: codigoQREstudiante?.url_codigo_qr, estado: estado?.estado
      }
    }))

    return NextResponse.json({
      estudiantes: estudiantesLunchFip,
      estudiantesCount: estudiantesTotal.length
    })
  } catch (error) {
    console.error({ error })

    return NextResponse.json(
      { message: 'Something went wrong.', error },
      { status: 500 }
    )
  }
}

export async function POST (request: Request) {
  try {
    const body = await request.json()

    const {
      id_estudiante: idEstudiante,
      primer_nombre: primerNombre,
      segundo_nombre: segundoNombre,
      primer_apellido: primerApellido,
      segundo_apellido: segundoApellido,
      id_tipo_documento: idTipoDocumento,
      numero_documento: numeroDocumento,
      id_programa: idPrograma,
      correo_institucional: correoInstitucional,
      clave,
      id_sexo: idSexo,
      celular
    } = estudianteSchema.parse(body)

    const rolEstudiante = await db.roles.findUnique({
      where: { rol: 'Estudiante' },
      select: { id_rol: true }
    })

    const dateAux = new Date()
    dateAux.setUTCHours(dateAux.getUTCHours() - 5)
    const currentDate = new Date(dateAux.toString())

    const hashedPassword = await encryptPassword(clave)
    const newEstudiante = await db.estudiantes.create({
      data: {
        id_estudiante: idEstudiante,
        primer_nombre: primerNombre,
        segundo_nombre: segundoNombre,
        primer_apellido: primerApellido,
        segundo_apellido: segundoApellido,
        id_tipo_documento: idTipoDocumento,
        numero_documento: numeroDocumento,
        id_programa: idPrograma,
        correo_institucional: correoInstitucional,
        clave: hashedPassword,
        id_sexo: idSexo,
        celular,
        id_rol: rolEstudiante?.id_rol ?? '',
        createdAt: currentDate,
        updatedAt: currentDate
      }
    })

    const estadoActivo = await db.estados.findFirst({
      where: { estado: 'Activo' },
      select: { id_estado: true }
    })

    await db.estados_Estudiantes.create({
      data: {
        id_estudiante: newEstudiante.id_estudiante,
        id_estado: estadoActivo?.id_estado ?? '',
        createdAt: currentDate,
        updatedAt: currentDate
      }
    })

    const { clave: _, ...estudiante } = newEstudiante

    const qrBase64Str = await QRCode.toDataURL(newEstudiante.id_estudiante, { version: 10 })
    const qrStr = qrBase64Str.split(',')[1]
    const buffer = Buffer.from(qrStr, 'base64')

    const responseCloudinary: UploadApiResponse = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream({ folder: 'codigos_qr_estudiantes' }, (error, result) => {
        if (error !== undefined) reject(error)

        if (result !== undefined) resolve(result)
      }).end(buffer)
    })

    await db.codigos_QR_Estudiantes.create({
      data: {
        id_estudiante: newEstudiante.id_estudiante,
        url_codigo_qr: responseCloudinary.secure_url,
        createdAt: currentDate,
        updatedAt: currentDate
      }
    })

    await db.imagenes_Perfil_Estudiantes.create({
      data: {
        id_estudiante: newEstudiante.id_estudiante,
        url_imagen_perfil: `https://guia.itfip.edu.co/sgacampus/images/dynamic/foto/1/${numeroDocumento}/${numeroDocumento}.jpg?width=1000&cut=1`,
        createdAt: currentDate,
        updatedAt: currentDate
      }
    })

    const [tipoDocumento, sexo, programa, imageEstudiante, codigoQREstudiante, estadoEstudiante] = await Promise.all([
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
        select: { programa: true, id_facultad: true }
      }),
      db.imagenes_Perfil_Estudiantes.findFirst({
        where: { id_estudiante: estudiante.id_estudiante },
        select: { url_imagen_perfil: true }
      }),
      db.codigos_QR_Estudiantes.findFirst({
        where: { id_estudiante: estudiante.id_estudiante },
        select: { url_codigo_qr: true }
      }),
      db.estados_Estudiantes.findFirst({
        where: { id_estudiante: estudiante.id_estudiante },
        select: { id_estado: true }
      })
    ])

    const facultad = await db.facultades.findUnique({
      where: { id_facultad: programa?.id_facultad }
    })

    const estado = await db.estados.findUnique({
      where: { id_estado: estadoEstudiante?.id_estado }
    })

    return NextResponse.json(
      {
        estudiante: { ...estudiante, tipo_documento: tipoDocumento?.tipo_documento, sexo: sexo?.sexo, programa: programa?.programa, id_facultad: facultad?.id_facultad, facultad: facultad?.facultad, imageUrl: imageEstudiante?.url_imagen_perfil, codigoUrl: codigoQREstudiante?.url_codigo_qr, estado: estado?.estado },
        message: '¡Estudiante registrado exitosamente!'
      },
      { status: 201 }
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

export async function PUT (request: Request) {
  try {
    const body = await request.json()

    const {
      id_estudiante: idEstudiante,
      primer_nombre: primerNombre,
      segundo_nombre: segundoNombre,
      primer_apellido: primerApellido,
      segundo_apellido: segundoApellido,
      id_tipo_documento: idTipoDocumento,
      numero_documento: numeroDocumento,
      id_programa: idPrograma,
      celular
    } = estudianteDataSchema.parse(body)

    const currentStudent = await db.estudiantes.findUnique({
      where: { id_estudiante: idEstudiante },
      select: { numero_documento: true, celular: true }
    })

    if (currentStudent?.numero_documento !== numeroDocumento) {
      const existingEstudianteDocumento = await db.estudiantes.findUnique({
        where: { numero_documento: numeroDocumento },
        select: { numero_documento: true }
      })

      if (existingEstudianteDocumento !== null) {
        return NextResponse.json(
          { messsage: '¡El número de documento ya existe en nuestra base de datos!' },
          { status: 400 }
        )
      }
    }

    if (currentStudent?.celular !== celular) {
      const existingEstudianteCelular = await db.estudiantes.findUnique({
        where: { celular },
        select: { celular: true }
      })

      if (existingEstudianteCelular !== null) {
        return NextResponse.json(
          { messsage: '¡El número de celular ya existe en nuestra base de datos!' },
          { status: 400 }
        )
      }
    }

    const dateAux = new Date()
    dateAux.setUTCHours(dateAux.getUTCHours() - 5)
    const currentDate = new Date(dateAux.toString())

    const [updatedEstudiante, updatedImageEstudiante] = await Promise.all([
      db.estudiantes.update({
        data: {
          primer_nombre: primerNombre,
          segundo_nombre: segundoNombre,
          primer_apellido: primerApellido,
          segundo_apellido: segundoApellido,
          id_tipo_documento: idTipoDocumento,
          numero_documento: numeroDocumento,
          id_programa: idPrograma,
          celular,
          updatedAt: currentDate
        },
        where: { id_estudiante: idEstudiante }
      }),
      db.imagenes_Perfil_Estudiantes.update({
        data: {
          url_imagen_perfil: `https://guia.itfip.edu.co/sgacampus/images/dynamic/foto/1/${numeroDocumento}/${numeroDocumento}.jpg?width=1000&cut=1`,
          updatedAt: currentDate
        },
        where: { id_estudiante: idEstudiante }
      })
    ])

    const [tipoDocumento, sexo, programa, imageEstudiante, codigoQREstudiante, estadoEstudiante] = await Promise.all([
      db.tipos_Documento.findUnique({
        where: { id_tipo_documento: updatedEstudiante.id_tipo_documento },
        select: { tipo_documento: true }
      }),
      db.sexos.findUnique({
        where: { id_sexo: updatedEstudiante.id_sexo },
        select: { sexo: true }
      }),
      db.programas.findUnique({
        where: { id_programa: updatedEstudiante.id_programa },
        select: { programa: true, id_facultad: true }
      }),
      db.imagenes_Perfil_Estudiantes.findFirst({
        where: { id_estudiante: updatedImageEstudiante.id_estudiante },
        select: { url_imagen_perfil: true }
      }),
      db.codigos_QR_Estudiantes.findFirst({
        where: { id_estudiante: updatedEstudiante.id_estudiante },
        select: { url_codigo_qr: true }
      }),
      db.estados_Estudiantes.findFirst({
        where: { id_estudiante: updatedEstudiante.id_estudiante },
        select: { id_estado: true }
      })
    ])

    const facultad = await db.facultades.findUnique({
      where: { id_facultad: programa?.id_facultad }
    })

    const estado = await db.estados.findUnique({
      where: { id_estado: estadoEstudiante?.id_estado }
    })

    const { clave: _, ...estudiante } = updatedEstudiante

    return NextResponse.json(
      {
        estudiante: { ...estudiante, tipo_documento: tipoDocumento?.tipo_documento, sexo: sexo?.sexo, programa: programa?.programa, id_facultad: facultad?.id_facultad, facultad: facultad?.facultad, imageUrl: imageEstudiante?.url_imagen_perfil, codigoUrl: codigoQREstudiante?.url_codigo_qr, estado: estado?.estado },
        message: '¡Estudiante actualizado exitosamente!'
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

import { encryptPassword } from '@/libs/bcrypt'
import { db } from '@/libs/prismaDB'
import { estudianteDataSchema, estudianteSchema } from './schema'
import { NextResponse } from 'next/server'
import { type UploadApiResponse, v2 as cloudinary } from 'cloudinary'
import QRCode from 'qrcode'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

export async function GET () {
  try {
    const estudiantes = await db.estudiantes.findMany()

    return NextResponse.json(estudiantes)
  } catch (error) {
    console.error({ error })

    return NextResponse.json(
      { message: 'Something went wrong.', error },
      { status: 500 }
    )
  }
}

export async function POST (request: Request) {
  const body = await request.json()

  try {
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

    const roles = await db.roles.findMany({
      where: { rol: 'Estudiante' }
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
        id_rol: roles[0].id_rol,
        createdAt: currentDate,
        updatedAt: currentDate
      }
    })

    const estados = await db.estados.findMany()

    await db.estados_Estudiantes.create({
      data: {
        id_estudiante: newEstudiante.id_estudiante,
        id_estado: estados[0].id_estado,
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

    const tipoDocumento = await db.tipos_Documento.findUnique({
      where: { id_tipo_documento: newEstudiante.id_tipo_documento }
    })

    const sexo = await db.sexos.findUnique({
      where: { id_sexo: newEstudiante.id_sexo }
    })

    const programa = await db.programas.findUnique({
      where: { id_programa: newEstudiante.id_programa }
    })

    const imageEstudiante = await db.imagenes_Perfil_Estudiantes.findFirst({
      where: { id_estudiante: estudiante.id_estudiante }
    })

    const codigoQREstudiante = await db.codigos_QR_Estudiantes.findFirst({
      where: { id_estudiante: estudiante.id_estudiante }
    })

    return NextResponse.json(
      {
        estudiante: { ...estudiante, tipo_documento: tipoDocumento?.tipo_documento, sexo: sexo?.sexo, programa: programa?.programa, imageUrl: imageEstudiante?.url_imagen_perfil, codigoUrl: codigoQREstudiante?.url_codigo_qr },
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
  const body = await request.json()

  try {
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
      where: { id_estudiante: idEstudiante }
    })

    if (currentStudent?.numero_documento !== numeroDocumento) {
      const existingEstudianteDocumento = await db.estudiantes.findUnique({
        where: { numero_documento: numeroDocumento }
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
        where: { celular }
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

    const updatedEstudiante = await db.estudiantes.update({
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
    })

    const tipoDocumento = await db.tipos_Documento.findUnique({
      where: { id_tipo_documento: updatedEstudiante.id_tipo_documento }
    })

    const sexo = await db.sexos.findUnique({
      where: { id_sexo: updatedEstudiante.id_sexo }
    })

    const programa = await db.programas.findUnique({
      where: { id_programa: updatedEstudiante.id_programa }
    })

    const imageEstudiante = await db.imagenes_Perfil_Estudiantes.findFirst({
      where: { id_estudiante: updatedEstudiante.id_estudiante }
    })

    const codigoQREstudiante = await db.codigos_QR_Estudiantes.findFirst({
      where: { id_estudiante: updatedEstudiante.id_estudiante }
    })

    const { clave: _, ...estudiante } = updatedEstudiante

    return NextResponse.json(
      {
        estudiante: { ...estudiante, tipo_documento: tipoDocumento?.tipo_documento, sexo: sexo?.sexo, programa: programa?.programa, imageUrl: imageEstudiante?.url_imagen_perfil, codigoUrl: codigoQREstudiante?.url_codigo_qr },
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

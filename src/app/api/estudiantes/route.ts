import { encryptPassword } from '@/libs/bcrypt'
import { db } from '@/libs/prismaDB'
import { estudianteSchema } from './schema'
import { NextResponse } from 'next/server'
import { type UploadApiResponse, v2 as cloudinary } from 'cloudinary'
import QRCode from 'qrcode'
import { clerkClient } from '@clerk/nextjs/server'

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
      celular,
      createdUserId
    } = estudianteSchema.parse(body)

    const dateAux = new Date()
    dateAux.setUTCHours(dateAux.getUTCHours() - 5)
    const currentDate = new Date(dateAux.toString())

    const hashedPassword = await encryptPassword(clave)
    const newEstudiante = await db.estudiantes.create({
      data: {
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

    const qrBase64Str = await QRCode.toDataURL(newEstudiante.id_estudiante, { version: 3 })
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

    const params = {
      firstName: `${primerNombre} ${segundoNombre !== '' ? segundoNombre : ''}`,
      lastName: `${primerApellido} ${segundoApellido !== '' ? segundoApellido : ''}`
    }

    if (createdUserId !== null) {
      await clerkClient.users.updateUser(createdUserId, params)
    }

    return NextResponse.json(
      { estudiante, message: '¡Estudiante registrado exitosamente!' },
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

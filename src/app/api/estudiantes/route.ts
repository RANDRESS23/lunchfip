import { encryptPassword } from '@/libs/bcrypt'
import { db } from '@/libs/prismaDB'
import { estudianteSchema } from './schema'
import { NextResponse } from 'next/server'
import { PythonShell, type Options } from 'python-shell'
import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs'
import path from 'path'

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
      clave_2: clave2,
      id_sexo: idSexo,
      celular
    } = estudianteSchema.parse(body)

    const existingEstudianteDocumento = await db.estudiantes.findUnique({
      where: { numero_documento: numeroDocumento }
    })

    if (existingEstudianteDocumento !== null) {
      return NextResponse.json(
        { messsage: 'Document already exists' },
        { status: 400 }
      )
    }

    const existingEstudianteEmail = await db.estudiantes.findUnique({
      where: { correo_institucional: correoInstitucional }
    })

    if (existingEstudianteEmail !== null) {
      return NextResponse.json(
        { messsage: 'Email already exists' },
        { status: 400 }
      )
    }

    if (clave !== clave2) {
      return NextResponse.json(
        { messsage: 'Passwords do not match' },
        { status: 400 }
      )
    }

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
        celular
      }
    })

    const estados = await db.estados.findMany()

    await db.estados_Estudiantes.create({
      data: {
        id_estudiante: newEstudiante.id_estudiante,
        id_estado: estados[0].id_estado
      }
    })

    const { clave: _, ...estudiante } = newEstudiante

    const tempImagePath = path.join(process.cwd(), 'src/app/api/estudiantes/_python/')

    const options: Options = {
      mode: 'text',
      pythonPath: 'python',
      scriptPath: tempImagePath,
      args: [body.numero_documento, `${tempImagePath}/_codigosQR`]
    }

    await PythonShell.run('GenQR.py', options)

    const result = await cloudinary.uploader.upload(`${tempImagePath}/_codigosQR/${body.numero_documento}.png`)

    await db.codigos_QR_Estudiantes.create({
      data: {
        id_estudiante: newEstudiante.id_estudiante,
        url_codigo_qr: result.secure_url
      }
    })

    fs.readdirSync(`${tempImagePath}/_codigosQR`).forEach((file) => {
      const filePath = path.join(`${tempImagePath}/_codigosQR`, file)
      fs.unlinkSync(filePath)
    })

    return NextResponse.json(
      { estudiante, message: 'Estudiante created successfully' },
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

// export async function PATCH (request: Request) {
//   const body = await request.json()
//   const id = body.userId

//   try {
//     const userDeleted = await db.user.update({
//       data: { disabled: true },
//       where: { id }
//     })

//     if (!userDeleted) {
//       return NextResponse.json({
//         message: 'No se pudo deshabilitar el usuario. Intente más tarde.'
//       })
//     }

//     return NextResponse.json(
//       {
//         message: `El usuario ${userDeleted.firstName} ${userDeleted.lastName} ha sido deshabilitado.`
//       },
//       { status: 201 }
//     )
//   } catch (error) {
//     console.error({ error })

//     return NextResponse.json(
//       { message: 'Something went wrong.', error },
//       { status: 500 }
//     )
//   }
// }

import { encryptPassword } from '@/libs/bcrypt'
import { db } from '@/libs/prismaDB'
import { empleadosSchema } from './shema'
import { NextResponse } from 'next/server'

export async function GET () {
  try {
    const empleados = await db.empleados.findMany()

    return NextResponse.json(empleados)
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
      correo,
      clave,
      clave_2: clave2,
      id_sexo: idSexo,
      celular
    } = empleadosSchema.parse(body)

    const existingEmpleadoDocumento = await db.empleados.findUnique({
      where: { numero_documento: numeroDocumento }
    })

    if (existingEmpleadoDocumento !== null) {
      return NextResponse.json(
        { messsage: '¡El número de documento ya existe en nuestra base de datos!' },
        { status: 400 }
      )
    }

    const existingEmpleadoEmail = await db.empleados.findUnique({
      where: { correo }
    })

    if (existingEmpleadoEmail !== null) {
      return NextResponse.json(
        { messsage: '¡El correo electrónico ya existe en nuestra base de datos!' },
        { status: 400 }
      )
    }

    if (clave !== clave2) {
      return NextResponse.json(
        { messsage: '¡Las contraseñas no coinciden!' },
        { status: 400 }
      )
    }

    const hashedPassword = await encryptPassword(clave)
    const newEmpleado = await db.empleados.create({
      data: {
        primer_nombre: primerNombre,
        segundo_nombre: segundoNombre,
        primer_apellido: primerApellido,
        segundo_apellido: segundoApellido,
        id_tipo_documento: idTipoDocumento,
        numero_documento: numeroDocumento,
        correo,
        clave: hashedPassword,
        id_sexo: idSexo,
        celular
      }
    })

    const { clave: _, ...empleado } = newEmpleado

    return NextResponse.json(
      { empleado, message: '¡Empleado registrado exitosamente!' },
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

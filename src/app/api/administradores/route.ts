import { encryptPassword } from '@/libs/bcrypt'
import { db } from '@/libs/prismaDB'
import { administradoresSchema } from './schema'
import { NextResponse } from 'next/server'

export async function GET () {
  try {
    const administradores = await db.administradores.findMany()
    const emailsAdministradores = administradores.map((admin) => admin.correo)

    return NextResponse.json({ emailsAdministradores })
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
  const CREATE_ADMIN_IS_POSIBLE = false

  try {
    if (!CREATE_ADMIN_IS_POSIBLE) {
      return NextResponse.json(
        { messsage: '¡Por el momento no se pueden registrar más administradores!' },
        { status: 400 }
      )
    }

    const {
      id_administrador: idAdministrador,
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
    } = administradoresSchema.parse(body)

    const existingAdministradorDocumento = await db.administradores.findUnique({
      where: { numero_documento: numeroDocumento }
    })

    if (existingAdministradorDocumento !== null) {
      return NextResponse.json(
        { messsage: '¡El número de documento ya existe en nuestra base de datos!' },
        { status: 400 }
      )
    }

    const existingAdministradorEmail = await db.administradores.findUnique({
      where: { correo },
      select: { correo: true }
    })

    if (existingAdministradorEmail !== null) {
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

    const [rolAdministrador] = await db.roles.findMany({
      where: { rol: 'Administrador' }
    })

    const dateAux = new Date()
    dateAux.setUTCHours(dateAux.getUTCHours() - 5)
    const currentDate = new Date(dateAux.toString())

    const hashedPassword = await encryptPassword(clave)
    const newAdministrador = await db.administradores.create({
      data: {
        id_administrador: idAdministrador,
        primer_nombre: primerNombre,
        segundo_nombre: segundoNombre,
        primer_apellido: primerApellido,
        segundo_apellido: segundoApellido,
        id_tipo_documento: idTipoDocumento,
        numero_documento: numeroDocumento,
        correo,
        clave: hashedPassword,
        id_sexo: idSexo,
        celular,
        id_rol: rolAdministrador?.id_rol ?? '',
        createdAt: currentDate,
        updatedAt: currentDate
      }
    })

    const { clave: _, ...administrador } = newAdministrador

    return NextResponse.json(
      { administrador, message: '¡Administrador registrado exitosamente!' },
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

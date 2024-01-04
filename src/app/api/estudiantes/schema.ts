import { z } from 'zod'

const emailRegex = /^[A-Za-z0-9._%+-]+@itfip\.edu\.co$/

export const estudianteSchema = z.object({
  primer_nombre: z.string(),
  segundo_nombre: z.string().optional(),
  primer_apellido: z.string(),
  segundo_apellido: z.string().optional(),
  id_tipo_documento: z.string(),
  numero_documento: z.string(),
  id_programa: z.string(),
  correo_institucional: z.string().refine(value => emailRegex.test(value), {
    message: 'Debes usar un correo institucional. (@itfip.edu.co)'
  }),
  clave: z.string(),
  clave_2: z.string(),
  id_sexo: z.string(),
  celular: z.string()
}).refine(data => data.clave === data.clave_2, {
  message: 'Las contraseñas no coinciden.',
  path: ['clave_2']
})

import { z } from 'zod'

const nameRegex = /^[A-Za-záéíóúÁÉÍÓÚñÑüÜ\s]+$/
const nameOptionalRegex = /^$|^[A-Za-záéíóúÁÉÍÓÚñÑüÜ\s]+$/
const emailRegex = /^[A-Za-z0-9._%+-]+@itfip\.edu\.co$/
const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/

export const estudianteSchema = z.object({
  primer_nombre: z.string().refine(value => nameRegex.test(value), {
    message: 'El primer nombre solo puede contener letras.'
  }),
  segundo_nombre: z.string().optional().refine((value = '') => nameOptionalRegex.test(value), {
    message: 'El segundo nombre solo puede contener letras.'
  }),
  primer_apellido: z.string().refine(value => nameRegex.test(value), {
    message: 'El primer apellido solo puede contener letras.'
  }),
  segundo_apellido: z.string().optional().refine((value = '') => nameOptionalRegex.test(value), {
    message: 'El segundo apellido solo puede contener letras.'
  }),
  id_tipo_documento: z.string(),
  numero_documento: z.string().min(7, {
    message: 'El número de documento debe tener al menos 7 caracteres.'
  }).max(12, {
    message: 'El número de documento debe tener máximo 12 caracteres.'
  }),
  id_programa: z.string(),
  correo_institucional: z.string().refine(value => emailRegex.test(value), {
    message: 'Debes usar un correo institucional. (@itfip.edu.co)'
  }),
  clave: z.string().refine(value => passwordRegex.test(value), {
    message: 'La contraseña debe tener al menos 8 caracteres, una letra mayúscula, una letra minúscula, un número y un carácter especial.'
  }),
  clave_2: z.string(),
  id_sexo: z.string(),
  celular: z.string().length(10, {
    message: 'El número de celular debe tener 10 caracteres.'
  })
}).required().refine(data => data.clave === data.clave_2, {
  message: 'Las contraseñas no coinciden.',
  path: ['clave_2']
})

export const signInSchema = z.object({
  correo_institucional: z.string().refine(value => emailRegex.test(value), {
    message: 'Debes usar un correo institucional. (@itfip.edu.co)'
  }),
  clave: z.string().refine(value => passwordRegex.test(value), {
    message: 'La contraseña debe tener al menos 8 caracteres, una letra mayúscula, una letra minúscula, un número y un carácter especial.'
  })
})

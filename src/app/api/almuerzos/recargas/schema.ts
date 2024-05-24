import { z } from 'zod'

export const recargasSchema = z.object({
  id_estudiante: z.string().optional(),
  id_empleado: z.string().optional(),
  numero_documento: z.string().min(7, {
    message: 'El número de documento debe tener al menos 7 caracteres.'
  }).max(12, {
    message: 'El número de documento debe tener máximo 12 caracteres.'
  }).optional(),
  new_saldo: z.number().min(500, {
    message: 'El monto mínimo de recarga es de $500'
  }).optional()
})

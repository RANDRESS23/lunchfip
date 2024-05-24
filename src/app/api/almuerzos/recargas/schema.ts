import { z } from 'zod'

export const recargasSchema = z.object({
  id_estudiante: z.string(),
  id_empleado: z.string(),
  new_saldo: z.number().min(500, {
    message: 'El monto mínimo de recarga es de $500'
  })
})

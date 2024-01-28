import { z } from 'zod'

export const entregasSchema = z.object({
  id_estudiante_reserva: z.string(),
  id_estudiante: z.string(),
  id_empleado: z.string(),
  id_almuerzo: z.string()
})

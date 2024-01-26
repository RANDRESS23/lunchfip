import { z } from 'zod'

export const reservasSchema = z.object({
  id_estudiante: z.string(),
  id_empleado: z.string(),
  id_almuerzo: z.string()
})

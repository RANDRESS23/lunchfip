import { z } from 'zod'

export const programaSchema = z.object({
  programa: z.string(),
  id_facultad: z.string()
})

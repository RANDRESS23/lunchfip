import { z } from 'zod'

export const sexoSchema = z.object({
  sexo: z.string()
})

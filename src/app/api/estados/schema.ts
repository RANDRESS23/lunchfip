import { z } from 'zod'

export const estadoSchema = z.object({
  estado: z.string()
})

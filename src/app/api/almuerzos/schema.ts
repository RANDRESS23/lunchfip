import { z } from 'zod'

export const totalLunchesSchema = z.object({
  total_almuerzos: z.string().refine(value => Number(value) > 0, {
    message: 'La cantidad de almuerzos debe ser mayor a 0'
  }).refine(value => Number(value) <= 2000, {
    message: 'La cantidad de almuerzos debe ser menor o igual a 2000'
  }),
  nextDate: z.string()
})

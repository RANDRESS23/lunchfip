import { z } from 'zod'

export const totalLunchesSchema = z.object({
  total_almuerzos: z.string().refine(value => Number(value) > 0, {
    message: 'La cantidad de almuerzos debe ser mayor a 0'
  }).refine(value => Number(value) <= 500, {
    message: 'La cantidad de almuerzos debe ser menor o igual a 500'
  }),
  nextDate: z.date().min(new Date(), {
    message: 'La fecha debe ser mayor o igual a la fecha actual'
  })
})

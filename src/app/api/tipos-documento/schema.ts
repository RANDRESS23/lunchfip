import { z } from 'zod'

export const tipoDocumentoSchema = z.object({
  tipo_documento: z.string()
})

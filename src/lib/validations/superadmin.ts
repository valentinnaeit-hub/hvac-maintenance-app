import { z } from 'zod'

export const createSuperadminSchema = z.object({
  email: z.string().email('Adresa de email invalida'),
  password: z.string().min(8, 'Parola trebuie sa aiba minim 8 caractere'),
})

export type CreateSuperadminInput = z.infer<typeof createSuperadminSchema>

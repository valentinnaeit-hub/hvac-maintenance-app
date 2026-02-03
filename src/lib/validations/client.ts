import { z } from 'zod'

export const clientSchema = z.object({
  numePrenume: z.string().min(1, 'Numele este obligatoriu'),
  telefon: z.string().min(1, 'Numarul de telefon este obligatoriu'),
  zona: z.string().min(1, 'Zona este obligatorie'),
  adresa: z.string().min(1, 'Adresa este obligatorie'),
  serieEchipament: z.string().min(1, 'Seria echipamentului este obligatorie'),
  codISCIR: z.string().min(1, 'Codul ISCIR este obligatoriu'),
  modelEchipament: z.string().min(1, 'Modelul echipamentului este obligatoriu'),
})

export type ClientInput = z.infer<typeof clientSchema>

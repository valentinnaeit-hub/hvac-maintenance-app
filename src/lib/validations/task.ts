import { z } from 'zod'

export const createTaskFormSchema = z.object({
  denumire: z.string().min(1, 'Denumirea este obligatorie'),
})

export const createTaskApiSchema = z.object({
  denumire: z.string().min(1, 'Denumirea este obligatorie'),
  data: z.string().pipe(z.coerce.date()),
})

export const updateTaskSchema = z.object({
  denumire: z.string().min(1, 'Denumirea este obligatorie').optional(),
  data: z.string().pipe(z.coerce.date()).optional(),
  efectuat: z.boolean().optional(),
  inGarantie: z.boolean().optional(),
  duritateApa: z.string().optional(),
  defectiune: z.string().optional(),
  remedieri: z.string().optional(),
  pieseInlocuite: z.string().optional(),
  alteComentarii: z.string().optional(),
})

export type CreateTaskFormInput = z.infer<typeof createTaskFormSchema>
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>

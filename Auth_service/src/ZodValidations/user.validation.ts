import * as z from "zod/v4"

const zodUserCreateValidation = z.object({
    display_name: z.string().min(1).max(50),
    email: z.string().email(),
    password: z.string().min(8).max(50),
    role: z.enum(['ADMIN', 'USER'])
})

const zodUserLoginValidation = z.object({
    email: z.string().email(),
    password: z.string()
})
export { zodUserCreateValidation, zodUserLoginValidation }
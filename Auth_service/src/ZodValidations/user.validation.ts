import { varchar } from "drizzle-orm/mysql-core"
import * as z from "zod/v4"

const zodUserCreateValidation = z.object({
    display_name: z.string().min(1).max(50),
    email: z.string().email(),
    password: z.string().min(8).max(50),
    role: z.enum(['ADMIN', 'USER'])
})

const zodOrganizationCreateValidation = z.object({
    org_name: z.string().min(1)
})

const zodUserLoginValidation = z.object({
    email: z.string().email(),
    password: z.string(),
    otp: z.string(),
})

const zodUserMFAEnableValidation = z.object({
    token: z.string(),
    email: z.string().email(),
    password: z.string().min(8).max(50),
})
export {
    zodUserCreateValidation,
    zodUserLoginValidation,
    zodUserMFAEnableValidation,
    zodOrganizationCreateValidation
}
import * as z from "zod"

const createCourseModuleZodValidation = z.object({
    title: z.string({ message: "Title is required" }),
    description: z.string({ message: "Description is required" }),
    completion_percentage: z.string().transform((e) => parseInt(e, 10))
})

export { createCourseModuleZodValidation }
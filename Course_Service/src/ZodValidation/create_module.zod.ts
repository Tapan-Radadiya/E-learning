import * as z from "zod"

const createCourseModuleZodValidation = z.object({
    title: z.string({ message: "Title is required" }),
    description: z.string({ message: "Description is required" }),
    completion_percentage: z.number({ message: "Completion Percentage is required" })
})

export { createCourseModuleZodValidation }
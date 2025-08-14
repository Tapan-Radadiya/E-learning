import * as z from "zod"

const createCourseZodValidation = z.object({
    title: z.string({ message: "Title is required" }),
    description: z.string({ message: "Description is required" })
})

export { createCourseZodValidation }
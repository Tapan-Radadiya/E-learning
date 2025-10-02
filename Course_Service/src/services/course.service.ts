import { ApiResult, ApiResultInterface, ExtractFormData, validateWithZod } from "../utils/comman"

import { Request } from "express";
import { createCourseZodValidation } from "../ZodValidation/create_course.zod";
import { DeleteFileFromS3 } from "../utils/awsS3.utils";
import { db } from "../config/connectDb";
import { tbl_courses } from "../db";
import { eq } from "drizzle-orm";

const createCourseService = async (req: Request) => {
    const { fields, files } = await ExtractFormData(req)
    const isValid = validateWithZod(createCourseZodValidation, fields)
    if (!isValid) {
        return ApiResult({ message: "Invalid Data", data: isValid, statusCode: 400 })
    }
    try {
        const addNewCourse = await db
            .insert(tbl_courses)
            .values({
                title: fields.title,
                description: fields.description,
                thumbnail_url: files[0]
            })
        if (addNewCourse) {
            return ApiResult({ message: "New Course Created", data: addNewCourse, statusCode: 201 })
        } else {
            return ApiResult({ message: "Error Creating Course", statusCode: 500 })
        }
    } catch (error: any) {
        console.log('error->', error)
        return ApiResult({ message: "Internal Server Error", err: error, statusCode: 500 })
    }
}

const getCourseDetails = async (courseId: string): Promise<ApiResultInterface> => {
    let course;
    if (courseId === 'all') {
        course = await db.query.tbl_courses.findMany({})
    } else {
        course = await db.query.tbl_courses.findFirst({
            where: eq(tbl_courses.id, courseId)
        })
        if (!course) {
            return ApiResult({ message: "No Course Found", statusCode: 404 })
        }
    }
    return ApiResult({ message: "Data Fetched", data: course, statusCode: 200 })
}

const deleteCourseService = async (courseId: string) => {
    try {
        const response = await db.query.tbl_courses.findFirst({ where: eq(tbl_courses.id, courseId) })
        if (response) {
            await DeleteFileFromS3(response.thumbnail_url)
            await db.delete(tbl_courses).where(eq(tbl_courses.id, response.id))
            return ApiResult({ message: "Course Deleted Successfully", statusCode: 200 })
        } else {
            return ApiResult({ message: "Unable To Find Course", statusCode: 404 })
        }
    } catch (error: any) {
        console.log('error->', error)
        return ApiResult({ message: "Internal Server Error", err: error })
    }
}

const updateCourseData = async (req: Request) => {
    const { courseId } = req.params
    const { fields, files } = await ExtractFormData(req)

    const isValid = validateWithZod(createCourseZodValidation, fields)
    if (!isValid) {
        return ApiResult({ message: "Invalid Data", data: isValid, statusCode: 400 })
    }
    try {
        const courseData = await db.query.tbl_courses.findFirst({ where: eq(tbl_courses.id, courseId) })
        if (courseData) {
            const data = await DeleteFileFromS3(courseData.thumbnail_url)
            if (data) {
                await db.update(tbl_courses).set({
                    title: fields.title,
                    description: fields.description,
                    thumbnail_url: files[0]
                }).where(eq(tbl_courses.id, courseId))
                return ApiResult({ message: "Course Updated Successfully", statusCode: 200 })
            }
            else {
                return ApiResult({ message: "Unable To Update Course " })
            }
        } else {
            return ApiResult({ message: "Unable To Find Course", statusCode: 404 })
        }
    } catch (error: any) {
        console.log('error->', error)
        return ApiResult({ message: "Internal Server Error", err: error })
    }
}
export { createCourseService, deleteCourseService, updateCourseData, getCourseDetails }
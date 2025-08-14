import { ApiResult, ApiResultInterface, DeleteFileFromS3, ExtractFormData, validateWithZod } from "../utils/comman"
import { Request } from "express";
import { createCourseZodValidation } from "../ZodValidation/create_course.zod";
import { courses } from "../models/course.schema"

const createCourseService = async (req: Request) => {
    const { fields, files } = await ExtractFormData(req)
    const isValid = validateWithZod(createCourseZodValidation, fields)
    if (!isValid) {
        return ApiResult({ message: "Invalid Data", data: isValid, statusCode: 400 })
    }
    try {
        const addNewCourse = await courses.create({
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
        return ApiResult({ message: "Internal Server Error", err: error })
    }
}

const getCourseDetails = async (courseId: string): Promise<ApiResultInterface> => {
    let course;
    if (courseId === 'all') {
        course = await courses.findAll({})
    } else {
        course = await courses.findOne({ where: { id: courseId }, raw: true })
    }
    return ApiResult({ message: "Data Fetched", data: course, statusCode: 200 })
}

const deleteCourseService = async (courseId: string) => {

    try {
        const response = await courses.findOne({ where: { id: courseId } })
        if (response) {
            await DeleteFileFromS3(response.dataValues.thumbnail_url)
            await response.destroy()
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
        const courseData = await courses.findOne({ where: { id: courseId } })
        if (courseData) {
            const data = await DeleteFileFromS3(courseData.dataValues.thumbnail_url)
            if (data) {
                await courseData.update({
                    title: fields.title,
                    description: fields.description,
                    thumbnail_url: files[0]
                }, { where: { id: courseId } })
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
import { Request } from "express";
import { ApiResult, ApiResultInterface, DeleteFileFromS3, ExtractFormData, validateWithZod } from "../utils/comman";
import { courses } from "../models/course.schema";
import { course_modules } from "../models/module.schema";
import { createCourseModuleZodValidation } from "../ZodValidation/create_module.zod";

const AddCourseModuleService = async (req: Request): Promise<ApiResultInterface> => {
    const { courseId } = req.params
    const isValidCourse = await courses.findOne({ where: { id: courseId } })
    if (!isValidCourse) {
        return ApiResult({ statusCode: 404, message: "Course not found" })
    }
    const { fields, files } = await ExtractFormData(req, `moduleVideo/${courseId}`)
    const isValid = validateWithZod(createCourseModuleZodValidation, fields)
    if (!isValid) {
        return ApiResult({ message: "Invalid Data", data: isValid, statusCode: 400 })
    }
    console.log('fields->',fields)
    const course_moduleData = await course_modules.create({
        course_id: courseId,
        video_url: files[0],
        title: fields.title,
        description: fields.description
    })
    if (course_moduleData) {
        return ApiResult({ statusCode: 201, message: "Module Created Successfully" })
    }
    else {
        return ApiResult({ statusCode: 403, message: "Error Creating Module Try After SomeTime" })
    }
}

const removeCourseModuleService = async (moduleId: string): Promise<ApiResultInterface> => {
    const isModuleExist = await course_modules.findOne({ where: { id: moduleId } })
    try {
        if (isModuleExist) {
            await DeleteFileFromS3(isModuleExist.dataValues.video_url)
            await isModuleExist.destroy()
            return ApiResult({ statusCode: 200, message: "Module Deleted Successfully" })
        }
        else {
            return ApiResult({ statusCode: 409, message: "Error Deleting Module" })
        }
    } catch (error) {
        return ApiResult({ statusCode: 403, message: "Error Removing Module Try After SomeTime" })
    }
}

const getAllCourseModuleService = async (courseId: string): Promise<ApiResultInterface> => {
    const isValidCourse = await courses.findOne({ where: { id: courseId } })
    if (!isValidCourse) {
        return ApiResult({ statusCode: 404, message: "Cannot Found Course" })
    }
    try {
        const allCourses = await course_modules.findAll({ where: { course_id: isValidCourse.dataValues.id } })
        return ApiResult({ statusCode: 200, message: "Data Fetched", data: allCourses })
    } catch (error) {
        return ApiResult({ statusCode: 403, message: "Error Fetching Modules " })
    }
}


const updateCourseModuleService = async (req: Request): Promise<ApiResultInterface> => {
    const { moduleId } = req.params
    const isModuleExists = await course_modules.findOne({ where: { id: moduleId } })
    if (isModuleExists) {
        const { fields, files } = await ExtractFormData(req, `moduleVideo/${isModuleExists.dataValues.course_id}`)
        const isValid = validateWithZod(createCourseModuleZodValidation, fields)
        if (!isValid) {
            return ApiResult({ message: "Invalid Data", data: isValid, statusCode: 400 })
        }
        const courseModuleData = await course_modules.update({
            title: fields.title,
            description: fields.description,
            video_url: files[0]
        }, { where: { id: moduleId } })

        if (courseModuleData) {
            await DeleteFileFromS3(isModuleExists.dataValues.video_url)
            return ApiResult({ message: "Module Updated Successfully", statusCode: 200 })
        } else {
            return ApiResult({ message: "Error Updating Module", statusCode: 409 })
        }
    }
    else {
        return ApiResult({ statusCode: 404, message: "Unable To Find Module" })
    }
}

const getModuleDetailsService = async (moduleId: string): Promise<ApiResultInterface> => {

    try {
        const moduleDetails = await course_modules.findOne({
            where: { id: moduleId },
            attributes: ['id', 'title', 'description', 'completion_percentage', 'course_id'],
            raw: true
        })
        if (moduleDetails) {
            return ApiResult({ statusCode: 200, message: "Data Fetched", data: moduleDetails })
        } else {
            return ApiResult({ statusCode: 409, message: "Error Fetching Data" })
        }
    } catch (error) {
        return ApiResult({ statusCode: 500, message: "Internal Server Error" })
    }
}
export { AddCourseModuleService, removeCourseModuleService, getAllCourseModuleService, updateCourseModuleService, getModuleDetailsService }
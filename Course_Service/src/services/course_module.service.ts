import { Request } from "express";
import formidable, { Fields, Files } from "formidable";
import { HLS_DIR_PATH, HLS_PUBLIC_PATH, TEMP_UPLOAD_PATH } from "../constants";
import { courses } from "../models/course.schema";
import { course_modules } from "../models/module.schema";
import { DeleteFileFromS3 } from "../utils/awsS3.utils";
import { ApiResult, ApiResultInterface, ExtractFormData, formidableFieldsFormat, validateWithZod } from "../utils/comman";
import { initVideoUploadWorkerProcess } from "../utils/workerProcessInit.utils";
import { createCourseModuleZodValidation } from "../ZodValidation/create_module.zod";
import { getRedisClient } from "../config/connectRedis.config";



const AddCourseModuleService = async (req: Request): Promise<ApiResultInterface> => {
    try {

        let moduleId
        const { courseId } = req.params
        const isValidCourse = await courses.findOne({ where: { id: courseId } })
        if (!isValidCourse) {
            return ApiResult({ statusCode: 404, message: "Course not found" })
        }

        const form = formidable({
            allowEmptyFiles: false,
            multiples: false,
            uploadDir: TEMP_UPLOAD_PATH,
            keepExtensions: true,
        })


        const [fieldsData, files]: [Fields, Files] = await form.parse(req)
        if (Object.keys(files).length === 0) {
            return ApiResult({ message: "Please Provide Module Video", statusCode: 409 })
        }

        const fields = formidableFieldsFormat(fieldsData)

        const isValid = validateWithZod(createCourseModuleZodValidation, fields)

        if (!isValid.success) {
            return ApiResult({ message: "Invalid Data", data: isValid, statusCode: 400 })
        }

        const course_moduleData = await course_modules.create({
            course_id: courseId,
            video_url: files?.video?.[0].filepath ?? '', // Video Path Stored In Memory 
            title: fields.title,
            description: fields.description,
            completion_percentage: fields.completion_percentage
        })

        moduleId = course_moduleData.getDataValue("id")
        if (Array.isArray(files.video) && files.video.length > 0) {
            // Adding Data In Worker Process
            await initVideoUploadWorkerProcess({
                courseId,
                moduleId,
                files
            })
        }

        if (course_moduleData) {
            return ApiResult({ statusCode: 201, message: "Module Created Successfully" })
        }
        else {
            return ApiResult({ statusCode: 403, message: "Error Creating Module Try After SomeTime" })
        }
    } catch (error) {
        return ApiResult({ statusCode: 500, message: "Internal Server Error" })
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
            attributes: ['id', 'title', 'description', 'completion_percentage', 'course_id', 'video_url', 'is_module_live'],
            raw: true
        })
        if (moduleDetails) {
            return ApiResult({ statusCode: 200, message: "Data Fetched", data: moduleDetails })
        } else {
            return ApiResult({ statusCode: 409, message: "Error Fetching Data" })
        }
    } catch (error) {
        console.log('error-->', error);
        return ApiResult({ statusCode: 500, message: "Internal Server Error" })
    }
}

const getM3U8FileDetailsService = async (moduleId: string): Promise<ApiResultInterface> => {
    const redisClient = getRedisClient()
    const moduleRedisData = await redisClient?.hgetall(`module-${moduleId}`) ?? {}
    if (Object.keys(moduleRedisData).length > 0) {
        const userReqTime = Date.now()
        const response = {
            videoUrl: `${HLS_PUBLIC_PATH}/${moduleId}/index.m3u8`,
            videoType: 'application/x-mpegURL'
        }
        return ApiResult({ statusCode: 200, message: "Data Fetched", data: response })
    } else {
        const data = await getModuleDetailsService(moduleId)
        if (data.statusCode === 200) {
            // send Frontend s3 image Url
            // data.data.video_url
            const response = {
                videoUrl: `${process.env.AWS_CLOUD_FRONT_URL}${data.data.video_url}`,
                videoType: 'video/mp4'
            }
            return ApiResult({ statusCode: 200, message: "Data Fetched", data: response })
        } else {
            return ApiResult({ statusCode: 409, message: "Error Fetching Data" })
        }
    }
}
export {
    AddCourseModuleService,
    getAllCourseModuleService,
    getModuleDetailsService,
    removeCourseModuleService,
    updateCourseModuleService,
    getM3U8FileDetailsService
};

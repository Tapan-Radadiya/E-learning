import { Request } from "express";
import { ApiResult, ApiResultInterface, ExtractFormData, formidableFieldsFormat, validateWithZod } from "../utils/comman";
import { courses } from "../models/course.schema";
import { course_modules } from "../models/module.schema";
import { createCourseModuleZodValidation } from "../ZodValidation/create_module.zod";
import formidable, { Files, Fields } from "formidable";
import * as path from "path"
import { TEMP_UPLOAD_PATH, UPLOAD_PATH, UPLOAD_VIDEO_TASK, WORKER_PROCESS_MESSAGE } from "../constants";
import { Worker } from "worker_threads";
import { DeleteFileFromS3 } from "../utils/awsS3.utils";
import { getRedisClient } from "../config/connectRedis.config";
import getVideoDurationInSeconds from "get-video-duration";

const AddCourseModuleService = async (req: Request): Promise<ApiResultInterface> => {

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
        video_url: files?.video?.[0].filepath ?? '',
        title: fields.title,
        description: fields.description,
        completion_percentage: fields.completion_percentage
    })

    moduleId = course_moduleData.getDataValue("id")
    if (Array.isArray(files.video) && files.video.length > 0) {
        const redisClient = getRedisClient()


        await redisClient?.hset(`module-${moduleId}`, {
            localVideoUrl: files?.video?.[0].filepath,
        })

        console.log("Worker Process Started . . .")

        const worker = new Worker(
            path.join(__dirname, "../worker_scripts/download_module_video.js")
        )

        const mimeType: string[] = files.video[0].mimetype?.split("/") ?? []
        const workerFileData = {
            oldFilePath: files.video[0].filepath,
            newFilePath: `${UPLOAD_PATH}/${moduleId}.${mimeType[mimeType?.length - 1]}`,
            moduleId: moduleId,
            course_id: courseId,
            mimeType: files.video[0].mimetype,
            fileName: files.video[0].originalFilename
        }

        worker.postMessage({ task: UPLOAD_VIDEO_TASK, data: workerFileData })

        worker.on("error", (err) => {
            console.log('err-->', err);
        })

        worker.on("message", async (message) => {
            if (message === WORKER_PROCESS_MESSAGE.SUCCESS) {
                console.log('WORKER_PROCESS_MESSAGE.SUCCESS-->', message);
                const data = await redisClient?.hgetall(`module-${moduleId}`)
                if (data) {
                    console.log('data-->', data);
                    const videoDuration = await getVideoDurationInSeconds(data.localVideoUrl)
                    await redisClient?.expire(`module-${moduleId}`, videoDuration.toFixed())
                    await redisClient?.hset(`module-ref:${moduleId}`, { s3VideoUrl: data.s3VideoUrl, localVideoUrl: data.localVideoUrl })
                    course_moduleData.update({ video_url: data.localVideoUrl })
                }
            }
        })
    }


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
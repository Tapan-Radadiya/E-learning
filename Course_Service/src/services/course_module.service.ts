import { integer } from "aws-sdk/clients/cloudfront";
import { eq } from "drizzle-orm";
import { Request } from "express";
import formidable, { Fields, Files } from "formidable";
import { db } from "../config/connectDb";
import { getRedisClient } from "../config/connectRedis.config";
import { HLS_DIR_PATH, HLS_PUBLIC_PATH, LIVE_STREAM_SEGMENT_DATA, TEMP_UPLOAD_PATH } from "../constants";
import { tbl_course_modules, tbl_courses } from "../db";
import { DeleteFileFromS3 } from "../utils/awsS3.utils";
import { ApiResult, ApiResultInterface, ExtractFormData, formidableFieldsFormat, getFileData, validateWithZod } from "../utils/comman";
import { initVideoUploadWorkerProcess } from "../utils/workerProcessInit.utils";
import { createCourseModuleZodValidation } from "../ZodValidation/create_module.zod";



const AddCourseModuleService = async (req: Request): Promise<ApiResultInterface> => {
    try {

        let moduleId
        const { courseId } = req.params
        const isValidCourse = await db
            .query
            .tbl_courses
            .findFirst({
                where: eq(tbl_courses.id, courseId)
            })
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

        const course_moduleData = await db.insert(tbl_course_modules).values({
            course_id: courseId,
            video_url: files?.video?.[0].filepath ?? '', // Video Path Stored In Local 
            title: fields.title,
            description: fields.description,
            completion_percentage: fields.completion_percentage
        }).returning({
            id: tbl_course_modules.id
        })
        moduleId = course_moduleData[0].id
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
    const isModuleExist = await db.query.tbl_course_modules.findFirst({
        where: eq(tbl_course_modules.id, moduleId)
    })
    try {
        if (isModuleExist) {
            await DeleteFileFromS3(isModuleExist.video_url)
            await db.delete(tbl_course_modules).where(eq(tbl_course_modules.id, moduleId))
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
    const isValidCourse = await db
        .query
        .tbl_courses
        .findFirst({
            where: eq(tbl_courses.id, courseId)
        })
    if (!isValidCourse) {
        return ApiResult({ statusCode: 404, message: "Cannot Found Course" })
    }
    try {
        const allCourses = await db.query.tbl_course_modules.findMany({
            where: eq(tbl_course_modules.course_id, isValidCourse.id)
        })
        return ApiResult({ statusCode: 200, message: "Data Fetched", data: allCourses })
    } catch (error) {
        return ApiResult({ statusCode: 403, message: "Error Fetching Modules " })
    }
}


const updateCourseModuleService = async (req: Request): Promise<ApiResultInterface> => {
    const { moduleId } = req.params
    const isModuleExists = await db.query
        .tbl_course_modules
        .findFirst({
            where: eq(tbl_course_modules.id, moduleId)
        })
    if (isModuleExists) {
        const { fields, files } = await ExtractFormData(req, `moduleVideo/${isModuleExists.course_id}`)
        const isValid = validateWithZod(createCourseModuleZodValidation, fields)
        if (!isValid) {
            return ApiResult({ message: "Invalid Data", data: isValid, statusCode: 400 })
        }
        const courseModuleData = await db
            .update(tbl_course_modules)
            .set({
                title: fields.title,
                description: fields.description,
                video_url: files[0]
            })
            .where(
                eq(tbl_course_modules.id, moduleId)
            )
        if (courseModuleData) {
            await DeleteFileFromS3(isModuleExists.video_url)
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
        const moduleDetails = await db
            .query
            .tbl_course_modules
            .findFirst({
                where: (eq(tbl_course_modules.id, moduleId))
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

        // Send Live Segment URL
        const response = {
            videoUrl: `${LIVE_STREAM_SEGMENT_DATA}/${moduleId}/index.m3u8`,
            videoType: 'application/x-mpegURL'
        }

        return ApiResult({ statusCode: 200, message: "Data Fetched", data: response })
    } else {
        // send Frontend s3 image Url
        const data = await getModuleDetailsService(moduleId)
        if (data.statusCode === 200) {
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

const getUserSegments = (fileData: string, userDuration: integer, moduleId: string): string | null => {

    const fileArrayData = fileData.split("#")
    // First 5 Lines Which Have Segment Split Time(Important)
    const m3u8FileMetaData = fileArrayData.slice(0, 5)

    const segmentData = fileArrayData.slice(5)

    // REgex For #EXTINF:10.500000
    const regex = /EXTINF:(\d+(\.\d+)?),\n([^\n]+)\n/g;
    let totalTime = 0
    const newSegments = []
    if (Array.isArray(segmentData)) {
        for (let i = 0; i < segmentData.length; i++) {
            const ele = segmentData[i]
            if (ele.matchAll(regex)) {
                if (totalTime > userDuration) {
                    if (ele === 'EXT-X-ENDLIST') {
                        console.log("Segment Creation Completed ✅")
                        break
                    }
                    const lines = ele.split(",")

                    const exinfLine = lines[0].trim()

                    const segmentFileName = lines[1].trim()
                    const segmentUrl = `${HLS_PUBLIC_PATH}/${moduleId}/${segmentFileName}`;
                    newSegments.push(`${exinfLine},\n${segmentUrl}\n`)

                } else {
                    const segmentTime = parseFloat(ele.slice(7, 10))
                    totalTime += segmentTime
                }
            }
        }
    }

    let pendingSegmentFileData = null
    if (newSegments.length > 0) {
        const allFileData = m3u8FileMetaData.concat(newSegments)
        pendingSegmentFileData = allFileData.join("#")
    }
    return pendingSegmentFileData
}



const customUserSegmentService = async (moduleId: string) => {
    const redisClient = getRedisClient()

    const moduleRedisData = await redisClient?.hgetall(`module-${moduleId}`) ?? {}

    if (Object.keys(moduleRedisData).length > 0) {
        const userReqTime = Date.now()
        const timePassed = Math.floor((userReqTime - parseInt(moduleRedisData.videoUploadedTime)) / 1000)
        if (moduleRedisData.isAllSegmentCreated === 'true' && !moduleRedisData.moduleM3u8FileData) {
            await redisClient?.hset(`module-${moduleId}`, {
                moduleM3u8FileData: await getFileData(`${HLS_DIR_PATH}/${moduleId}/index.m3u8`)
            })

            const fileData = await redisClient?.hget(`module-${moduleId}`, "moduleM3u8FileData")
            if (!fileData) {
                return ApiResult({ statusCode: 404, message: "Unable TO Find Video Try Again Latter" })
            }
            const newFileData = getUserSegments(fileData, timePassed, moduleId)
            console.log("✅ Served From Redis")
            return newFileData
        }
        else {
            const fileData = await getFileData(`${HLS_DIR_PATH}/${moduleId}/index.m3u8`)

            if (!fileData) {
                return ApiResult({ statusCode: 404, message: "Unable TO Find Video Try Again Latter" })
            }

            const newFileData = getUserSegments(fileData, timePassed, moduleId)
            console.log("❌ Served From ReadFile")
            return newFileData
        }
    } else {
        // TODO Need To Change
        return ''
    }

}
export {
    AddCourseModuleService,
    customUserSegmentService,
    getAllCourseModuleService,
    getM3U8FileDetailsService,
    getModuleDetailsService,
    removeCourseModuleService,
    updateCourseModuleService
};
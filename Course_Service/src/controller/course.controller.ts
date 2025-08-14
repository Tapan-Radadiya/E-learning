import { Response } from "express";
import { Request } from "express";
import { createCourseService, deleteCourseService, updateCourseData, getCourseDetails } from "../services/course.service"
import { ApiResult } from "../utils/comman";

const createCourse = async (req: Request, res: Response) => {
    try {
        const data = await createCourseService(req)
        res.status(data.statusCode!).json(data)
        return
    } catch (error) {
        console.log('error->', error)
        res.status(500).json(ApiResult({ message: "Internal Server Error" }))
        return
    }
}


const getAllCourses = async (req: Request, res: Response) => {
    const { courseId } = req.params
    try {
        const data = await getCourseDetails(courseId)
        res.status(data.statusCode!).json(data)
        return
    } catch (error) {
        console.log('error->', error)
        res.status(500).json(ApiResult({ message: "Internal Server Error" }))
        return
    }
}

const updateCourse = async (req: Request, res: Response) => {
    try {
        const data = await updateCourseData(req)
        res.status(data.statusCode!).json(data)
        return
    } catch (error) {
        console.log('error->', error)
        res.status(500).json(ApiResult({ message: "Internal Server Error" }))
        return
    }
}

const deleteCourse = async (req: Request, res: Response) => {
    const { courseId } = req.params
    try {
        const data = await deleteCourseService(courseId)
        res.status(data.statusCode!).json(data)
        return
    } catch (error) {
        console.log('error->', error)
        res.status(500).json(ApiResult({ message: "Internal Server Error" }))
        return
    }
}

export { createCourse, getAllCourses, deleteCourse, updateCourse }
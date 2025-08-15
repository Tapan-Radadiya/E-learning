import { Request, Response } from "express"
import { ApiResult } from "../utils/comman"
import { AddCourseModuleService, getAllCourseModuleService, getModuleDetailsService, removeCourseModuleService, updateCourseModuleService } from "../services/course_module.service"

const AddCourseModule = async (req: Request, res: Response) => {
    try {
        const data = await AddCourseModuleService(req)
        res.status(data.statusCode!).json(data)
        return
    } catch (error) {
        console.log('error->', error)
        res.status(500).json(ApiResult({ message: "Internal Server Error" }))
        return
    }
}

const removeModule = async (req: Request, res: Response) => {
    const { moduleId } = req.params

    try {
        const data = await removeCourseModuleService(moduleId)
        res.status(data.statusCode!).json(data)
        return
    } catch (error) {
        console.log('error->', error)
        res.status(500).json(ApiResult({ message: "Internal Server Error" }))
        return
    }
}

const fetchCourseModules = async (req: Request, res: Response) => {
    const { courseId } = req.params

    try {
        const data = await getAllCourseModuleService(courseId)
        res.status(data.statusCode!).json(data)
        return
    } catch (error) {
        console.log('error->', error)
        res.status(500).json(ApiResult({ message: "Internal Server Error" }))
        return
    }
}

const updateModules = async (req: Request, res: Response) => {
    try {
        const data = await updateCourseModuleService(req)
        res.status(data.statusCode!).json(data)
        return
    } catch (error) {
        console.log('error->', error)
        res.status(500).json(ApiResult({ message: "Internal Server Error" }))
        return
    }
}

const getModuleDetails = async (req: Request, res: Response) => {
    const {moduleId} = req.params
    try {
        const data = await getModuleDetailsService(moduleId)
        res.status(data.statusCode!).json(data)
        return
    } catch (error) {
        console.log('error->', error)
        res.status(500).json(ApiResult({ message: "Internal Server Error" }))
        return
    }
}

export {
    AddCourseModule,
    removeModule,
    fetchCourseModules,
    updateModules,
    getModuleDetails
}
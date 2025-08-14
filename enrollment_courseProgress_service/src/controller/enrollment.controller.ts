import { Request, Response } from "express";
import { getCourseDataGRPCService, getUsersDataGRPCService } from "../GrpcServices/client/courseService.grpc";
import { ApiResult } from "../comman";
import { enrollUserService, getCourseEnrollmentDetails } from "../services/enrollment.service";

const EnrollUser = async (req: Request, res: Response) => {
    const { courseId } = req.params
    const courseData = await getCourseDataGRPCService(courseId)
    
    if (!courseData) {
        res.status(404).json(ApiResult({ message: "Course Not Found" }))
        return
    }


    try {
        const data = await enrollUserService(courseData, req.user.id)
        res.status(data.statusCode!).json(data)
        return
    } catch (error) {
        console.log('error->', error)
        res.status(500).json(ApiResult({ message: "Internal Server Error" }))
        return
    }
}

const getAllEnrollmentUsers = async (req: Request, res: Response) => {
    const { courseId } = req.params

    try {
        const data = await getCourseEnrollmentDetails(courseId)
        res.status(data.statusCode!).json(ApiResult({ message: "Data", data }))
        return
    } catch (error) {
        console.log('error->', error)
        res.status(500).json(ApiResult({ message: "Internal Server Error" }))
        return
    }
}
export { EnrollUser, getAllEnrollmentUsers }
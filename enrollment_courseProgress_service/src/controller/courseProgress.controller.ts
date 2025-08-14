import { Request, Response } from "express";
import { ApiResult } from "../comman";
import { courseProgressService } from "../services/course_progress.service";

const updateUserProgress = async (req: Request, res: Response) => {
    const { moduleId } = req.params
    const {id} = req.user
    try {
        const data = await courseProgressService(moduleId,id)
        res.status(data.statusCode!).json(ApiResult(data))
        return
    } catch (error) {
        console.log('error->', error)
        res.status(500).json(ApiResult({ message: "Internal Server Error" }))
        return
    }
}

export { updateUserProgress }
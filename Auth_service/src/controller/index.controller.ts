import { Request, Response } from "express";
import { ApiResult, validateWithZod } from "../utils/comman"
import { zodUserCreateValidation, zodUserLoginValidation } from "../ZodValidations/user.validation"
import { addUserService, getUserProfileService, loginUserService, reevaluteRefreshToken } from "../services/index.service"

const createUserController = async (req: Request, res: Response) => {
    if (!req.body) {
        res.status(400).json(ApiResult({ message: "No Data Found In Body" }))
        return
    }
    const isValidData = validateWithZod(zodUserCreateValidation, req.body)
    if (!isValidData) {
        res.status(400).json(ApiResult({ message: "Invalid Data", data: isValidData }))
    }
    try {
        const data = await addUserService(req.body)
        if (data.statusCode === 201) {
            res.status(201).json(ApiResult({ message: "User Created Successfully", data }))
            return
        } else {
            res.status(409).json(ApiResult({ message: data.message }))
        }
    } catch (error) {
        console.log('erroor->', error)
        res.status(500).json(ApiResult({ message: "Internal Server Error", err: error as Error }))
        return
    }
}

const loginUser = async (req: Request, res: Response) => {
    if (!req.body) {
        res.status(400).json(ApiResult({ message: "No Data Found In Body" }))
        return
    }
    const isValidData = validateWithZod(zodUserLoginValidation, req.body)
    if (!isValidData) {
        res.status(400).json(ApiResult({ message: "Invalid Data", data: isValidData }))
        return
    }

    try {
        const data = await loginUserService(req.body)
        if (data.statusCode === 200) {
            const { refreshToken, accessToken } = data.data
            res.cookie('jwt', refreshToken, {
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000
            }).status(data.statusCode!).json(ApiResult({ message: data.message, data: accessToken }))
        } else {
            res.status(data.statusCode!).json(ApiResult({ message: data.message }))
        }
        return
    } catch (error) {
        console.log('error->', error)
        res.status(500).json(ApiResult({ message: "Internal Server Error", err: error as Error }))
        return
    }
}

const refreshTokenData = async (req: Request, res: Response) => {
    const refreshToken = req.cookies.jwt;
    if (!refreshToken) {
        res.status(401).json(ApiResult({ message: "Unauthorized" }))
        return
    }
    try {
        const data = await reevaluteRefreshToken(refreshToken)
        res.status(data.statusCode!).json(data)
        return
    } catch (error) {
        console.log('error->', error)
        res.status(500).json(ApiResult({ message: "Internal Server Error", err: error as Error }))
        return
    }
}

const getUserProfile = async (req: Request, res: Response) => {
    try {
        const data = await getUserProfileService(req.user.id)
        res.status(data.statusCode!).json(data)
        return
    } catch (error) {
        console.log('error->', error)
        res.status(500).json(ApiResult({ message: "Internal Server Error", err: error as Error }))
        return
    }
}

export { createUserController, loginUser, refreshTokenData, getUserProfile }
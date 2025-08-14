export interface ApiResultInterface {
    message: string,
    statusCode?: number,
    data?: any,
    err?: Error
}

export const ApiResult = (data: ApiResultInterface) => {
    return {
        message: data.message,
        statusCode: data.statusCode,
        data: data.data,
        err: data.err
    }
}
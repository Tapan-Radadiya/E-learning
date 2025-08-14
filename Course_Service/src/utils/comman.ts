import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import busboy from "busboy";
import { Request } from "express";
import { Readable } from "stream"
import { buffer } from "stream/consumers";
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



const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_KEY_ID!
    }
})

export async function ExtractFormData(req: Request, dataStoragePath?: string): Promise<{ fields: Record<string, any>, files: any[] }> {
    const busBoy = busboy({ headers: req.headers })
    const fields: Record<string, any> = {}
    const files: any[] = []
    const fileUploadPromises: Promise<void>[] = []
    await new Promise<void>((resolve, reject) => {
        busBoy.on('field', (fieldName, val) => {
            fields[fieldName] = val
        })
        busBoy.on('file', async (fieldName: any, fileStream: any, fileName: {
            filename: string,
            encoding: string,
            mimeType: string
        }) => {
            const bucketFileName = !dataStoragePath ? `${Date.now()} - ${fileName.filename}` : `${dataStoragePath}/${Date.now()} - ${fileName.filename}` as string
            const isFileUploaded = UploadFileToS3({
                body: fileStream,
                key: bucketFileName,
                contentType: fileName.mimeType
            }).then(() => {
                files.push(bucketFileName)

            }).catch(() => console.log("Error Uploading Image"))
            fileUploadPromises.push(isFileUploaded)
        })

        busBoy.on('error', (err) => reject(err));

        busBoy.on('finish', async () => {
            await Promise.all(fileUploadPromises)
            resolve()
        })

        req.pipe(busBoy)
    })
    return { fields, files }
}


export async function UploadFileToS3(uploadParams: { key: string, body: Readable, contentType: string }): Promise<boolean> {
    const readAbleBuffer = await buffer(uploadParams.body)
    const data = await s3.send(new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME!,
        Key: uploadParams.key,
        Body: readAbleBuffer,
        ContentType: uploadParams.contentType,
    }))
    if (data.$metadata.httpStatusCode === 200) {
        return true
    }
    else {
        return false
    }
}

export async function DeleteFileFromS3(fileName: string) {
    const data = await s3.send(new DeleteObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME! as string,
        Key: fileName
    }))
    if (data.$metadata.httpStatusCode === 204) {
        return true
    }else{
        return false
    }
}

export const validateWithZod = (zodSchema: any, value: any): { success: boolean, message?: Object } => {
    const data = zodSchema.safeParse(value)
    if (!data.success) {
        return { success: false, message: data.error.flatten().fieldErrors }
    }
    return { success: true }
}
import busboy from "busboy";
import { Request } from "express";
import { UploadFileToS3 } from "./awsS3.utils";

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




export const validateWithZod = (zodSchema: any, value: any): { success: boolean, message?: Object } => {
    const data = zodSchema.safeParse(value)
    if (!data.success) {
        return { success: false, message: data.error.flatten().fieldErrors }
    }
    return { success: true }
}

export const formidableFieldsFormat = (fields: any): Record<string, any> => {
    const output: Record<string, any> = {};
    // Converting Formidable Data From Record<string,[]> -> Record<string,any>
    Object.keys(fields).map(ele => {
        output[ele] = fields[ele][0];
        return ele;
    });

    return output
}


export const downloadMedia = () => {

}
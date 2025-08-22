import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Readable } from "stream"
import { buffer } from "stream/consumers";


const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_KEY_ID!
    }
})

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
    } else {
        return false
    }
}
import { parentPort, workerData } from "worker_threads"
import { UploadFileToS3 } from "../utils/awsS3.utils"
import * as fs from "fs"

parentPort?.on("message", async (message) => {
    if (message.task === 'UPLOAD_VIDEO_LOCAL_AND_S3') {
        const { oldFilePath, newFilePath, moduleId, course_id, mimeType, fileName } = message.data
        const readStream = fs.createReadStream(oldFilePath)


        await uploadToLocal(oldFilePath, newFilePath)
        console.log("Uploaded To Local . . . ")


        await UploadFileToS3({
            key: `moduleVideo/${course_id}/${Date.now()} - ${fileName ?? ''}`,
            body: readStream,
            contentType: mimeType
        })
        console.log("Uploaded To S3 . . . ")

        console.log("Both The Operation Completed Successfully")
    }
})

const uploadToLocal = async (oldFilePath: string, newFilePath: string): Promise<boolean> => {
    const promiseRes: boolean = await new Promise((res, rej) => {
        fs.rename(oldFilePath, newFilePath, (err) => {
            if (err) {
                rej(false)
            } else {
                res(true)
            }
        })
    })
    console.log('promiseRes-->', promiseRes);
    return promiseRes
}
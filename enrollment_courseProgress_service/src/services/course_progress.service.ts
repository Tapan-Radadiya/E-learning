import { ApiResult, ApiResultInterface } from "../comman"
import { getCourseModuleGRPCService, getCourseDataGRPCService, fetchUserXp, getUsersDataGRPCService, fetchXpEventData, triggerUserXpEvent } from "../GrpcServices/client/courseService.grpc"
import { EMAIL_TYPE, pushDataToSQS, SQS_MESSAGE_GROUP_ID } from "shared-middleware/dist/utils/comman"
import { COURSE_COMPLETION_TEMPLATE } from "../EmailTemplates/emailTemplates"
import { db } from "../config/index.config"
import { and, eq } from "drizzle-orm"
import { tbl_course_progresses, tbl_user_enrollments } from "../db"

const courseProgressService = async (moduleId: string, userId: string): Promise<ApiResultInterface> => {
    const moduleData: any = await getCourseModuleGRPCService(moduleId)
    if (!moduleData) {
        return ApiResult({ statusCode: 404, message: "Unable To Find ModuleData" })
    }

    const isUserEnrolled = await db.query.tbl_user_enrollments.findFirst({
        where: eq(
            tbl_user_enrollments.course_id, moduleData.course_id
        )
    })
    if (!isUserEnrolled) {
        return ApiResult({ statusCode: 400, message: "User is not enrolled for this course" })
    }
    const progressPercent = await db.query.tbl_course_progresses.findFirst({
        where: eq(tbl_course_progresses.enrollment_id, isUserEnrolled.id)
    })

    if (!progressPercent) {
        return ApiResult({ statusCode: 404, message: "User Is Not Enrolled Yet For This Course" })
    }
    if (progressPercent?.is_completed) {
        return ApiResult({ statusCode: 409, message: "Course Already Completed" })
    }
    if (progressPercent && progressPercent?.progress_percent < 100) {
        await db
            .update(tbl_course_progresses)
            .set({ progress_percent: moduleData.completion_percentage + progressPercent.progress_percent })
            .where(eq(tbl_course_progresses.enrollment_id, isUserEnrolled.id))
        return ApiResult({ statusCode: 200, message: "Progress Updated" })
    }
    else if (progressPercent && progressPercent?.progress_percent >= 100) {
        // Marking User Progress For Course As Complete
        const markCourseAsComplete = await db
            .update(tbl_course_progresses)
            .set({ progress_percent: 100, is_completed: true })
            .where(
                eq(tbl_course_progresses.enrollment_id, isUserEnrolled.id)
            )

        // Fetch Data And Send Mail
        if (markCourseAsComplete) {
            // Grpc Call For Fetching Current Xp And Course Data For Email Template
            await triggerUserXpEvent({ userId, xpEvent: "COURSE_COMPLETE" })
            const userXpData = await fetchUserXp(userId)
            const courseData = await getCourseDataGRPCService(moduleData.course_id)
            const userData = await getUsersDataGRPCService([userId])
            const xpEventData = await fetchXpEventData("COURSE_COMPLETE")
            if (userData) {
                const emailBody = COURSE_COMPLETION_TEMPLATE({
                    courseDescription: courseData?.description ?? '',
                    courseTitle: courseData?.title ?? '',
                    gainedXp: xpEventData?.xpPoints ?? 0,
                    totalXp: userXpData?.xp_point ?? 0,
                    thumbnailUrl: `${process.env.AWS_CLOUD_FRONT_URL ?? ''}${courseData?.thumbnail_url ?? ''}`,
                    userDisplayName: (userData && userData[0].display_name) ?? ''
                })
                pushDataToSQS({
                    body: emailBody,
                    emailType: EMAIL_TYPE.USER_CREATION,
                    messageGroupId: SQS_MESSAGE_GROUP_ID.Email_Sending,
                    subject: "Course Completion",
                    to: userData[0].email
                })
            } else {
                console.error("Unable To Send Email")
            }
        }
        return ApiResult({ statusCode: 200, message: "Course Completed Successfully" })
    }
    else {
        return ApiResult({ statusCode: 409, message: "Error Updating Progress" })
    }
}

const getCourseProgressData = async (courseId: string, userId: string): Promise<ApiResultInterface> => {

    const isUserEnrolled = await db.query.tbl_user_enrollments.findFirst({
        where: and(
            eq(tbl_user_enrollments.course_id, courseId),
            eq(tbl_user_enrollments.user_id, userId)
        )
    })
    if (!isUserEnrolled) {
        return ApiResult({ statusCode: 400, message: "User is not enrolled for this course" })
    }

    const userData = await db.query.tbl_course_progresses.findFirst({
        where: eq(tbl_course_progresses.enrollment_id, isUserEnrolled.id)
    })

    if (userData) {
        return ApiResult({ statusCode: 200, message: "Data Fetched", data: userData })
    } else {
        return ApiResult({ statusCode: 409, message: "Error Fetching Data" })
    }
}

export {
    courseProgressService,
    getCourseProgressData
}
import { ApiResult, ApiResultInterface } from "../comman";
import { CourseDataInterface, fetchUserXp, fetchXpEventData, getCourseDataGRPCService, getUsersDataGRPCService, triggerUserXpEvent } from "../GrpcServices/client/courseService.grpc";
import { EMAIL_TYPE, pushDataToSQS, SQS_MESSAGE_GROUP_ID } from "shared-middleware/dist/utils/comman"
import { COURSE_ENROLLMENT_TEMPLATE, ENROLLMENT_FAILED, FIRST_ENROLLMENT_TEMPLATE } from "../EmailTemplates/emailTemplates";
import { db } from "../config/index.config";
import { tbl_course_progresses, tbl_user_enrollments } from "../db";
import { and, eq } from "drizzle-orm";

const enrollUserService = async (courseData: CourseDataInterface, user_id: string): Promise<ApiResultInterface> => {

    let IS_FIRST_ENROLLMENT: boolean = false
    const isUserAlreadyEnrolled = await db.query.tbl_user_enrollments.findFirst({
        where: and(
            eq(tbl_user_enrollments.course_id, courseData.id),
            eq(tbl_user_enrollments.user_id, user_id)
        )
    })

    if (isUserAlreadyEnrolled) {
        return ApiResult({ statusCode: 409, message: "User Is Already Enrolled" })
    }

    const userEnrollmentData = await db.query.tbl_user_enrollments.findMany({
        where: eq(tbl_user_enrollments.user_id, user_id)
    })

    IS_FIRST_ENROLLMENT = userEnrollmentData.length === 0

    const userData = await getUsersDataGRPCService([user_id])
    if (!userData || (Array.isArray(userData) && userData?.length === 0)) {
        return ApiResult({ statusCode: 404, message: "Error Fetching UserData Try After SomeTIme" })
    }

    // const result = await 
    try {

        // Transactions

        const result = await db.transaction(async (tx) => {
            const enrollUser = await db
                .insert(tbl_user_enrollments)
                .values({
                    user_id,
                    course_id: courseData.id
                })
                .returning({
                    id: tbl_user_enrollments.id
                })
            await db
                .insert(tbl_course_progresses)
                .values({
                    enrollment_id: enrollUser[0].id,
                    progress_percent: 0,
                    is_completed: false
                })
            return enrollUser
        })

        // throw new Error()
        const userXpData = await fetchUserXp(user_id)
        // Grpc Call
        if (IS_FIRST_ENROLLMENT) {
            const data = await triggerUserXpEvent({ userId: user_id, xpEvent: 'FIRST_ENROLL' })
            const xpEventData = await fetchXpEventData("FIRST_ENROLL")
            // Sending Email When User Enroll For The First Time
            if (Array.isArray(userData) && userData?.length > 0 && data?.xp_point) {
                const emailBody = FIRST_ENROLLMENT_TEMPLATE({
                    courseDescription: courseData.description,
                    courseTitle: courseData.title,
                    gainedXp: xpEventData?.xpPoints ?? 0,
                    thumbnailUrl: `${process.env.AWS_CLOUD_FRONT_URL}${courseData.thumbnail_url}`,
                    totalXp: data?.xp_point,
                    userDisplayName: userData[0].display_name
                })

                await pushDataToSQS({
                    body: emailBody,
                    emailType: EMAIL_TYPE.USER_CREATION,
                    messageGroupId: SQS_MESSAGE_GROUP_ID.Email_Sending,
                    subject: 'First Course Enrollment',
                    to: userData[0].email
                })
            }
        } else {
            if (Array.isArray(userData) && userData?.length > 0) {
                const emailBody = COURSE_ENROLLMENT_TEMPLATE({
                    courseDescription: courseData.description,
                    courseTitle: courseData.title,
                    thumbnailUrl: `${process.env.AWS_CLOUD_FRONT_URL}${courseData.thumbnail_url}`,
                    totalXp: userXpData?.xp_point ?? 0,
                    userDisplayName: userData[0].display_name
                })

                await pushDataToSQS({
                    body: emailBody,
                    emailType: EMAIL_TYPE.USER_CREATION,
                    messageGroupId: SQS_MESSAGE_GROUP_ID.Email_Sending,
                    subject: 'Course Enrollment',
                    to: userData[0].email
                })
            }
        }
        return ApiResult({ statusCode: 201, message: "User Is Enrolled Successfully" })
    } catch (error) {
        console.log("❌ Transaction Failed")

        await db.delete(tbl_user_enrollments).where(
            and(
                eq(tbl_user_enrollments.course_id, courseData.id),
                eq(tbl_user_enrollments.user_id, user_id)
            )
        )

        const emailBody = ENROLLMENT_FAILED({ courseName: courseData.title, userEmail: userData[0].email, time: String(new Date()) })

        await pushDataToSQS({
            body: emailBody,
            emailType: EMAIL_TYPE.COURSE_ENROLLMENT_FAILED,
            messageGroupId: SQS_MESSAGE_GROUP_ID.Email_Sending,
            subject: 'Course Enrollment',
            to: process.env.ADMIN_EMAIL_ID!
        })
        return ApiResult({ statusCode: 500, message: "Error Enrolling User Try After Some Time" })
    }
}

const getCourseEnrollmentDetails = async (courseId: string): Promise<ApiResultInterface> => {
    const courseData = await getCourseDataGRPCService(courseId)
    if (!courseData) {
        return ApiResult({ message: "Course Not Found" })
    }

    const data = await db.query.tbl_user_enrollments.findMany({
        where: eq(tbl_user_enrollments.course_id, courseId)
    })

    const userIds = data.map((ele: any) => ele.user_id)
    if (userIds.length === 0) {
        return ApiResult({ statusCode: 200, message: "No user is enrolled" })
    }

    const userProfile = await getUsersDataGRPCService(userIds)
    const filterData = {
        ...courseData,
        userEnrolled: userProfile
    }
    return ApiResult({ statusCode: 200, message: "Data Fetched", data: filterData })
}

export {
    enrollUserService,
    getCourseEnrollmentDetails
}
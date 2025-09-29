import { ApiResult, ApiResultInterface } from "../comman";
import { user_enrollments } from "../schema/enrollment.schema"
import { course_progresses } from "../schema/courseProgress.schema"
import { CourseDataInterface, fetchUserXp, fetchXpEventData, getCourseDataGRPCService, getUsersDataGRPCService, triggerUserXpEvent } from "../GrpcServices/client/courseService.grpc";
import { EMAIL_TYPE, pushDataToSQS, SQS_MESSAGE_GROUP_ID } from "shared-middleware/dist/utils/comman"
import { COURSE_ENROLLMENT_TEMPLATE, ENROLLMENT_FAILED, FIRST_ENROLLMENT_TEMPLATE } from "../EmailTemplates/emailTemplates";
import { db } from "../config/index.config";

const enrollUserService = async (courseData: CourseDataInterface, user_id: string): Promise<ApiResultInterface> => {

    let IS_FIRST_ENROLLMENT: boolean = false
    const isUserAlreadyEnrolled = await user_enrollments.findOne({ where: { user_id, course_id: courseData.id } })

    if (isUserAlreadyEnrolled) {
        return ApiResult({ statusCode: 409, message: "User Is Already Enrolled" })
    }

    const userEnrollmentData = await user_enrollments.findAll({ where: { user_id }, raw: true })
    IS_FIRST_ENROLLMENT = userEnrollmentData.length === 0

    const userData = await getUsersDataGRPCService([user_id])
    if (!userData || (Array.isArray(userData) && userData?.length === 0)) {
        return ApiResult({ statusCode: 404, message: "Error Fetching UserData Try After SomeTIme" })
    }

    // const result = await 
    try {

        // Transactions
        const result = await db.transaction(async (t) => {
            const enrollUser = await user_enrollments.create({ user_id, course_id: courseData.id }, { transaction: t })

            await course_progresses.create({
                user_id,
                course_id: courseData.id,
                progress_percent: 0,
                is_completed: false
            }, { transaction: t })
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
        await user_enrollments.destroy({ where: { user_id, course_id: courseData.id } })
        await course_progresses.destroy({ where: { user_id, course_id: courseData.id } })

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
    const data = await user_enrollments.findAll({ where: { course_id: courseId }, attributes: ['user_id'], raw: true })
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
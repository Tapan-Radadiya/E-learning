interface CourseCompletedTemplateInterface {
  userDisplayName: string,
  courseTitle: string,
  courseDescription: string,
  thumbnailUrl: string,
  gainedXp: number,
  totalXp: number
}

const COURSE_COMPLETION_TEMPLATE = (
  data: CourseCompletedTemplateInterface
): string => {
  return `
  <html>
    <body style="font-family: Arial, sans-serif; color: #333; background-color: #f9f9f9; padding: 20px;">
      <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.05);">
        
        <h2 style="color: #27ae60;">🎓 Congratulations, ${data.userDisplayName}!</h2>
        <p>You’ve successfully completed the <strong>${data.courseTitle}</strong> course.</p>
        <p>Great news! You’re now eligible to take the quiz to test your knowledge and earn even more XP.</p>

        <div style="text-align: center; margin: 20px 0;">
          <img src="${data.thumbnailUrl}" alt="${data.courseTitle} Thumbnail" style="max-width: 100%; height: auto; border-radius: 6px;" />
        </div>

        <p style="margin-top: 20px;"><strong>Course Description:</strong></p>
        <p style="background-color: #f1f1f1; padding: 10px; border-radius: 6px;">${data.courseDescription}</p>

        <p style="margin-top: 20px;">
          You’ve earned <strong>${data.gainedXp} XP points</strong> for completing this course. 🎉
        </p>

        <p style="font-size: 1.1em; margin-top: 10px;">
          <strong>Total XP:</strong> ${data.totalXp} XP
        </p>

        <p style="margin-top: 40px; font-size: 0.9em; color: #777;">
          Keep up the great work, and continue learning with ELearning!
        </p>
      </div>
    </body>
  </html>
  `;
}

const FIRST_ENROLLMENT_TEMPLATE = (data: CourseCompletedTemplateInterface) => {
  return `
  <html>
    <body style="font-family: Arial, sans-serif; color: #333; background-color: #f9f9f9; padding: 20px;">
      <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.05);">

        <h2 style="color: #2d9cdb;">👋 Welcome, ${data.userDisplayName}!</h2>
        <p>You've just enrolled in your first course on <strong>ELearning</strong> — exciting times ahead!</p>

        <div style="text-align: center; margin: 20px 0;">
          <img src="${data.thumbnailUrl}" alt="${data.courseTitle} Thumbnail" style="max-width: 100%; height: auto; border-radius: 6px;" />
        </div>

        <p style="margin-top: 20px;"><strong>Course Title:</strong> ${data.courseTitle}</p>
        <p style="background-color: #f1f1f1; padding: 10px; border-radius: 6px;"><strong>Description:</strong> ${data.courseDescription}</p>

        <p style="margin-top: 20px;">
          As a bonus, you've earned <strong>${data.gainedXp} XP points</strong> just for enrolling! 🎉
        </p>

        <p style="font-size: 1.1em;">
          <strong>Your Total XP:</strong> ${data.totalXp} XP
        </p>

        <p style="margin-top: 40px; font-size: 0.9em; color: #777;">
          We’re thrilled to have you learning with us. Dive in, and let the journey begin!
        </p>

      </div>
    </body>
  </html>
  `;
}

const COURSE_ENROLLMENT_TEMPLATE = (data: {
  userDisplayName: string,
  courseTitle: string,
  courseDescription: string,
  thumbnailUrl: string,
  totalXp: number
}) => {
  return `
  <html>
    <body style="font-family: Arial, sans-serif; color: #333; background-color: #f9f9f9; padding: 20px;">
      <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.05);">

        <h2 style="color: #34495e;">📚 Course Enrolled: ${data.courseTitle}</h2>
        <p>Hi ${data.userDisplayName}, you've successfully enrolled in a new course on <strong>ELearning</strong>.</p>

        <div style="text-align: center; margin: 20px 0;">
          <img src="${data.thumbnailUrl}" alt="${data.courseTitle} Thumbnail" style="max-width: 100%; height: auto; border-radius: 6px;" />
        </div>

        <p style="margin-top: 20px;"><strong>Course Title:</strong> ${data.courseTitle}</p>
        <p style="background-color: #f1f1f1; padding: 10px; border-radius: 6px;"><strong>Description:</strong> ${data.courseDescription}</p>

        <p style="font-size: 1.1em;">
          <strong>Your Total XP:</strong> ${data.totalXp} XP
        </p>

        <p style="margin-top: 40px; font-size: 0.9em; color: #777;">
          Best of luck with your learning journey. Keep progressing!
        </p>

      </div>
    </body>
  </html>
  `;
}


const ENROLLMENT_FAILED = (data: {
  userEmail: string,
  courseName: string,
  time: string
}) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Enrollment Failed</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f6f9fc; margin: 0; padding: 0;">
  <div style="max-width: 600px; background: #ffffff; margin: 40px auto; padding: 20px 30px; border-radius: 12px; box-shadow: 0 2px 6px rgba(0,0,0,0.08);">
    <h2 style="color: #d93025; margin-bottom: 10px;">⚠ Enrollment Failed</h2>
    <p style="color: #444444; line-height: 1.6;">Hello Admin,</p>
    <p style="color: #444444; line-height: 1.6;">The system was unable to complete a user enrollment. Please review the details below:</p>
    
    <div style="margin: 20px 0; padding: 15px; background: #f9f9f9; border-left: 4px solid #d93025; border-radius: 6px;">
      <p style="margin: 6px 0; font-size: 14px; color:#444444;"><strong>User Email:</strong> ${data.userEmail} </p>
      <p style="margin: 6px 0; font-size: 14px; color:#444444;"><strong>Course Name:</strong> ${data.courseName} </p>
      <p style="margin: 6px 0; font-size: 14px; color:#444444;"><strong>Time:</strong> ${data.time} </p>
    </div>
    
    <p style="color: #444444; line-height: 1.6;">You may need to manually verify the issue or reach out to the user.</p>
    
    <p style="color: #444444; line-height: 1.6;">Best Regards,<br/>Your LMS Team</p>
    
    <div style="margin-top: 20px; font-size: 12px; color: #777; text-align: center;">
      <p>This is an automated message. Please do not reply.</p>
    </div>
  </div>
</body>
</html>
`
}

export { COURSE_COMPLETION_TEMPLATE, FIRST_ENROLLMENT_TEMPLATE, COURSE_ENROLLMENT_TEMPLATE, ENROLLMENT_FAILED }
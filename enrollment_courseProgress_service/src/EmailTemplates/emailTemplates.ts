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

export { COURSE_COMPLETION_TEMPLATE, FIRST_ENROLLMENT_TEMPLATE, COURSE_ENROLLMENT_TEMPLATE }
package emailtemplate

import "fmt"

type UserPassEmailTemplateStruct struct {
	UserDisplayName   string
	CourseTitle       string
	CourseDescription string
	ThumbnailURL      string
	QuizScore         int
	IsPassed          bool
	EarnedXP          int
	TotalXP           int
}

func UserPassEmailTemplate(templateData *UserPassEmailTemplateStruct) string {
	var resultText, totalXpText string

	if templateData.IsPassed {
		resultText = fmt.Sprintf(`
			<p style="color: #27ae60;"><strong>✅ You passed the quiz!</strong></p>
			<p>You’ve earned <strong>%d XP points</strong> for passing the quiz. Great job!</p>
		`, templateData.EarnedXP)

		totalXpText = fmt.Sprintf(`
			<p style="font-size: 1.1em;"><strong>Your Total XP:</strong> %d XP</p>
		`, templateData.TotalXP)
	} else {
		resultText = `
			<p style="color: #c0392b;"><strong>❌ You did not pass the quiz.</strong></p>
			<p>Don’t worry! You can review the course and try again to improve your score.</p>
		`
		// No XP update if failed
	}

	return fmt.Sprintf(`
	<html>
		<body style="font-family: Arial, sans-serif; color: #333; background-color: #f9f9f9; padding: 20px;">
			<div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.05);">

				<h2 style="color: #2d9cdb;">📝 Quiz Completed: %s</h2>
				<p>Hi %s, you’ve completed the quiz for the course <strong>%s</strong>.</p>

				<div style="text-align: center; margin: 20px 0;">
					<img src="%s" alt="%s Thumbnail" style="max-width: 100%%; height: auto; border-radius: 6px;" />
				</div>

				<p><strong>Course Description:</strong></p>
				<p style="background-color: #f1f1f1; padding: 10px; border-radius: 6px;">%s</p>

				<p><strong>Your Score:</strong> %d%%</p>
				%s
				%s

				<p style="margin-top: 40px; font-size: 0.9em; color: #777;">
					Keep pushing forward — every quiz is a step closer to mastery!
				</p>

			</div>
		</body>
	</html>
	`,
		templateData.CourseTitle,
		templateData.UserDisplayName,
		templateData.CourseTitle,
		templateData.ThumbnailURL,
		templateData.CourseTitle,
		templateData.CourseDescription,
		templateData.QuizScore,
		resultText,
		totalXpText,
	)
}

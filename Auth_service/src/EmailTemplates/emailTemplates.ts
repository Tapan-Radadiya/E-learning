const NEW_USER_EMAIL_TEMPLATE = (userDisplayName: string, xpPoint: number): string => {
  return `
  <html>
    <body style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; background-color: #f9f9f9; padding: 20px;">
      <div style="max-width: 600px; margin: auto; background: #fff; padding: 30px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.05);">
        <h2 style="color: #2e86de;">Welcome to ELearning, ${userDisplayName}!</h2>
        <p>We're excited to have you on board 🎉</p>

        <p><strong>Your learning journey begins now.</strong></p>

        <p>Your account has been successfully created, and you've been awarded <strong>${xpPoint} XP points</strong> to get started.</p>

        <p>Explore courses, build new skills, and grow with ELearning. We’re here to support you every step of the way.</p>

        <p style="margin-top: 40px; font-size: 0.9em; color: #777;">
          This is an automated message. No further action is required.
        </p>
      </div>
    </body>
  </html>
  `;
}


export { NEW_USER_EMAIL_TEMPLATE }
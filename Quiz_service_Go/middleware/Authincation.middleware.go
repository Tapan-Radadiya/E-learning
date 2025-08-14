package middleware

import (
	"github.com/gofiber/fiber/v2"
)

func AuthincateUser(c *fiber.Ctx) error {
	// authToken := c.Get("Authorization")

	// if authToken == "" {
	// 	common.Response(c, fiber.StatusUnauthorized, fiber.Map{"message": "No Auth Token Found"})
	// }

	// token := strings.TrimPrefix(authToken, "Bearer ")
	// if token == "" {
	// 	common.Response(c, fiber.StatusUnauthorized, fiber.Map{"message": "Unauthorized"})
	// }

	// _, isJwtDecoded := common.DecodeJwtToken(token)

	// if !isJwtDecoded {
	// 	log.Print("JWT Not Decoded")
	// 	return common.Response(c, fiber.StatusUnauthorized, fiber.Map{"message": "Unauthorized User Or Token Expired"})
	// }

	userId := c.Get("x-user-id")
	emailId := c.Get("x-user-email")
	role := c.Get("x-user-role")

	c.Locals("Email", emailId)
	c.Locals("UserId", userId)
	c.Locals("Role", role)

	return c.Next()
}

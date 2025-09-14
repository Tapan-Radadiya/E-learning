package middleware

import (
	"quiz_service/common"
	"quiz_service/constants"

	"github.com/gofiber/fiber/v2"
)

func AuthorizeUser(allowedRole []constants.USERROLES) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var isUserAllowed = false
		currentRole := c.Get("x-user-role")
		for _, value := range allowedRole {
			if currentRole == string(value) {
				isUserAllowed = true
			}
		}

		if isUserAllowed {
			return c.Next()
		} else {
			return common.Response(c, fiber.StatusUnauthorized, fiber.Map{"message": "you are not authorized for this"})
		}
	}

}

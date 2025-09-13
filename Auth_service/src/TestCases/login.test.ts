import { addUserService, getUserProfileService } from "../services/index.service"
import { Role } from "../constants"

describe('Register User', () => {
    let userId: string
    test('Register User', async () => {
        const data = await addUserService({
            display_name: "Tapan",
            email: "champakgada163@gmai.com",
            password: "EE_Jethyaa",
            user_role: Role.USER
        })
        userId = data.data.userData.id as string
        expect(data.statusCode).toBe(201)
    });

    test('Get registerd user data', async () => {
        const data = await getUserProfileService(userId)
        expect(data.statusCode).toBe(200)
    })

    test('Register User With Same Email', async () => {
        const data = await addUserService({
            display_name: "Tapan",
            email: "champakgada163@gmai.com",
            password: "EE_Jethyaa",
            user_role: Role.USER
        })
        expect(data.statusCode).toBe(409)
    });
});

import { addUserService, getUserProfileService } from "../services/index.service"
import { Role } from "../constants"

describe('Register User', () => {
    let userId: string
    it('Should register user', async () => {
        const data = await addUserService({
            display_name: "Tapan",
            email: "champakgada163@gmai.com",
            password: "EE_Jethyaa",
            role: Role.USER
        })
        userId = data.data.userData.id as string
        expect(data.statusCode).toBe(201)
    });

    it('Should get registerd user data', async () => {
        const data = await getUserProfileService(userId)
        expect(data.statusCode).toBe(200)
    })

    it('Should not allow to regisetr user with aleready existing email', async () => {
        const data = await addUserService({
            display_name: "Tapan",
            email: "champakgada163@gmai.com",
            password: "EE_Jethyaa",
            role: Role.USER
        })
        expect(data.statusCode).toBe(409)
    });
});

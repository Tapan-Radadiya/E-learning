import { getCourseDetails } from "../services/course.service"
describe('dsadsa', () => {
    it('Should Retuen Course Data', async () => {
        const data = await getCourseDetails('77f7527d-a0e3-4a48-af3e-98f6b85f5fc7')
        expect(data.statusCode).toBe(200)
    })
})
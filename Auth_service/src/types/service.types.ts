import { Role } from "../constants"

export interface AddOrgUserInterface {
    userBody: userBody
    userData: UserData
}


type UserData = {
    id: string;
    email: string;
    role: Role;
    org_id: string
}
type userBody = {
    display_name: string,
    email: string,
    password: string,
    role: Role
}
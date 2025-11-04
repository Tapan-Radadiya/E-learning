// src/types/express.d.ts
import "express";
import { Role } from "../utils/comman";

declare global {
    namespace Express {
        interface Request {
            user: {
                id: string;
                email: string;
                role: Role;
                org_id: string
            };
        }
    }
}
export { };

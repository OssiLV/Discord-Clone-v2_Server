import { Request } from "express";
import { User } from "src/types";
export interface RequestExtend extends Request {
    user: User;
    handshake: {
        headers: {
            authorization: string;
        };
    };
}

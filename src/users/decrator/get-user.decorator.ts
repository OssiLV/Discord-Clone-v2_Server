import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { RequestExtend } from "src/extends";

export const GetUser = createParamDecorator(
    (data: string, ctx: ExecutionContext) => {
        const request: RequestExtend = ctx.switchToHttp().getRequest();
        if (data) {
            return request.user[data];
        }
        return request.user;
    },
);

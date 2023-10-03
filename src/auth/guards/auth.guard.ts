import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Socket } from "dgram";
import { Request } from "express";
import { RequestExtend } from "src/extends";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private readonly config: ConfigService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token) {
            throw new UnauthorizedException();
        }
        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: this.config.get("JWT_SECRET"),
            });

            request["user"] = payload;
        } catch {
            throw new UnauthorizedException();
        }
        return true;
    }

    private extractTokenFromHeader(request: RequestExtend): string | undefined {
        if (request.headers) {
            const [type, token] =
                request.headers.authorization?.split(" ") ?? [];
            return type === "Bearer" ? token : undefined;
        } else {
            const [type, token] =
                request.handshake.headers.authorization?.split(" ") ?? [];

            return type === "Bearer" ? token : undefined;
        }
    }
}

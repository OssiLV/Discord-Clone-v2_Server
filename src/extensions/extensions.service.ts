import {
    Injectable,
    InternalServerErrorException,
    UnauthorizedException,
} from "@nestjs/common";
import { Profile } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { User } from "src/types";

@Injectable()
export class ExtensionsService {
    constructor(private readonly prisma: PrismaService) {}
    async CurrentProfile(user: User): Promise<Profile> {
        try {
            if (!user) {
                throw new UnauthorizedException();
            }

            const profile = await this.prisma.profile.findUnique({
                where: {
                    userId: user.sub,
                },
            });

            return profile;
        } catch (error) {
            console.log("[CURRENT-PROFILE]_ERROR", error);
            throw new InternalServerErrorException();
        }
    }
}

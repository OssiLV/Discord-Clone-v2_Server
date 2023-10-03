import {
    ForbiddenException,
    InternalServerErrorException,
    Injectable,
} from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import * as argon2 from "argon2";

import { SignUpDto, SignInDto } from "./dto";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { ExtensionsService } from "src/extensions/extensions.service";
import { User } from "src/types";

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly config: ConfigService,
        private readonly jwt: JwtService,
        private readonly extensionsService: ExtensionsService,
    ) {}

    async signUp(signUpDtos: SignUpDto) {
        const { email, name, password } = signUpDtos;
        const hash = await argon2.hash(signUpDtos.password);

        try {
            const currentUser = await this.prisma.user.findUnique({
                where: {
                    email,
                },
            });
            // TODO: Check current user

            const user = await this.prisma.user.create({
                data: {
                    email,
                    name,
                    password: hash,
                    profile: {
                        create: {},
                    },
                },
            });

            delete user.password;
            return user;
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === "P2002") {
                    throw new ForbiddenException("Credentials taken");
                }
            }
            throw error;
        }
    }

    async signIn(signInDto: SignInDto) {
        const { email, password } = signInDto;
        try {
            const user = await this.prisma.user.findUnique({
                where: {
                    email,
                },
            });

            if (!user) throw new ForbiddenException("Credentials Incorrect");

            // Compare password
            const pwMatches = await argon2.verify(user.password, password);
            if (!pwMatches) {
                throw new ForbiddenException("Credentials Incorrect");
            }

            return await this.signToken(
                user.id,
                user.email,
                user.name,
                user.imageUrl,
            );
        } catch (error) {
            throw new InternalServerErrorException();
        }
    }

    async signToken(
        userId: string,
        email: string,
        name: string,
        imageUrl: string,
    ): Promise<{ access_token: string }> {
        const payload = {
            sub: userId,
            email,
            name,
            imageUrl,
        };

        const secret = this.config.get("JWT_SECRET");

        const token = await this.jwt.signAsync(payload, {
            expiresIn: "1h",
            secret,
        });
        return {
            access_token: token,
        };
    }
}

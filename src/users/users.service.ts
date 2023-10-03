import { Injectable } from "@nestjs/common";
import { Member } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService) {}

    async getUser(member: Member) {
        try {
        } catch (error) {}
    }
}

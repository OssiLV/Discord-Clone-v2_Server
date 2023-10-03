import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
} from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateServerDto } from "./dto";
import { v4 as uuidv4 } from "uuid";
import { User } from "src/types";
import { MemberRole } from "@prisma/client";
import { ExtensionsService } from "src/extensions/extensions.service";

@Injectable()
export class ServerService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly extensionsService: ExtensionsService,
    ) {}

    async createServer(dto: CreateServerDto, user: User) {
        try {
            const profile = await this.extensionsService.CurrentProfile(user);
            const server = await this.prisma.server.create({
                data: {
                    profileId: profile.id,
                    name: dto.name,
                    imageUrl: dto.imageUrl,
                    inviteCode: uuidv4(),
                    channels: {
                        create: [{ name: "general", profileId: profile.id }],
                    },
                    members: {
                        create: [
                            { profileId: profile.id, role: MemberRole.ADMIN },
                        ],
                    },
                },
            });

            return server;
        } catch (error) {
            console.log("[CREATE-SERVER]_ERROR");
            throw new InternalServerErrorException();
        }
    }

    async getAllServersByProfileId(user: User) {
        try {
            const profile = await this.extensionsService.CurrentProfile(user);
            const servers = await this.prisma.server.findMany({
                where: {
                    members: {
                        some: {
                            profileId: profile.id,
                        },
                    },
                },
            });

            return servers;
        } catch (error) {
            console.log("[GET-ALL-SERVERS-BY-PROFILE-ID]_ERROR");
            throw new InternalServerErrorException();
        }
    }

    async getAllServerWithChannelsWithMembersByServerId(
        user: User,
        serverId: string,
    ) {
        try {
            const profile = await this.extensionsService.CurrentProfile(user);
            const server = await this.prisma.server.findUnique({
                where: {
                    id: serverId,
                },
                include: {
                    channels: {
                        orderBy: {
                            createdAt: "asc",
                        },
                    },
                    members: {
                        include: {
                            profile: false,
                        },
                        orderBy: {
                            role: "asc",
                        },
                    },
                },
            });

            // Find current member
            const currentMember = await this.prisma.member.findFirst({
                where: {
                    profileId: profile.id,
                },
                include: {
                    profile: {
                        include: {
                            user: true,
                        },
                    },
                },
            });

            // Find another members
            const anotherMembers = await this.prisma.member.findMany({
                where: {
                    // profileId: profile.id,
                    profile: {
                        NOT: {
                            id: profile.id,
                        },
                    },
                    serverId: serverId,
                },
                include: {
                    profile: {
                        include: {
                            user: true,
                        },
                    },
                },
            });

            return { server, currentMember, anotherMembers };
        } catch (error) {
            console.log("[GET-ALL-SERVERS-BY-PROFILE-ID]_ERROR");
            throw new InternalServerErrorException();
        }
    }

    async renewInviteCode(serverId: string, user: User) {
        try {
            const profile = await this.extensionsService.CurrentProfile(user);
            if (!serverId) {
                throw new BadRequestException("Missing Server Id");
            }

            const server = await this.prisma.server.update({
                where: {
                    id: serverId,
                    profileId: profile.id,
                },
                data: {
                    inviteCode: uuidv4(),
                },
            });
            return server;
        } catch (error) {
            console.log("[RENEW_INVITE_CODE]_ERROR");
            throw new InternalServerErrorException();
        }
    }

    async inviteMember(inviteCode: string, user: User) {
        try {
            const profile = await this.extensionsService.CurrentProfile(user);

            if (!inviteCode) {
                throw new BadRequestException("Missing Invite Code");
            }

            const existingServer = await this.prisma.server.findFirst({
                where: {
                    inviteCode,
                    members: {
                        some: {
                            profileId: profile.id,
                        },
                    },
                },
                include: {
                    channels: {
                        where: {
                            name: "general",
                        },
                    },
                },
            });

            if (existingServer) {
                return existingServer;
            }

            const server = await this.prisma.server.update({
                where: { inviteCode },
                data: {
                    members: {
                        create: [
                            {
                                profileId: profile.id,
                            },
                        ],
                    },
                },
                include: {
                    channels: { where: { name: "general" } },
                },
            });

            return server;
        } catch (error) {
            console.log("[INVITE_MEMBER]_ERROR");
            throw new InternalServerErrorException();
        }
    }
}

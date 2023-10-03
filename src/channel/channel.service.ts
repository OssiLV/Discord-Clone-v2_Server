import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
} from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { User } from "src/types";
import { CreateChannelDto } from "./dto";
import { ExtensionsService } from "src/extensions/extensions.service";
import { MemberRole } from "@prisma/client";

@Injectable()
export class ChannelService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly extensionsService: ExtensionsService,
    ) {}

    async createChannel(user: User, dto: CreateChannelDto) {
        try {
            const profile = await this.extensionsService.CurrentProfile(user);

            if (!dto.serverId) {
                throw new BadRequestException("Server ID missing");
            }

            if (dto.name === "general") {
                throw new BadRequestException("Name cannot be 'general'");
            }

            const server = await this.prisma.server.update({
                where: {
                    id: dto.serverId,
                    members: {
                        some: {
                            profileId: profile.id,
                            role: {
                                in: [MemberRole.ADMIN, MemberRole.MODERATOR],
                            },
                        },
                    },
                },
                data: {
                    channels: {
                        create: {
                            profileId: profile.id,
                            name: dto.name,
                            type: dto.type,
                        },
                    },
                },
            });

            const newChannel = await this.prisma.channel.findFirst({
                where: {
                    profileId: profile.id,
                    serverId: server.id,
                },
                orderBy: {
                    createdAt: "desc",
                },
            });

            return newChannel;
        } catch (error) {
            console.log("[CREATE_CHANNEL]_ERROR");
            throw new InternalServerErrorException();
        }
    }

    async findGeneralChannelByServerId(serverId: string) {
        try {
            if (!serverId) {
                throw new BadRequestException("Missing server ID");
            }
            const channel = await this.prisma.channel.findFirst({
                where: {
                    serverId,
                    name: "general",
                },
            });

            return channel;
        } catch (error) {
            console.log("[FIND_GENERAL_CHANNEL]_ERROR");
            throw new InternalServerErrorException();
        }
    }

    async findChannel(channelId: string) {
        try {
            if (!channelId) {
                throw new BadRequestException("Missing Channel Id");
            }

            const channel = await this.prisma.channel.findUnique({
                where: {
                    id: channelId,
                },
            });
            return channel;
        } catch (error) {
            console.log("[FIND_CHANNEL]_ERROR");
            throw new InternalServerErrorException();
        }
    }
}

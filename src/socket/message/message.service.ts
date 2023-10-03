import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from "@nestjs/common";
import { WebSocketServer } from "@nestjs/websockets";
import { Message } from "@prisma/client";
import { Socket } from "dgram";
import { ExtensionsService } from "src/extensions/extensions.service";
import { PrismaService } from "src/prisma/prisma.service";
import { User } from "src/types";

@Injectable()
export class MessageService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly extensionsService: ExtensionsService,
    ) {}

    async createMessage(body: any, user: User) {
        try {
            const { serverId, channelId, content, fileUrl } = body;
            const profile = await this.extensionsService.CurrentProfile(user);

            if (!serverId) {
                throw new BadRequestException("Missing Server Id");
            }

            if (!channelId) {
                throw new BadRequestException("Missing Channel Id");
            }
            if (!content) {
                throw new BadRequestException("Missing Content");
            }

            const server = await this.prisma.server.findFirst({
                where: {
                    id: serverId as string,
                    members: {
                        some: {
                            profileId: profile.id,
                        },
                    },
                },
                include: {
                    members: true,
                },
            });

            if (!server) {
                throw new NotFoundException("Server Not Found");
            }

            const channel = await this.prisma.channel.findFirst({
                where: {
                    id: channelId as string,
                    serverId: serverId as string,
                },
            });

            if (!channel) {
                throw new NotFoundException("Channel Not Found");
            }

            const member = server.members.find(
                (member) => member.profileId === profile.id,
            );

            if (!member) {
                throw new NotFoundException("Member Not Found");
            }

            const message = await this.prisma.message.create({
                data: {
                    content,
                    fileUrl,
                    channelId: channelId as string,
                    memberId: member.id,
                },
                include: {
                    member: {
                        include: {
                            profile: {
                                include: {
                                    user: true,
                                },
                            },
                        },
                    },
                },
            });
            const channelKey = `chat:channel:${channelId}`;
            return {
                channelKey,
                message,
            };
        } catch (error) {
            console.log("[CREATE_MESSAGE]_ERROR");
            throw new InternalServerErrorException();
        }

        // return body;
    }

    async findMessages(channelId: string, user: User) {
        try {
            const profile = await this.extensionsService.CurrentProfile(user);

            if (!channelId) {
                throw new BadRequestException("Missing Channel ID");
            }
            let messages: Message[] = [];

            messages = await this.prisma.message.findMany({
                where: {
                    channelId: channelId,
                },
                include: {
                    member: {
                        include: {
                            profile: {
                                include: {
                                    user: true,
                                },
                            },
                        },
                    },
                },
                orderBy: {
                    createdAt: "asc",
                },
            });
            return messages;
        } catch (error) {
            console.log("[FIND_MESSAGES]_ERROR");
            throw new InternalServerErrorException();
        }
    }
}

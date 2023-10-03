import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    ParseUUIDPipe,
    Post,
    UseGuards,
    ValidationPipe,
    Patch,
} from "@nestjs/common";
import { CreateServerDto } from "./dto";
import { ServerService } from "./server.service";
import { AuthGuard } from "src/auth/guards";
import { GetUser } from "src/users/decrator";
import { User } from "src/types";

@UseGuards(AuthGuard)
@Controller("servers")
export class ServerController {
    constructor(private readonly serverService: ServerService) {}

    @HttpCode(HttpStatus.CREATED)
    @Post()
    async createServer(
        @Body(new ValidationPipe()) createServerDto: CreateServerDto,
        @GetUser() user: User,
    ) {
        const server = await this.serverService.createServer(
            createServerDto,
            user,
        );
        return server;
    }

    @HttpCode(HttpStatus.OK)
    @Get()
    async getAllServersByProfileId(@GetUser() user: User) {
        return await this.serverService.getAllServersByProfileId(user);
    }

    @HttpCode(HttpStatus.OK)
    @Get("/server-channels-members/:serverId")
    async getAllServersWithChannelsWithMembersByProfileId(
        @GetUser() user: User,
        @Param("serverId", new ParseUUIDPipe()) serverId: string,
    ) {
        return await this.serverService.getAllServerWithChannelsWithMembersByServerId(
            user,
            serverId,
        );
    }

    @HttpCode(HttpStatus.OK)
    @Patch("invite-code/:serverId")
    async renewInviteCode(
        @GetUser() user: User,
        @Param("serverId", new ParseUUIDPipe()) serverId: string,
    ) {
        return await this.serverService.renewInviteCode(serverId, user);
    }

    @HttpCode(HttpStatus.CREATED)
    @Patch("new-member/:inviteCode")
    async addNewMemberToServerWithInviteCode(
        @GetUser() user: User,
        @Param("inviteCode") inviteCode: string,
    ) {
        return await this.serverService.inviteMember(inviteCode, user);
    }
}

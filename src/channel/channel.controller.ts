import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    ParseUUIDPipe,
    Post,
    Query,
    UseGuards,
    ValidationPipe,
} from "@nestjs/common";
import { ChannelService } from "./channel.service";
import { GetUser } from "src/users/decrator";
import { User } from "src/types";
import { CreateChannelDto } from "./dto";
import { AuthGuard } from "src/auth/guards";

@UseGuards(AuthGuard)
@Controller("channels")
export class ChannelController {
    constructor(private readonly channelService: ChannelService) {}

    @HttpCode(HttpStatus.CREATED)
    @Post()
    async createChannel(
        @GetUser() user: User,
        @Body(new ValidationPipe()) createChannelDto: CreateChannelDto,
    ) {
        return await this.channelService.createChannel(user, createChannelDto);
    }

    @HttpCode(HttpStatus.OK)
    @Get("/general")
    async findGeneralChannelByServerId(
        @Query("serverId", new ParseUUIDPipe()) serverId: string,
    ) {
        return await this.channelService.findGeneralChannelByServerId(serverId);
    }

    @HttpCode(HttpStatus.OK)
    @Get("/:channelId")
    async findChannelById(@Param("channelId") channelId: string) {
        return await this.channelService.findChannel(channelId);
    }
}

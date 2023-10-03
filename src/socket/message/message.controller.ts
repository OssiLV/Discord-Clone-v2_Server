import {
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    UseGuards,
    Param,
} from "@nestjs/common";
import { AuthGuard } from "src/auth/guards";
import { GetUser } from "src/users/decrator";
import { User } from "src/types";
import { MessageService } from "./message.service";

@UseGuards(AuthGuard)
@Controller("messages")
export class MessageController {
    constructor(private readonly messagesService: MessageService) {}

    @HttpCode(HttpStatus.OK)
    @Get(":channelId")
    async getAllMessagesByChannelId(
        @GetUser() user: User,
        @Param("channelId") channelId: string,
    ) {
        return await this.messagesService.findMessages(channelId, user);
    }
}

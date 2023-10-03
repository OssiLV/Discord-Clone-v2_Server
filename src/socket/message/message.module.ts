import { Module } from "@nestjs/common";
import { MessageController } from "./message.controller";
import { MessageService } from "./message.service";
import { ChatGateWay } from "./chat.gateway";

@Module({
    controllers: [MessageController],
    providers: [MessageService, ChatGateWay],
})
export class MessageModule {}

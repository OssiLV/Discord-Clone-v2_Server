import { Header, Logger, UseGuards } from "@nestjs/common";
import {
    ConnectedSocket,
    MessageBody,
    OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from "@nestjs/websockets";
import { Socket } from "dgram";
import { Server } from "net";
import { MessageService } from "./message.service";
import { AuthGuard } from "src/auth/guards";
import { GetUser } from "src/users/decrator";
import { User } from "src/types";

@WebSocketGateway(80, { cors: { credentials: true } })
export class ChatGateWay implements OnGatewayInit {
    private readonly logger = new Logger(ChatGateWay.name);
    constructor(private readonly messageService: MessageService) {}

    afterInit(server: any) {}
    @WebSocketServer()
    server: Socket;

    @UseGuards(AuthGuard)
    @SubscribeMessage("chat")
    async testMessage(@MessageBody() body: any, @GetUser() user: User) {
        const resposne = await this.messageService.createMessage(body, user);
        console.log(resposne);

        this.server.emit(resposne.channelKey, resposne.message);
    }
}

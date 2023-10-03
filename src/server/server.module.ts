import { Module } from "@nestjs/common";
import { ServerController } from "./server.controller";
import { ServerService } from "./server.service";
import { JwtModule } from "@nestjs/jwt";

@Module({
    controllers: [ServerController],
    providers: [ServerService],
})
export class ServerModule {}

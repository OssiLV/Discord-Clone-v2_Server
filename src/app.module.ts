import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { AuthModule } from "./auth/auth.module";
import { PrismaModule } from "./prisma/prisma.module";
import { UsersModule } from "./users/users.module";

import { FileUploadModule } from "./file-upload/file-upload.module";
import { ServerModule } from "./server/server.module";
import { JwtModule } from "@nestjs/jwt";
import { ExtensionsModule } from "./extensions/extensions.module";
import { ChannelModule } from "./channel/channel.module";
import { MessageModule } from "./socket/message/message.module";

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        JwtModule.register({ global: true }),
        AuthModule,
        PrismaModule,
        UsersModule,
        FileUploadModule,
        ServerModule,
        ExtensionsModule,
        ChannelModule,
        MessageModule,
    ],
})
export class AppModule {}

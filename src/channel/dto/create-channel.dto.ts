import { ChannelType } from "@prisma/client";
import { IsOptional, IsString, IsUUID } from "class-validator";

export class CreateChannelDto {
    @IsString()
    name: string;

    @IsString()
    type: ChannelType;

    @IsUUID()
    serverId: string;
}

import { IsOptional, IsString } from "class-validator";

export class CreateServerDto {
    @IsString()
    name: string;

    @IsString()
    @IsOptional()
    imageUrl: string;
}

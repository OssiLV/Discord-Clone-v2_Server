import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class SignUpDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}

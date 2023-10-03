import {
    Body,
    Controller,
    Get,
    Post,
    Req,
    UseGuards,
    ValidationPipe,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SignInDto, SignUpDto } from "./dto";
import { AuthGuard } from "./guards";

@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post("/sign-up")
    async signUp(@Body(new ValidationPipe()) signUpDto: SignUpDto) {
        return await this.authService.signUp(signUpDto);
    }

    @Post("/sign-in")
    async signIn(@Body(new ValidationPipe()) signInDto: SignInDto) {
        return await this.authService.signIn(signInDto);
    }

    @UseGuards(AuthGuard)
    @Get("/user")
    getProfile(@Req() req) {
        return req.user;
    }
}

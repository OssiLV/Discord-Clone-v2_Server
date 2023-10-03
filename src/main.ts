import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
    const port = 5174;
    const app = await NestFactory.create(AppModule, {
        cors: true,
    });
    app.setGlobalPrefix("api");
    await app.listen(process.env.PORT || 5174);

    console.log(`App listening on: http://localhost:${process.env.PORT}/api`);
}
bootstrap();

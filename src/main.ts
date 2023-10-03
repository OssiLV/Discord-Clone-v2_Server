import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
    const port = 5174;
    const app = await NestFactory.create(AppModule, {
        cors: true,
    });
    app.setGlobalPrefix("api");
    await app.listen(port);

    console.log(`App listening on: http://localhost:${port}/api`);
}
bootstrap();

import { Global, Module } from "@nestjs/common";
import { ExtensionsService } from "./extensions.service";

@Global()
@Module({
    providers: [ExtensionsService],
    exports: [ExtensionsService],
})
export class ExtensionsModule {}

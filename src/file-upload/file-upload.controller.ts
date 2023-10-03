import {
    Controller,
    Post,
    UploadedFile,
    UseInterceptors,
} from "@nestjs/common";
import { FileUploadService } from "./file-upload.service";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";

@Controller("file-upload")
export class FileUploadController {
    constructor(private readonly fileUpaloadService: FileUploadService) {}

    @Post("upload")
    @UseInterceptors(FileInterceptor("file"))
    uploadFile(@UploadedFile() file: Express.Multer.File) {
        console.log(file);
    }

    // @Post("upload")
    // @UseInterceptors(
    //     FileInterceptor("file", {
    //         storage: diskStorage({
    //             destination: "./files",
    //             filename(req, file, callback) {
    //                 const name = file.originalname.split(".")[0];
    //                 const fileExtension = file.originalname.split(".")[1];
    //                 const newName =
    //                     name.split(" ").join("_") +
    //                     "_" +
    //                     Date.now() +
    //                     "." +
    //                     fileExtension;

    //                 callback(null, newName);
    //             },
    //         }),
    //         fileFilter(req, file, callback) {
    //             if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    //                 return callback(null, false);
    //             }
    //             callback(null, true);
    //         },
    //     }),
    // )
    // uploadFile(@UploadedFile() file) {
    //     console.log(file);
    // }
}

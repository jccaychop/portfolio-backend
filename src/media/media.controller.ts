import {
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  ParseUUIDPipe,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { MediaService } from './media.service';
import { MediaType } from './enums';
import { ParseMediaTypePipe } from './pipes';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('files', 10))
  upload(
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }), // 5MB
          new FileTypeValidator({
            // Accepts: jpg, jpeg, png, webp, pdf and models 3d (glb/gltf)
            fileType: /.(jpg|jpeg|png|webp|pdf|gltf|glb)$/i,
          }),
        ],
      }),
    )
    files: Express.Multer.File[],
  ) {
    return this.mediaService.upload(files);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.mediaService.findOne(id);
  }

  @Get()
  findAll(@Query('type', ParseMediaTypePipe) type?: MediaType) {
    return this.mediaService.findAll(type);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.mediaService.remove(id);
  }
}

import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  UploadedFile,
} from '@nestjs/common';
import { Protected } from '../../../common/decorators/protected.decorator';
import { SingleFileUpload } from '../../../shared/modules/app-storage/decorators/upload.decorator';
import { ImageProcessingPipe } from '../../../shared/modules/app-storage/pipes/image-processing.pipe';
import { CustomFileParsingPipe } from '../../../shared/modules/app-storage/pipes/parse-file.pipe';
import { Permission } from '../../roles/enums/permission.enum';
import { CreateUploadDto } from '../dtos/requests/create-upload.dto';
import { UploadResponseDto } from '../dtos/responses/upload-response.dto';
import { UploadsService } from '../services/uploads.service';

@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post()
  @Protected(Permission.CREATE_UPLOAD)
  @SingleFileUpload('image')
  async uploadImage(
    @Body() createUploadDto: CreateUploadDto,
    @UploadedFile(CustomFileParsingPipe, ImageProcessingPipe)
    file: Express.Multer.File,
  ): Promise<UploadResponseDto> {
    return this.uploadsService.uploadImage(createUploadDto.personId, file);
  }

  @Delete(':id')
  @Protected(Permission.DELETE_UPLOAD)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteImage(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.uploadsService.deleteImage(id);
  }
}

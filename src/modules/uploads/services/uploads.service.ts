import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TranslateHelper } from '../../../shared/modules/app-i18n/translate.helper';
import { DEFAULT_COMPRESSION_OPTIONS } from '../../../shared/modules/app-storage/constants/file-validation.constants.ts';
import { STORAGE_CONSTANTS } from '../../../shared/modules/app-storage/constants/storage.constants';
import { LocalStorageService } from '../../../shared/modules/app-storage/local-storage.service';
import { PersonsService } from '../../persons/services/persons.service';
import { UploadResponseDto } from '../dtos/responses/upload-response.dto';

@Injectable()
export class UploadsService {
  constructor(
    private readonly personsService: PersonsService,
    private readonly translateHelper: TranslateHelper,

    @Inject(STORAGE_CONSTANTS.STORAGE_PROVIDER_SERVICE)
    private localStorageService: LocalStorageService,
  ) {}

  async uploadImage(
    personId: number,
    file: Express.Multer.File,
  ): Promise<UploadResponseDto> {
    await this.personsService.findOne(personId);
    let imageUrl: any;

    try {
      imageUrl = await this.localStorageService.store(
        file,
        personId.toString(),
      );
    } catch (error: any) {
      throw new BadRequestException(
        this.translateHelper.tr('uploads.errors.upload_failed'),
      );
    }

    return { personId, imageUrl };
  }

  async deleteImage(id: number): Promise<void> {
    try {
      await this.localStorageService.delete(
        `${id}.${DEFAULT_COMPRESSION_OPTIONS.outputFormat}`,
      );
    } catch (error: any) {
      throw new NotFoundException(
        this.translateHelper.tr('uploads.errors.delete_failed'),
      );
    }
  }
}

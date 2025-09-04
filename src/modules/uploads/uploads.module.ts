import { Module } from '@nestjs/common';
import { PersonsModule } from '../persons/persons.module';
import { UploadsController } from './controllers/uploads.controller';
import { UploadsService } from './services/uploads.service';

@Module({
  imports: [PersonsModule],
  controllers: [UploadsController],
  providers: [UploadsService],
  exports: [UploadsService],
})
export class UploadsModule {}

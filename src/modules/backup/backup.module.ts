import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { BackupCron } from './backup-cron';
import { BackupService } from './services/backup.service';

@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [BackupService, BackupCron],
  exports: [BackupService],
})
export class BackupModule {}

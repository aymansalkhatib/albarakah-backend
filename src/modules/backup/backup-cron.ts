import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { BackupService } from './services/backup.service';

@Injectable()
export class BackupCron {
  constructor(private backupService: BackupService) {}

//   @Cron('*/5 * * * * *')
//   async handleBackup() {
//     // await this.backupService.backupDatabase();
//     await this.backupService.restoreDatabase('2025-09-08T01-51-10-005Z');
//   }
}

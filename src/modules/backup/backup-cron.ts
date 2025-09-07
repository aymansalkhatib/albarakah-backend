import { Injectable } from '@nestjs/common';
import { BackupService } from './services/backup.service';

@Injectable()
export class BackupCron {
  constructor(private backupService: BackupService) {}

  //   @Cron('* 12 * * *')
  //   async handleBackup() {
  //     await this.backupService.backupDatabase();
  //   }
}

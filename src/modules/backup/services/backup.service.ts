import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { exec as _exec } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';
import { EnvironmentConfig } from '../../../shared/modules/app-config/env.schema';

const exec = promisify(_exec);

@Injectable()
export class BackupService {
  private baseDir = path.resolve('./backup');
  private uploadDir = path.resolve('./upload'); // المجلد الثابت

  constructor(private readonly config: ConfigService<EnvironmentConfig>) {}

  async backupDatabase(): Promise<void> {
    const [host, port, user, pass, db] = (
      [
        'POSTGRES_HOST',
        'POSTGRES_PORT',
        'POSTGRES_USER',
        'POSTGRES_PASSWORD',
        'POSTGRES_DATABASE',
      ] as const
    ).map((k) => this.config.get<string>(k));

    const folder = new Date().toISOString().replace(/[:.]/g, '-');
    const dir = path.join(this.baseDir, folder);
    fs.mkdirSync(dir, { recursive: true });

    const file = path.join(dir, 'barakah_charity.sql');
    const cmd = `pg_dump -h ${host} -p ${port} -U ${user} -d ${db} -F p -f "${file}"`;

    await exec(cmd, { env: { ...process.env, PGPASSWORD: pass } });
    console.log(`✅ Database backed up to: ${file}`);
  }

  async restoreDatabase(folderName: string): Promise<void> {
    const [host, port, user, pass, db] = (
      [
        'POSTGRES_HOST',
        'POSTGRES_PORT',
        'POSTGRES_USER',
        'POSTGRES_PASSWORD',
        'POSTGRES_DATABASE',
      ] as const
    ).map((k) => this.config.get<string>(k));

    const file = path.join(this.baseDir, folderName, 'barakah_charity.sql');
    if (!fs.existsSync(file)) throw new Error(`Backup not found: ${file}`);

    const cmd = `psql -h ${host} -p ${port} -U ${user} -d ${db} -f "${file}"`;
    await exec(cmd, { env: { ...process.env, PGPASSWORD: pass } });
    console.log(`✅ Database restored from: ${file}`);
  }
}

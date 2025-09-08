import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import archiver from 'archiver';
import { exec } from 'child_process';
import extract from 'extract-zip';
import * as fs from 'fs';
import * as path from 'path';
import { EnvironmentConfig } from '../../../shared/modules/app-config/env.schema';

@Injectable()
export class BackupService {
  private baseDir = path.resolve('./backup');

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
    this.compressFolderToZip(folder);
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

    const terminateCmd = `psql -h ${host} -p ${port} -U ${user} -d postgres -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = '${db}' AND pid <> pg_backend_pid();"`;
    const dropCmd = `dropdb -h ${host} -p ${port} -U ${user} ${db}`;
    const createCmd = `createdb -h ${host} -p ${port} -U ${user} ${db}`;
    const restoreCmd = `psql -h ${host} -p ${port} -U ${user} -d ${db} -f "${file}"`;

    const run = (cmd: string) =>
      new Promise<void>((resolve, reject) => {
        exec(cmd, { env: { ...process.env, PGPASSWORD: pass } }, (error) =>
          error ? reject(error) : resolve(),
        );
      });

    await run(terminateCmd);
    await run(dropCmd);
    await run(createCmd);
    await run(restoreCmd);
    await this.extractZipToFolder(folderName);
    console.log('✅ Database restored');
  }

  private async compressFolderToZip(folderPath: string): Promise<string> {
    const projectRootUpload = path.join(process.cwd(), 'uploads');
    const targetDir = path.join(this.baseDir, folderPath);
    const outputPath = path.join(targetDir, 'upload.zip');

    if (!fs.existsSync(projectRootUpload)) {
      throw new Error(`Upload folder does not exist: ${projectRootUpload}`);
    }

    const stats = fs.statSync(projectRootUpload);
    if (!stats.isDirectory()) {
      throw new Error(`Path is not a directory: ${projectRootUpload}`);
    }

    const files = fs.readdirSync(projectRootUpload);
    if (files.length === 0) {
      throw new Error(`Upload folder is empty: ${projectRootUpload}`);
    }

    fs.mkdirSync(targetDir, { recursive: true });

    return new Promise((resolve, reject) => {
      const output = fs.createWriteStream(outputPath);
      const archive = archiver('zip', { zlib: { level: 9 } });
      output.on('close', () => resolve(outputPath));
      archive.on('error', reject);
      archive.pipe(output);
      archive.directory(projectRootUpload, 'upload');
      archive.finalize();
    });
  }

  private async extractZipToFolder(zipFilePath: string): Promise<string> {
    zipFilePath = path.join(this.baseDir, zipFilePath, 'upload.zip');
    const projectRootUploads = path.join(process.cwd(), 'uploads');
    const backupDir = path.join(process.cwd(), 'uploads_backup');
    const tempExtractDir = path.join(process.cwd(), 'temp_extract');

    try {
      if (fs.existsSync(projectRootUploads)) {
        if (fs.existsSync(backupDir)) {
          fs.rmSync(backupDir, { recursive: true, force: true });
        }
        fs.renameSync(projectRootUploads, backupDir);
      }

      await extract(zipFilePath, { dir: tempExtractDir });

      const uploadFolderInTemp = path.join(tempExtractDir, 'upload');

      if (fs.existsSync(uploadFolderInTemp)) {
        fs.renameSync(uploadFolderInTemp, projectRootUploads);
      } else {
        fs.renameSync(tempExtractDir, projectRootUploads);
      }

      if (fs.existsSync(backupDir)) {
        fs.rmSync(backupDir, { recursive: true, force: true });
      }

      return projectRootUploads;
    } catch (error) {
      if (fs.existsSync(backupDir)) {
        if (fs.existsSync(projectRootUploads)) {
          fs.rmSync(projectRootUploads, { recursive: true, force: true });
        }
        fs.renameSync(backupDir, projectRootUploads);
      }

      if (fs.existsSync(tempExtractDir)) {
        fs.rmSync(tempExtractDir, { recursive: true, force: true });
      }

      throw error;
    }
  }
}

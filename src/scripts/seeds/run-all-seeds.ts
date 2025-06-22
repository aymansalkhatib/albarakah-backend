import { NestFactory } from '@nestjs/core';
import { DataSource } from 'typeorm';
import { AppModule } from 'src/app.module';
import { seedDropdowns } from './seed-dropdown';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const dataSource = app.get(DataSource);
  const queryRunner = dataSource.createQueryRunner();

  try {
    await queryRunner.connect();
    await queryRunner.startTransaction();

    // -1
    await seedDropdowns(queryRunner);
    //

    await queryRunner.commitTransaction();
  } catch (error) {
    await queryRunner.rollbackTransaction();
    console.error('Error seeding dropdown categories:', error);
  } finally {
    await queryRunner.release();
    await app.close();
  }
}

bootstrap()
  .then(() => {
    console.log('✨ Dropdown categories seeder finished successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Dropdown categories seeder failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  });

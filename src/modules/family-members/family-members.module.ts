import { Module } from '@nestjs/common';
import { FamilyMember } from './entities/family-members.entity';
import { FamilyMembersController } from './controllers/family-members.controller';
import { FamilyMembersService } from './services/family-members.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FamilyMemberRepository } from './repositories/family-member.repository';
import { FamiliesModule } from '../families/families.module';

@Module({
  imports: [TypeOrmModule.forFeature([FamilyMember]),FamiliesModule],
  controllers: [FamilyMembersController],
  providers: [FamilyMembersService, FamilyMemberRepository],
  exports: [FamilyMembersService],
})
export class FamilyMembersModule {}

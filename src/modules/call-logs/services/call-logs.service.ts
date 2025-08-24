import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';

import { PaginationResponseDto } from '../../../common/pagination/dto/pagination-response.dto';
import { paginate } from '../../../common/pagination/paginate.service';
import { TranslateHelper } from '../../../shared/modules/app-i18n/translate.helper';

import { EmployeesService } from '../../../modules/employees/services/employee.service';
import { FamilyMembersService } from '../../../modules/family-members/services/family-members.service';
import { GuardiansService } from '../../../modules/guardians/services/guardians.service';
import { SupportersService } from '../../../modules/supporters/services/supporters.service';
import { FilterCallLogDto } from '../dtos/queries/filter-call-log.dto';
import { CreateCallLogDto } from '../dtos/requests/create-call-log.dto';
import { UpdateCallLogDto } from '../dtos/requests/update-call-log.dto';
import { CallLogResponseDto } from '../dtos/responses/call-log-response.dto';
import { CallLog } from '../entities/call-log.entity';
import { ExternalPartyType } from '../enums/recipient-type.enum';

@Injectable()
export class CallLogsService {
  constructor(
    @InjectRepository(CallLog)
    private callLogRepository: Repository<CallLog>,
    private supportersService: SupportersService,
    private employeesService: EmployeesService,
    private guardiansService: GuardiansService,
    private familyMembersService: FamilyMembersService,
    private readonly translateHelper: TranslateHelper,
  ) {}

  async create(createCallLogDto: CreateCallLogDto): Promise<CallLog> {
    let receiver: any;

    const service = await this.getExternalPartyService(createCallLogDto.externalPartyType);

    if (service) {
      receiver = await service.findOne(createCallLogDto.externalPartyId, { relations: ['person'] });
    }

    if (service == null && createCallLogDto.externalPartyType !== ExternalPartyType.OTHER) {
      throw new BadRequestException(this.translateHelper.tr('call-logs.errors.recipient_required'));
    }

    await this.employeesService.findOne(createCallLogDto.responsibleEmployeeId);

    const callLog = this.callLogRepository.create({
      ...createCallLogDto,
      externalPartyId: receiver?.person?.id,
    });
    return await this.callLogRepository.save(callLog);
  }

  async findAll(filterDto: FilterCallLogDto): Promise<PaginationResponseDto<CallLogResponseDto>> {
    const queryBuilder = this.callLogRepository
      .createQueryBuilder('call_log')
      .leftJoinAndSelect('call_log.responsibleEmployee', 'responsibleEmployee')
      .leftJoinAndSelect('call_log.externalParty', 'externalParty')
      .leftJoinAndSelect('responsibleEmployee.person', 'responsibleEmployeePerson');

    if (filterDto.callerNumber) {
      queryBuilder.andWhere('call_log.callerNumber LIKE :callerNumber', {
        callerNumber: `%${filterDto.callerNumber}%`,
      });
    }

    if (filterDto.recipientNumber) {
      queryBuilder.andWhere('call_log.recipientNumber LIKE :recipientNumber', {
        recipientNumber: `%${filterDto.recipientNumber}%`,
      });
    }

    if (filterDto.callStatus) {
      queryBuilder.andWhere('call_log.callStatus = :callStatus', {
        callStatus: filterDto.callStatus,
      });
    }

    if (filterDto.externalPartyId) {
      queryBuilder.andWhere('call_log.externalPartyId = :externalPartyId', {
        externalPartyId: filterDto.externalPartyId,
      });
    }

    if (filterDto.callDirection) {
      queryBuilder.andWhere('call_log.callDirection = :callDirection', {
        callDirection: filterDto.callDirection,
      });
    }

    if (filterDto.callDateFrom && filterDto.callDateTo) {
      queryBuilder.andWhere('call_log.callDate BETWEEN :callDateFrom AND :callDateTo', {
        callDateFrom: filterDto.callDateFrom,
        callDateTo: filterDto.callDateTo,
      });
    } else if (filterDto.callDateFrom) {
      queryBuilder.andWhere('call_log.callDate >= :callDateFrom', {
        callDateFrom: filterDto.callDateFrom,
      });
    } else if (filterDto.callDateTo) {
      queryBuilder.andWhere('call_log.callDate <= :callDateTo', {
        callDateTo: filterDto.callDateTo,
      });
    }

    if (filterDto.responsibleEmployeeName) {
      queryBuilder.andWhere(
        `CONCAT(responsibleEmployeePerson.firstName, ' ', responsibleEmployeePerson.lastName) ILIKE :responsibleEmployeeName`,
        { responsibleEmployeeName: `%${filterDto.responsibleEmployeeName}%` },
      );
    }

    if (filterDto.externalPartyName) {
      queryBuilder.andWhere(
        `CONCAT(externalParty.firstName, ' ', externalParty.lastName) ILIKE :externalPartyName`,
        { externalPartyName: `%${filterDto.externalPartyName}%` },
      );
    }

    return paginate<CallLog, CallLogResponseDto>(queryBuilder, filterDto, CallLogResponseDto);
  }

  async findOne(id: number, options: FindOneOptions<CallLog> = {}): Promise<CallLog> {
    const callLog = await this.callLogRepository.findOne({
      where: { id },
      ...options,
    });

    if (!callLog) {
      throw new NotFoundException(this.translateHelper.tr('call-logs.errors.not_found', { id }));
    }

    return callLog;
  }

  async update(id: number, updateCallLogDto: UpdateCallLogDto): Promise<CallLog> {
    const callLog = await this.findOne(id, {
      relations: ['responsibleEmployee', 'externalParty', 'responsibleEmployee.person'],
    });
    this.callLogRepository.merge(callLog, updateCallLogDto);
    return await this.callLogRepository.save(callLog);
  }

  async delete(id: number): Promise<void> {
    const result = await this.callLogRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(this.translateHelper.tr('call-logs.errors.not_found', { id }));
    }
  }

  private async getExternalPartyService(externalPartyType: ExternalPartyType) {
    const services = {
      [ExternalPartyType.GUARDIAN]: this.guardiansService,
      [ExternalPartyType.FAMILY_MEMBER]: this.familyMembersService,
      [ExternalPartyType.SUPPORTER]: this.supportersService,
    };
    return services[externalPartyType] || null;
  }
}

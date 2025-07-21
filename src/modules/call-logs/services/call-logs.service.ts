import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PaginationResponseDto } from '@app/common/pagination/dto/pagination-response.dto';
import { paginate } from '@app/common/pagination/paginate.service';

import { CallLog } from '../entities/call-log.entity';
import { RecipientType } from '../enums/recipient-type.enum';
import { FamilyMembersService } from '@app/modules/beneficiary-families/family-members.service';
import { SupportersService } from '@app/modules/supporters/supporters.service';
import { FilterCallLogDto } from '../dtos/queries/filter-call-log.dto';
import { CreateCallLogDto } from '../dtos/requests/create-call-log.dto';
import { UpdateCallLogDto } from '../dtos/requests/update-call-log.dto';
import { CallLogResponseDto } from '../dtos/responses/call-log-response.dto';
import { EmployeesService } from '@app/modules/employees/services/employee.service';
import { GuardiansService } from '@app/modules/guardians/services/guardians.service';

@Injectable()
export class CallLogsService {
  constructor(
    @InjectRepository(CallLog)
    private callLogRepository: Repository<CallLog>,
    private supportersService: SupportersService,
    private employeesService: EmployeesService,
    private guardiansService: GuardiansService,
    private familyMembersService: FamilyMembersService,
  ) {}

  async create(createCallLogDto: CreateCallLogDto): Promise<CallLog> {
    let receiver: any;

    const service = await this.getRecipientService(createCallLogDto.recipientType);

    if (service) {
      receiver = await service.findOne(createCallLogDto.receiverId, { relations: ['person'] });
    }

    if (service == null && createCallLogDto.recipientType !== RecipientType.OTHER) {
      throw new BadRequestException(
        'Recipient must be specified when selecting Guardian, Supporter, or Family Member. The recipient field cannot be left empty.',
      );
    }

    await this.employeesService.findOne(createCallLogDto.employeeId);

    const callLog = this.callLogRepository.create({
      ...createCallLogDto,
      personId: receiver?.person?.id,
    });
    return await this.callLogRepository.save(callLog);
  }

  async findAll(filterDto: FilterCallLogDto): Promise<PaginationResponseDto<CallLogResponseDto>> {
    const queryBuilder = this.callLogRepository
      .createQueryBuilder('call_log')
      .leftJoinAndSelect('call_log.person', 'person')
      .leftJoinAndSelect('call_log.employee', 'employee')
      .leftJoinAndSelect('employee.person', 'employeePerson');

    if (filterDto.recipientName) {
      queryBuilder.andWhere(`CONCAT(person.firstName, ' ', person.lastName) ILIKE :recipientName`, {
        recipientName: `%${filterDto.recipientName}%`,
      });
    }

    if (filterDto.callerName) {
      queryBuilder.andWhere(
        `CONCAT(employeePerson.firstName, ' ', employeePerson.lastName) ILIKE :callerName`,
        { callerName: `%${filterDto.callerName}%` },
      );
    }

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

    if (filterDto.receiverId) {
      queryBuilder.andWhere('call_log.receiverId = :receiverId', {
        receiverId: filterDto.receiverId,
      });
    }

    if (filterDto.employeeId) {
      queryBuilder.andWhere('call_log.employeeId = :employeeId', {
        employeeId: filterDto.employeeId,
      });
    }

    if (filterDto.callDateFrom && filterDto.callDateTo) {
      queryBuilder.andWhere(
        'call_log.callDate BETWEEN :callDateFrom AND :callDateTo',
        {
          callDateFrom: filterDto.callDateFrom,
          callDateTo: filterDto.callDateTo,
        },
      );
    } else if (filterDto.callDateFrom) {
      queryBuilder.andWhere('call_log.callDate >= :callDateFrom', {
        callDateFrom: filterDto.callDateFrom,
      });
    } else if (filterDto.callDateTo) {
      queryBuilder.andWhere('call_log.callDate <= :callDateTo', {
        callDateTo: filterDto.callDateTo,
      });
    }

    return paginate<CallLog, CallLogResponseDto>(queryBuilder, filterDto, CallLogResponseDto);
  }

  async findOne(id: number): Promise<CallLog> {
    const callLog = await this.callLogRepository.findOne({
      where: { id },
      relations: ['employee'],
    });

    if (!callLog) {
      throw new NotFoundException(`Call log with ID ${id} was not found.`);
    }

    return callLog;
  }

  async update(id: number, updateCallLogDto: UpdateCallLogDto): Promise<CallLog> {
    const callLog = await this.findOne(id);
    this.callLogRepository.merge(callLog, updateCallLogDto);
    return await this.callLogRepository.save(callLog);
  }

  async delete(id: number): Promise<void> {
    const result = await this.callLogRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Call log with ID ${id} was not found.`);
    }
  }

  private async getRecipientService(recipientType: RecipientType) {
    const services = {
      [RecipientType.GUARDIAN]: this.guardiansService,
      [RecipientType.FAMILY_MEMBER]: this.familyMembersService,
      [RecipientType.SUPPORTER]: this.supportersService,
    };
    return services[recipientType] || null;
  }
}

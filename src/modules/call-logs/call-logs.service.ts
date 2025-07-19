import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { CallLog } from './entities/call-log.entity';
import { Person } from '../persons/entities/person.entity';
import { Employee } from '../employees/entities/employee.entity';
import { CreateCallLogDto } from './dto/create-call-log.dto';
import { UpdateCallLogDto } from './dto/update-call-log.dto';
import { FilterCallLogDto } from './dto/filter-call-log.dto';
import { CallerTypeEnum } from './enums/caller-type.enum';
import { PaginationResponseDto } from '@app/common/pagination/dto/pagination-response.dto';
import { CallLogResponseDto } from './dto/call-log-response.dto';
import { paginate } from '@app/common/pagination/paginate.service';

@Injectable()
export class CallLogsService {
  constructor(
    @InjectRepository(CallLog)
    private callLogRepository: Repository<CallLog>,
    
    @InjectRepository(Person)
    private personRepository: Repository<Person>,
    
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
  ) {}

  async create(createCallLogDto: CreateCallLogDto): Promise<CallLog> {
    const receiver = await this.personRepository.findOne({
      where: { id: createCallLogDto.receiverId }
    });
    
    if (!receiver) {
      throw new NotFoundException('Receiver not found');
    }

    if (createCallLogDto.employeeId) {
      const employee = await this.employeeRepository.findOne({
        where: {
          id: createCallLogDto.employeeId,
          terminationDate: null, // Assuming soft delete
        }
      });
      
      if (!employee) {
        throw new NotFoundException('Employee not found or deleted');
      }
    }

    if (createCallLogDto.callerType === CallerTypeEnum.SUPPORTER || 
        createCallLogDto.callerType === CallerTypeEnum.FAMILY_MEMBER) {
      
      const caller = await this.personRepository.findOne({
        where: { phone: createCallLogDto.callerNumber }
      });
      
      if (!caller) {
        throw new BadRequestException('Caller not found in persons database');
      }
    }

    const callLog = this.callLogRepository.create(createCallLogDto);
    return await this.callLogRepository.save(callLog);
  }

  async findAll(filterDto: FilterCallLogDto): Promise<PaginationResponseDto<CallLogResponseDto>> {
    const queryBuilder = this.createFilteredQuery(filterDto);

    return paginate<CallLog, CallLogResponseDto>(
      queryBuilder,
      filterDto,
      CallLogResponseDto
    );
  }

  async findOne(id: number): Promise<CallLog> {
    const callLog = await this.callLogRepository.findOne({
      where: { id },
      relations: ['receiver', 'employee', 'caller']
    });

    if (!callLog) {
      throw new NotFoundException('Call log not found');
    }

    return callLog;
  }

  async update(id: number, updateCallLogDto: UpdateCallLogDto): Promise<CallLog> {
    const callLog = await this.findOne(id);
    
    Object.assign(callLog, updateCallLogDto);
    return await this.callLogRepository.save(callLog);
  }

  async remove(id: number): Promise<void> {
    const callLog = await this.findOne(id);
    await this.callLogRepository.remove(callLog);
  }

  private createFilteredQuery(filterDto: FilterCallLogDto): SelectQueryBuilder<CallLog> {
    const queryBuilder = this.callLogRepository
      .createQueryBuilder('call_log')
      .leftJoinAndSelect('call_log.receiver', 'receiver')
      .leftJoinAndSelect('call_log.employee', 'employee');

    if (filterDto.callerNumber) {
      queryBuilder.andWhere('call_log.callerNumber LIKE :callerNumber', {
        callerNumber: `%${filterDto.callerNumber}%`
      });
    }

    if (filterDto.recipientNumber) {
      queryBuilder.andWhere('call_log.recipientNumber LIKE :recipientNumber', {
        recipientNumber: `%${filterDto.recipientNumber}%`
      });
    }

    if (filterDto.callStatus) {
      queryBuilder.andWhere('call_log.callStatus = :callStatus', {
        callStatus: filterDto.callStatus,
      });
    }

    if (filterDto.receiverId) {
      queryBuilder.andWhere('call_log.receiverId = :receiverId', {
        receiverId: filterDto.receiverId
      });
    }

    if (filterDto.callerType) {
      queryBuilder.andWhere('call_log.callerType = :callerType', {
        callerType: filterDto.callerType
      });
    }

    if (filterDto.employeeId) {
      queryBuilder.andWhere('call_log.employeeId = :employeeId', {
        employeeId: filterDto.employeeId
      });
    }

    if (filterDto.createdFrom) {
      queryBuilder.andWhere('call_log.createdAt >= :createdFrom', {
        createdFrom: filterDto.createdFrom
      });
    }

    if (filterDto.createdTo) {
      queryBuilder.andWhere('call_log.createdAt <= :createdTo', {
        createdTo: filterDto.createdTo
      });
    }

    return queryBuilder.orderBy('call_log.createdAt', 'DESC');
  }
}
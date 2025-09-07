import { Expose } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';
import { VisitCommitteeEvaluationEnum } from '../../enums/visit-committee-evaluation.enum';
import { VisitCommitteeEvaluation } from '../../interfaces';

export class VisitCommitteeEvaluationDto implements VisitCommitteeEvaluation {
  @Expose()
  @IsOptional()
  @IsEnum(VisitCommitteeEvaluationEnum)
  cleanlinessAndOrder?: VisitCommitteeEvaluationEnum;

  @Expose()
  @IsOptional()
  @IsEnum(VisitCommitteeEvaluationEnum)
  generalMorals?: VisitCommitteeEvaluationEnum;

  @Expose()
  @IsOptional()
  @IsEnum(VisitCommitteeEvaluationEnum)
  physicalAndMentalHealth?: VisitCommitteeEvaluationEnum;

  @Expose()
  @IsOptional()
  @IsEnum(VisitCommitteeEvaluationEnum)
  surroundingEnvironment?: VisitCommitteeEvaluationEnum;
}

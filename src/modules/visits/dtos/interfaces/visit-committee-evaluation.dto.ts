import { IsEnum, IsOptional } from 'class-validator';
import { VisitCommitteeEvaluation } from '../../interfaces';
import { VisitCommitteeEvaluationEnum } from '../../enums/visit-committee-evaluation.enum';

export class VisitCommitteeEvaluationDto implements VisitCommitteeEvaluation {
  @IsOptional()
  @IsEnum(VisitCommitteeEvaluationEnum)
  cleanlinessAndOrder?: VisitCommitteeEvaluationEnum;

  @IsOptional()
  @IsEnum(VisitCommitteeEvaluationEnum)
  generalMorals?: VisitCommitteeEvaluationEnum;

  @IsOptional()
  @IsEnum(VisitCommitteeEvaluationEnum)
  physicalAndMentalHealth?: VisitCommitteeEvaluationEnum;

  @IsOptional()
  @IsEnum(VisitCommitteeEvaluationEnum)
  surroundingEnvironment?: VisitCommitteeEvaluationEnum;
}

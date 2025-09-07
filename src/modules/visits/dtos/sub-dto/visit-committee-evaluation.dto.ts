import { IsEnum, IsOptional } from 'class-validator';
import { VisitCommitteeEvaluationEnum } from '../../enums/visit-committee-evaluation.enum';
import { VisitCommitteeEvaluation } from '../../interfaces';

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

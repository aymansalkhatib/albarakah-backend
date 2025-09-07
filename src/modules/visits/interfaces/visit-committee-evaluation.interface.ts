import { VisitCommitteeEvaluationEnum } from "../enums/visit-committee-evaluation.enum";

export interface VisitCommitteeEvaluation {
  cleanlinessAndOrder?: VisitCommitteeEvaluationEnum;
  generalMorals?: VisitCommitteeEvaluationEnum;
  physicalAndMentalHealth?: VisitCommitteeEvaluationEnum;
  surroundingEnvironment?: VisitCommitteeEvaluationEnum;
}

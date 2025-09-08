import { QueryRunner } from 'typeorm';
import { EmergencyAidRequest } from '../../modules/emergency-aid-request/entities/emergency-aid-request.entity';
import { EmergencyAidRequestStatus } from '../../modules/emergency-aid-request/enums/emergency-aid-request-status.enum';
import { Family } from '../../modules/families/entities/families.entity';

export async function seedEmergencyAidRequests(queryRunner: QueryRunner) {
  const emergencyAidRepo =
    queryRunner.manager.getRepository(EmergencyAidRequest);
  const familyRepo = queryRunner.manager.getRepository(Family);

  for (let i = 1; i <= 100; i++) {
    const existingFamily = await familyRepo.findOne({
      where: { id: i },
    });

    if (!existingFamily) {
      console.log(`❌ Family with id ${i} not found, skipping.`);
      continue;
    }

    const requestCount = Math.floor(Math.random() * 5) + 1;
    for (let j = 1; j <= requestCount; j++) {
      await emergencyAidRepo.save(
        emergencyAidRepo.create(generateEmergencyAidRequest(i)),
      );
    }
  }

  console.log('✅ Emergency Aid Requests seeded successfully.');
}

function getRandomEnumValue<T>(enumObj: T): T[keyof T] {
  const values = Object.values(enumObj) as T[keyof T][];
  return values[Math.floor(Math.random() * values.length)];
}

function generateEmergencyAidRequest(familyId: number) {
  const emergencyType =
    emergencyTypes[Math.floor(Math.random() * emergencyTypes.length)];
  const requestedAmount = generateAmount(emergencyType.baseAmount);
  const status = getRandomEnumValue(EmergencyAidRequestStatus);
  const requestDate = generateRandomDate();

  const { disbursedAmount, disbursementDate } = generateDisbursementData(
    status,
    requestedAmount,
    requestDate,
  );

  return {
    familyId,
    requestStatus: status,
    requestedAmount,
    disbursedAmount,
    notes: generateNotes(emergencyType.type, status, disbursedAmount),
    requestDate,
    disbursementDate,
    createdAt: requestDate,
    updatedAt: requestDate,
  };
}

function generateAmount(baseAmount: number): number {
  const variation = 0.3;
  const min = baseAmount * (1 - variation);
  const max = baseAmount * (1 + variation);

  const randomValue = Math.floor(Math.random() * (max - min) + min);

  const step = 50000;
  return Math.round(randomValue / step) * step;
}

function generateRandomDate(): Date {
  const now = new Date();
  const sixMonthsAgo = new Date(now.getTime() - 6 * 30 * 24 * 60 * 60 * 1000);
  return new Date(
    sixMonthsAgo.getTime() +
      Math.random() * (now.getTime() - sixMonthsAgo.getTime()),
  );
}

function generateDisbursementData(
  status: EmergencyAidRequestStatus,
  requestedAmount: number,
  requestDate: Date,
) {
  if (status !== EmergencyAidRequestStatus.DISBURSED) {
    return { disbursedAmount: undefined, disbursementDate: undefined };
  }

  const disbursedAmount = Math.floor(
    requestedAmount * (0.8 + Math.random() * 0.2),
  );
  const now = new Date();
  const disbursementDate = new Date(
    requestDate.getTime() +
      Math.random() * (now.getTime() - requestDate.getTime()),
  );

  return { disbursedAmount, disbursementDate };
}

function generateNotes(
  emergencyType: string,
  status: EmergencyAidRequestStatus,
  disbursedAmount?: number,
): string {
  const statusNotes = notesTemplates[status];
  const randomNote =
    statusNotes[Math.floor(Math.random() * statusNotes.length)];

  if (status === EmergencyAidRequestStatus.DISBURSED && disbursedAmount) {
    return `${emergencyType} - تم صرف ${disbursedAmount.toLocaleString()} ليرة سورية`;
  }

  return `${emergencyType} - ${randomNote}`;
}

const emergencyTypes = [
  {
    type: 'حالة طبية طارئة',
    baseAmount: 5000000,
    priority: 'عالية',
  },
  {
    type: 'إيجار متأخر',
    baseAmount: 3000000,
    priority: 'عالية',
  },
  {
    type: 'فاتورة كهرباء مقطوعة',
    baseAmount: 1500000,
    priority: 'متوسطة',
  },
  {
    type: 'أدوية ضرورية',
    baseAmount: 2000000,
    priority: 'عالية',
  },
  {
    type: 'طعام للأطفال',
    baseAmount: 1000000,
    priority: 'عالية',
  },
  {
    type: 'إصلاح طارئ للمنزل',
    baseAmount: 4000000,
    priority: 'متوسطة',
  },
  {
    type: 'رسوم مدرسية متأخرة',
    baseAmount: 1200000,
    priority: 'متوسطة',
  },
  {
    type: 'مواد تدفئة',
    baseAmount: 1800000,
    priority: 'عالية',
  },
  {
    type: 'نقل للمستشفى',
    baseAmount: 800000,
    priority: 'عالية',
  },
  {
    type: 'ملابس شتوية عاجلة',
    baseAmount: 1500000,
    priority: 'متوسطة',
  },
];

const notesTemplates: Record<EmergencyAidRequestStatus, string[]> = {
  [EmergencyAidRequestStatus.PENDING]: [
    'طلب في انتظار المراجعة من قبل اللجنة المختصة',
    'حالة طارئة تحتاج لتدخل سريع - قيد الدراسة',
    'تم استلام الطلب وجاري التحقق من البيانات المطلوبة',
    'في انتظار اكتمال الوثائق المطلوبة للمراجعة',
    'طلب مساعدة عاجلة - تحت المراجعة الأولية',
  ],
  [EmergencyAidRequestStatus.APPROVED]: [
    'تم الموافقة على الطلب من قبل اللجنة',
    'الطلب معتمد ومقبول - جاري التحضير للصرف',
    'موافقة نهائية على تقديم المساعدة المطلوبة',
    'تم اعتماد الطلب بناء على دراسة الحالة',
    'موافقة إدارية على تقديم المساعدة الطارئة',
  ],
  [EmergencyAidRequestStatus.DISBURSED]: [
    'تم تسليم المساعدة المالية للعائلة بنجاح',
    'صرف مكتمل - تم تسليم المبلغ المعتمد',
    'المساعدة تم تقديمها وفقاً للإجراءات المعتمدة',
    'تم إنجاز عملية الصرف وتسليم المبلغ للمستفيد',
    'انتهت عملية الصرف بنجاح وتم توثيق التسليم',
  ],
  [EmergencyAidRequestStatus.REJECTED]: [
    'الطلب غير مؤهل وفقاً لمعايير المساعدة الطارئة',
    'تم رفض الطلب لعدم استيفاء الشروط المطلوبة',
    'لا يحقق الطلب معايير الحالة الطارئة المحددة',
    'رفض الطلب بناء على دراسة اللجنة المختصة',
    'الطلب لا يتوافق مع سياسة تقديم المساعدات الطارئة',
  ],
  [EmergencyAidRequestStatus.CANCELLED]: [
    'تم إلغاء الطلب بناء على طلب مقدم الطلب',
    'الطلب ملغي - لم تعد هناك حاجة للمساعدة',
    'إلغاء الطلب بسبب تحسن الظروف المالية للعائلة',
    'تم سحب الطلب من قبل المتقدم لأسباب شخصية',
    'إلغاء بناء على رغبة العائلة وعدم الحاجة للمساعدة',
  ],
};

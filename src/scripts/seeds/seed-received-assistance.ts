import { QueryRunner } from 'typeorm';
import { Family } from '../../modules/families/entities/families.entity';
import { ReceivedAssistance } from '../../modules/received-assistance/entities/received-assistance.entity';
import { AssistanceType } from '../../modules/received-assistance/enums/assistance-type.enum';

export async function seedReceivedAssistance(queryRunner: QueryRunner) {
  const receivedAssistanceRepo =
    queryRunner.manager.getRepository(ReceivedAssistance);
  const familyRepo = queryRunner.manager.getRepository(Family);

  const familyCount = await familyRepo.count();

  for (let i = 1; i <= familyCount; i++) {
    const existingFamily = await familyRepo.findOne({
      where: { id: i },
    });

    if (!existingFamily) {
      console.log(`❌ Family with id ${i} not found, skipping.`);
      continue;
    }
    // Generate 1-4 assistance records per family
    const assistanceCount = Math.floor(Math.random() * 5) + 1;

    for (let i = 0; i < assistanceCount; i++) {
      const assistanceData = generateReceivedAssistance(existingFamily.id);
      await receivedAssistanceRepo.save(
        receivedAssistanceRepo.create(assistanceData),
      );
    }
  }

  console.log('✅ Received assistance seeded successfully.');
}

function getRandomEnumValue<T>(enumObj: T): T[keyof T] {
  const values = Object.values(enumObj) as T[keyof T][];
  return values[Math.floor(Math.random() * values.length)];
}

function generateReceivedAssistance(familyId: number) {
  const assistanceType = getRandomEnumValue(AssistanceType);
  const assistanceData = assistanceTypesData[assistanceType];
  const randomNote =
    assistanceData.notes[
      Math.floor(Math.random() * assistanceData.notes.length)
    ];

  // Generate random delivery date within the last 2 years
  const now = new Date();
  const twoYearsAgo = new Date(
    now.getFullYear() - 2,
    now.getMonth(),
    now.getDate(),
  );
  const randomTime =
    twoYearsAgo.getTime() +
    Math.random() * (now.getTime() - twoYearsAgo.getTime());
  const deliveryDate = new Date(randomTime);

  return {
    familyId,
    assistanceType,
    amount: assistanceData.amount
      ? Math.round(
          (Math.floor(Math.random() * assistanceData.amount.max) +
            assistanceData.amount.min) /
            50000,
        ) * 50000
      : null,
    deliveryDate,
    notes: randomNote,
  };
}

const assistanceTypesData = {
  [AssistanceType.CASH]: {
    amount: { min: 500000, max: 5000000 },
    notes: [
      'مساعدة نقدية لتغطية النفقات الطارئة',
      'دعم مالي لدفع الإيجار الشهري',
      'مساعدة نقدية لتغطية فواتير الكهرباء والمياه',
      'دعم مالي لشراء الأدوية الضرورية',
      'مساعدة نقدية لتغطية تكاليف النقل',
      'دعم مالي لشراء المواد الغذائية الأساسية',
      'مساعدة نقدية لتغطية رسوم التعليم',
      'دعم مالي لدفع الديون المستحقة',
    ],
  },
  [AssistanceType.FOOD]: {
    amount: { min: 200000, max: 1500000 },
    notes: [
      'سلة غذائية شهرية تحتوي على المواد الأساسية',
      'مواد غذائية خاصة لشهر رمضان المبارك',
      'سلة غذائية للأطفال تحتوي على الحليب والوجبات الصحية',
      'مواد غذائية لتغطية الاحتياجات الأسبوعية',
      'سلة غذائية تحتوي على الحبوب والزيوت والخضروات',
      'مواد غذائية خاصة للمرضى والسكري',
      'سلة غذائية للعطل والأعياد',
      'مواد غذائية طازجة من السوق المحلي',
    ],
  },
  [AssistanceType.CLOTHES]: {
    amount: { min: 100000, max: 800000 },
    notes: [
      'ملابس شتوية لتدفئة الأسرة في الأجواء الباردة',
      'ملابس صيفية مناسبة للحرارة والرطوبة',
      'أحذية لجميع أفراد الأسرة حسب المقاس',
      'ملابس مدرسية للأطفال',
      'ملابس داخلية ضرورية ونظيفة',
      'ملابس خاصة بذوي الاحتياجات الخاصة',
      'ملابس للعطل والأعياد',
      'ملابس مستعملة في حالة جيدة',
    ],
  },
  [AssistanceType.MEDICINE]: {
    amount: { min: 150000, max: 2000000 },
    notes: [
      'أدوية عاجلة لعلاج الحالات الطارئة',
      'أدوية للأمراض المزمنة مثل السكري وارتفاع الضغط',
      'أدوية الأطفال والرضع',
      'مستلزمات طبية مثل الضمادات والقطن',
      'أدوية للعلاج النفسي والاكتئاب',
      'أدوية للعلاج الطبيعي وإعادة التأهيل',
      'أدوية للطوارئ والحوادث',
      'أدوية مهدئة ومضادة للالتهاب',
    ],
  },
  [AssistanceType.SHELTER]: {
    amount: { min: 1000000, max: 8000000 },
    notes: [
      'دفع الإيجار الشهري للمسكن',
      'تنفيذ أعمال الصيانة الضرورية في المنزل',
      'توفير الأثاث المنزلي الأساسي',
      'تغطية فواتير المرافق مثل الكهرباء والمياه',
      'تحسين المسكن لضمان بيئة آمنة وصحية',
      'توفير مواد البناء لإصلاح المنزل',
      'تغطية تكاليف النقل للمسكن المؤقت',
      'توفير معدات التدفئة والتبريد',
    ],
  },
  [AssistanceType.EDUCATION]: {
    amount: { min: 200000, max: 3000000 },
    notes: [
      'توفير الكتب المدرسية لجميع المراحل التعليمية',
      'أدوات القرطاسية مثل الأقلام والدفاتر والألوان',
      'الحقيبة المدرسية لضمان استعداد الطفل للمدرسة',
      'الزي المدرسي الرسمي لكل الطلاب',
      'تغطية رسوم التعليم والامتحانات',
      'الأدوات التعليمية مثل اللوحات التعليمية',
      'توفير أجهزة الكمبيوتر والإنترنت للتعلم',
      'دعم الطلاب المتفوقين والمحتاجين',
    ],
  },
  [AssistanceType.HYGIENE]: {
    amount: { min: 50000, max: 500000 },
    notes: [
      'مواد النظافة الشخصية مثل الصابون والشامبو',
      'مواد تنظيف المنزل والمطهرات',
      'حفاضات الأطفال والمواد الخاصة بالرضع',
      'مواد النظافة النسائية',
      'مواد العناية بالشعر والبشرة',
      'مواد تنظيف الملابس والغسيل',
      'مواد النظافة للأسنان والعناية بالفم',
      'مواد النظافة للمرضى والمسنين',
    ],
  },
  [AssistanceType.TRANSPORTATION]: {
    amount: { min: 100000, max: 1000000 },
    notes: [
      'تذاكر النقل العام للأفراد ذوي الاحتياجات',
      'تغطية تكاليف وقود المركبات الخاصة',
      'إصلاح المركبات لضمان سلامة الاستخدام',
      'خدمات التوصيل للمرضى والمسنين',
      'تأمين المركبة لتقليل المخاطر المالية',
      'توفير دراجة هوائية للتنقل اليومي',
      'تغطية تكاليف النقل للطوارئ الطبية',
      'توفير وسائل النقل للطلاب',
    ],
  },
  [AssistanceType.OTHER]: {
    amount: { min: 100000, max: 2000000 },
    notes: [
      'أجهزة كهربائية أساسية مثل الثلاجات والغسالات',
      'معدات طبية منزلية مثل أجهزة قياس الضغط',
      'أدوات العمل اليدوية والمعدات المهنية',
      'خدمات الاستشارة النفسية والاجتماعية',
      'تدريب مهني لتأهيل الشباب لسوق العمل',
      'رعاية الأطفال داخل الأسرة أو في مراكز متخصصة',
      'دعم قانوني لمواجهة القضايا القانونية',
      'برامج التأهيل الاجتماعي',
    ],
  },
};

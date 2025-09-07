import { QueryRunner } from 'typeorm';
import { Family } from '../../modules/families/entities/families.entity';
import { FamilyNeed } from '../../modules/family-needs/entities/family-need.entity';
import { FamilyNeedStatus } from '../../modules/family-needs/enums/family-need-status.enum';
import { PriorityLevel } from '../../modules/family-needs/enums/priority-level.enum';

export async function seedFamilyNeeds(queryRunner: QueryRunner) {
  const familyNeedRepo = queryRunner.manager.getRepository(FamilyNeed);
  const familyRepo = queryRunner.manager.getRepository(Family);

  for (let i = 1; i <= 100; i++) {
    const existingFamily = await familyRepo.findOne({
      where: { id: i },
    });

    if (!existingFamily) {
      console.log(`❌ Family with id ${i} not found, skipping.`);
      continue;
    }

    const needCount = Math.floor(Math.random() * 5) + 1;
    for (let j = 1; j <= needCount; j++) {
      await familyNeedRepo.save(familyNeedRepo.create(generateFamilyNeed(i)));
    }
  }
    console.log('✅ Family needs seeded successfully.');

}

function getRandomEnumValue<T>(enumObj: T): T[keyof T] {
  const values = Object.values(enumObj) as T[keyof T][];
  return values[Math.floor(Math.random() * values.length)];
}

function generateFamilyNeed(familyId: number) {
  const data = needTypes[Math.floor(Math.random() * needTypes.length)];
  const notes = data.notes[Math.floor(Math.random() * data.notes.length)];

  return {
    familyId,
    needType: data.type,
    notes: notes,
    quantity: Math.floor(Math.random() * 10) + 1,
    priorityLevel: getRandomEnumValue(PriorityLevel),
    status: getRandomEnumValue(FamilyNeedStatus),
  };
}

const needTypes = [
  {
    type: 'اللوازم الطبية',
    notes: [
      'الأدوية العاجلة لعلاج الحالات الطارئة والمزمنة',
      'إجراء الفحص الدوري للتأكد من صحة أفراد الأسرة',
      'توفير دعم للأمراض المزمنة مثل السكري وارتفاع الضغط',
      'تغطية الاحتياجات الطبية العاجلة في حالات الطوارئ',
      'العلاج الطبيعي وإعادة التأهيل بعد الإصابات أو العمليات',
    ],
  },
  {
    type: 'المواد الغذائية',
    notes: [
      'توفير البقالة الأسبوعية لضمان التغذية الأساسية',
      'تلبية احتياجات النظام الغذائي الخاص لأفراد الأسرة',
      'تقديم دعم غذائي للأطفال لضمان نمو صحي',
      'توفير مواد غذائية خاصة لشهر رمضان المبارك',
      'تغطية المواد الغذائية الأساسية اليومية مثل الحبوب والزيوت والخضروات',
    ],
  },
  {
    type: 'اللوازم المدرسية',
    notes: [
      'توفير أدوات القرطاسية مثل الأقلام والدفاتر والألوان',
      'الحقيبة المدرسية لضمان استعداد الطفل للمدرسة',
      'الكتب المدرسية لجميع المراحل التعليمية',
      'توفير الزي المدرسي الرسمي لكل الطلاب',
      'الأدوات التعليمية مثل اللوحات التعليمية والأجهزة المساعدة للتعلم',
    ],
  },
  {
    type: 'دعم السكن',
    notes: [
      'دفع الإيجار الشهري للمسكن لتأمين السكن للعائلة',
      'تنفيذ أعمال الصيانة الضرورية في المنزل',
      'توفير الأثاث المنزلي الأساسي والمعدات اللازمة',
      'تغطية فواتير المرافق مثل الكهرباء والمياه والغاز',
      'تحسين المسكن لضمان بيئة آمنة وصحية للعيش',
    ],
  },
  {
    type: 'الملابس',
    notes: [
      'توفير ملابس الشتاء لتدفئة الأسرة في الأجواء الباردة',
      'توفير ملابس الصيف المناسبة للحرارة والرطوبة',
      'الأحذية لجميع أفراد الأسرة حسب المقاس',
      'تلبية احتياجات الملابس الخاصة بذوي الاحتياجات الخاصة',
      'توفير الملابس الداخلية الضرورية والنظيفة لجميع أفراد الأسرة',
    ],
  },
  {
    type: 'الدعم المالي',
    notes: [
      'تقديم مساعدة نقدية عاجلة لتغطية النفقات الطارئة',
      'دفع الديون المستحقة لتخفيف الأعباء المالية',
      'تغطية رسوم التعليم للأطفال والشباب',
      'توفير تكاليف النقل اليومية أو للطوارئ',
      'دعم بدء مشروع صغير لتعزيز دخل الأسرة المستدام',
    ],
  },
  {
    type: 'الأجهزة والمعدات',
    notes: [
      'توفير الأجهزة الكهربائية الأساسية مثل الثلاجات والغسالات',
      'أجهزة التدفئة والتبريد لضمان بيئة مناسبة للمعيشة',
      'المعدات الطبية المنزلية مثل أجهزة قياس الضغط والسكري',
      'أجهزة الاتصال والهواتف لتسهيل التواصل',
      'أدوات العمل اليدوية والمعدات المهنية اللازمة لكسب العيش',
    ],
  },
  {
    type: 'الخدمات الاجتماعية',
    notes: [
      'الاستشارة النفسية للأفراد لمواجهة الضغوط والمشاكل النفسية',
      'توفير التدريب المهني لتأهيل الشباب لسوق العمل',
      'خدمات رعاية الأطفال داخل الأسرة أو في مراكز متخصصة',
      'الدعم القانوني لمواجهة القضايا أو المعاملات القانونية',
      'برامج التأهيل الاجتماعي لإدماج الأفراد في المجتمع بشكل فعال',
    ],
  },
  {
    type: 'النقل والمواصلات',
    notes: [
      'توفير تذاكر النقل العام للأفراد ذوي الاحتياجات أو الطلاب',
      'تغطية تكاليف وقود المركبات الخاصة بالعائلة',
      'إصلاح المركبات لضمان سلامة الاستخدام اليومي',
      'خدمات التوصيل للمرضى والمسنين إلى المراكز الصحية',
      'تأمين المركبة لتقليل المخاطر المالية في حالة الحوادث',
    ],
  },
  {
    type: 'الاحتياجات الخاصة',
    notes: [
      'توفير المعدات المساعدة لذوي الإعاقة لتحسين القدرة على الحركة',
      'الأدوات التعليمية الخاصة مثل الكتب المكبرة أو الأجهزة السمعية',
      'الرعاية المنزلية اليومية للأفراد الذين يحتاجون إلى مساعدة',
      'العلاج التخصصي مثل العلاج الطبيعي أو التأهيل النفسي',
      'التدريب على المهارات الحياتية لضمان الاستقلالية قدر الإمكان',
    ],
  },
];

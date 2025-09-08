import { QueryRunner } from 'typeorm';
import { CourseBatch } from '../../modules/training-courses/entities/course-batch.entity';
import { TrainingCourse } from '../../modules/training-courses/entities/training-course.entity';

export async function seedCourseBatches(queryRunner: QueryRunner) {
  const courseBatchRepo = queryRunner.manager.getRepository(CourseBatch);
  const trainingCourseRepo = queryRunner.manager.getRepository(TrainingCourse);

  for (let i = 1; i <= 30; i++) {
    const trainingCourse = await trainingCourseRepo.findOne({
      where: { id: i },
    });

    const courseBatch = await courseBatchRepo.save(
      courseBatchRepo.create(generateBatch(trainingCourse, i)),
    );
  }

  console.log('🎉 Course batches seeding completed successfully!');
}

const randomElement = <T>(arr: T[]): T =>
  arr[Math.floor(Math.random() * arr.length)];

const randomDateInRange = (start: Date, end: Date): Date => {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime()),
  );
};

export const generateBatch = (trainingCourse: TrainingCourse, i: number) => {
  const startDate = randomDateInRange(
    new Date(2024, 0, 1),
    new Date(2025, 11, 31),
  );
  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + (1 + Math.floor(Math.random() * 3))); // مدة بين 1-3 أشهر

  return {
    trainingCourseId: trainingCourse.id,
    batchNumber: i,
    startDate,
    endDate,
    location: randomElement(locations),
    notes: randomElement(notesSamples),
  };
};

const locations = [
  'قاعة التدريب - الطابق الأول',
  'قاعة التدريب - الطابق الثاني',
  'قاعة الحاسوب - المبنى الرئيسي',
  'قاعة الأنشطة - المبنى B',
  'حديقة الجمعية - المنطقة الشرقية',
  'مركز الأسرة - الطابق الأرضي',
  'مركز المهارات الحياتية - المبنى الجديد',
  'قاعة الطفل والأم - الدور الثالث',
  'المكتبة المجتمعية - قاعة الورشات',
  'مسرح الجمعية - قاعة الأنشطة الكبرى',
  'مركز التدريب الطبي - الطابق الأول',
  'قاعة الفنون والحرف - المبنى C',
  'قاعة التغذية والصحة - الطابق الثاني',
  'ورشة الحرف اليدوية - المبنى D',
  'قاعة الإدارة المنزلية - الطابق الرابع',
  'غرفة الاستشارات الأسرية - الطابق الأرضي',
  'مركز الطفولة المبكرة - قاعة 101',
  'مركز الشباب والرياضة - الطابق العلوي',
  'ساحة الأنشطة الخارجية - الحديقة الخلفية',
  'مركز التطوير المهني - المبنى A',
  'قاعة الإبداع - الدور الأول',
  'قاعة التربية الإيجابية - الطابق الثاني',
  'معمل الخياطة والتطريز - المبنى E',
  'مطبخ التدريب المجتمعي - الطابق الأرضي',
];

const notesSamples = [
  'الدفعة موجهة للمبتدئات مع أنشطة تفاعلية وتطبيق عملي مستمر',
  'إضافة وحدات جديدة بناءً على آراء المشاركات من الدفعات السابقة',
  'البرنامج يتضمن تدريب عملي ومشاريع صغيرة يمكن تنفيذها منزليًا',
  'مخصصة للأمهات العاملات مع مراعاة أوقاتهن الصباحية والمسائية',
  'المنهج يركز على التطبيق العملي والتفاعل الجماعي بدل المحاضرات النظرية فقط',
  'تشمل جلسات استشارية ودعم نفسي موازٍ لتقوية الجانب المعنوي للأمهات',
  'تطبيق استراتيجيات حديثة في التعليم الأسري والتربية الإيجابية',
  'إدماج تقنيات حديثة في التدريب مثل العروض التفاعلية والفيديوهات',
  'الدفعة تركّز على بناء الثقة بالنفس وتنمية مهارات التواصل داخل الأسرة',
  'يشمل البرنامج متابعة فردية مع كل مشاركة لتقييم التقدم الشخصي',
  'تم تخصيص أنشطة عملية يمكن تنفيذها مع الأطفال في المنزل',
  'الدورة تحتوي على أمثلة حياتية واقعية وحلول عملية للتحديات اليومية',
  'سيتم تنظيم زيارات ميدانية وأنشطة خارجية كجزء من التدريب',
  'المنهجية قائمة على التعليم بالممارسة والتجريب الفعلي',
  'تشمل جلسات حوارية مع خبراء متخصصين في التربية والصحة',
  'يتم توفير مواد مطبوعة وإلكترونية لدعم عملية التعلم',
  'البرنامج يراعي الفروق الفردية بين المشاركات من حيث الخبرة والمهارات',
  'الدفعة تستفيد من دعم استشاري إضافي عبر المنصة الإلكترونية للجمعية',
  'التدريب يدمج الجانب المعرفي مع الجانب العاطفي والمهاري بشكل متوازن',
  'التركيز على رفع وعي الأمهات بأهمية الصحة النفسية والبدنية',
  'تتضمن الدورة أنشطة ترفيهية موازية لكسر الروتين وتحفيز المشاركة',
  'الدفعة تهدف لتعزيز العلاقات الاجتماعية بين الأمهات وتبادل الخبرات',
  'المحتوى مطور حديثًا وفقًا لأفضل الممارسات العالمية في التعليم الأسري',
  'الدورة تساعد على تحويل المفاهيم النظرية إلى تطبيق عملي يومي',
  'يتم إشراك الأمهات في مشاريع جماعية صغيرة لتعزيز التعاون',
];

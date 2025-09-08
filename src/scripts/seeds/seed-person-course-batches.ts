import { QueryRunner } from 'typeorm';
import { FamilyMember } from '../../modules/family-members/entities/family-members.entity';
import { PersonCourseBatch } from '../../modules/training-courses/entities/person-course-batch.entity';
import { TrainingCourse } from '../../modules/training-courses/entities/training-course.entity';
import { AttendanceStatus } from '../../modules/training-courses/enums/attendance-status.enum';

export async function seedPersonCourseBatches(queryRunner: QueryRunner) {
  const personCourseBatchRepo =
    queryRunner.manager.getRepository(PersonCourseBatch);
  const familyMemberRepo = queryRunner.manager.getRepository(FamilyMember);
  const trainingCourseRepo = queryRunner.manager.getRepository(TrainingCourse);

  const familyMembers = await familyMemberRepo.find();
  const courses = await trainingCourseRepo.find({ relations: ['batches'] });

  if (!familyMembers.length || !courses.length) return;

  const enrollments: PersonCourseBatch[] = [];

  for (const member of familyMembers) {
    // احتمالية عدم المشاركة في أي دورة (33%)
    if (Math.random() < 0.33) continue;

    const participationCount = getRandomInt(1, 3);
    const selectedCourses = getRandomCourses(courses, participationCount);

    for (const course of selectedCourses) {
      if (!course.batches?.length) continue;
      const batch = getRandomItem(course.batches);

      if (await isAlreadyEnrolled(personCourseBatchRepo, member.id, batch.id)) {
        continue;
      }

      const enrollment = createEnrollment(
        personCourseBatchRepo,
        member.id,
        batch.id,
      );

      enrollments.push(enrollment);
    }
  }

  if (enrollments.length) {
    await personCourseBatchRepo.save(enrollments);
  }
}

// ==================== Helper Functions ====================

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomCourses<T>(courses: T[], count: number): T[] {
  return [...courses]
    .sort(() => Math.random() - 0.5)
    .slice(0, Math.min(count, courses.length));
}

function getRandomEnum<T>(enumObject: T): T[keyof T] {
  const values = Object.values(enumObject) as T[keyof T][];
  return getRandomItem(values);
}

function getRandomDate(start: Date, end: Date): Date {
  const startTime = start.getTime();
  const endTime = end.getTime();
  return new Date(startTime + Math.random() * (endTime - startTime));
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

async function isAlreadyEnrolled(
  repo: any,
  familyMemberId: number,
  courseBatchId: number,
): Promise<boolean> {
  const existing = await repo.findOne({
    where: { familyMemberId, courseBatchId },
  });
  return !!existing;
}

function createEnrollment(
  repo: any,
  familyMemberId: number,
  courseBatchId: number,
) {
  const attendanceStatus = getRandomEnum(AttendanceStatus);
  const joinDate = getRandomDate(new Date(2023, 0, 1), new Date(2024, 11, 31));

  return repo.create({
    familyMemberId,
    courseBatchId,
    attendanceStatus,
    evaluation: getEvaluationForStatus(attendanceStatus),
    joinDate,
    dropOutDate:
      attendanceStatus === AttendanceStatus.DROPPED_OUT
        ? addDays(joinDate, getRandomInt(10, 60))
        : null,
    notes: getRandomItem(NOTES_SAMPLES),
  });
}

function getEvaluationForStatus(status: AttendanceStatus): string {
  const evaluationMap = {
    [AttendanceStatus.EXCELLENT_COMMITMENT]: [
      'التزام ممتاز بالحضور والمشاركة الفعالة',
      'أداء متميز مع تفاعل مستمر',
      'التزام كامل بالمواعيد وإنجاز المهام',
    ],
    [AttendanceStatus.GOOD_COMMITMENT]: [
      'التزام جيد بالحضور مع مشاركة إيجابية',
      'أداء جيد مع إنجاز معظم المهام',
      'حضور منتظم مع تفاعل مقبول',
    ],
    [AttendanceStatus.MODERATE_COMMITMENT]: [
      'التزام متوسط مع مشاركة محدودة',
      'حضور غير منتظم مع أداء متوسط',
      'مشاركة متقطعة تحتاج تحسين',
    ],
    [AttendanceStatus.POOR_COMMITMENT]: [
      'التزام ضعيف بالحضور',
      'حضور متقطع مع عدم إنجاز المهام',
      'أداء ضعيف يحتاج متابعة',
    ],
    [AttendanceStatus.MINIMAL_PARTICIPATION]: [
      'مشاركة محدودة جداً',
      'حضور قليل مع عدم التفاعل',
      'مشاركة شبه معدومة',
    ],
    [AttendanceStatus.DROPPED_OUT]: [
      'انسحاب مبكر لظروف شخصية',
      'عدم القدرة على الاستمرار',
      'ترك الدورة لأسباب عائلية',
    ],
  };

  return getRandomItem(evaluationMap[status]);
}

const NOTES_SAMPLES = [
  'أداء ممتاز مع مشاركة فعالة',
  'تحتاج لمزيد من التفاعل',
  'مشاركة إيجابية ومناقشات بناءة',
  'التزام جيد بالمواعيد',
  'تحتاج لتشجيع إضافي',
  'أداء متميز مع مساعدة الآخرين',
  'مشاركة متوسطة قابلة للتحسين',
  'تحتاج لمتابعة فردية',
  'التزام كامل بالتعليمات',
  'مشاركة محدودة تحتاج دعم',
];

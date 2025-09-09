import { QueryRunner } from 'typeorm';
import { Family } from '../../modules/families/entities/families.entity';
import { ArchiveLocation } from '../../modules/families/enums/archive-location.enum';
import { FormOrganizationStatus } from '../../modules/families/enums/form-organization-status.enum';
import { HouseType } from '../../modules/families/enums/house-type.enum';
import { ManagementDecision } from '../../modules/families/enums/management-decision.enum';
import { RequestStatus } from '../../modules/families/enums/request-status.enum';
import { SponsorshipStatus } from '../../modules/families/enums/sponsorship-status.enum';
import { VoucherValue } from '../../modules/families/enums/voucher-value.enum';

export async function seedFamilies(queryRunner: QueryRunner) {
  const familyRepo = queryRunner.manager.getRepository(Family);

  // Empty array for now - data will be added later

  const familiesData: Partial<Family>[] = Array.from(
    { length: 6 },
    (_, i) => {
      const id = i + 1;
      return generateFamily(id);
    },
  );

  for (const familyData of familiesData) {
    const existingFamily = await familyRepo.findOne({
      where: { familyBookNumber: familyData.familyBookNumber },
    });

    if (existingFamily) {
      console.log(
        `❌ Family with book number ${familyData.familyBookNumber} already exists`,
      );
      continue;
    }

    await familyRepo.save(familyRepo.create(familyData));

    console.log(
      `✅ Family ${familyData.familyBookNumber} created successfully`,
    );
  }

  console.log('🎉 Families seeding completed successfully!');
}

function getRandomEnumValue<T>(enumObj: T): T[keyof T] {
  const values = Object.values(enumObj) as T[keyof T][];
  return values[Math.floor(Math.random() * values.length)];
}

function generateFamily(id: number) {
  const now = new Date();
  const twoYearsAgo = new Date(
    now.getFullYear() - 2,
    now.getMonth(),
    now.getDate(),
  );

  const createdAt = new Date(
    twoYearsAgo.getTime() +
      Math.random() * (now.getTime() - twoYearsAgo.getTime()),
  );

  return {
    id,
    familyBookNumber: `${1000 + id * 29}`,
    formNumber: `${1000 + id * 23}`,
    requestNumber: `${1000 + id * 19}`,
    isHusbandPalestinian: Math.random() < 0.5,
    identityDocuments: `${1000 + id * 7}`,
    formOrganizationStatus: getRandomEnumValue(FormOrganizationStatus),
    managementDecision: getRandomEnumValue(ManagementDecision),
    archiveLocation: getRandomEnumValue(ArchiveLocation),
    requestStatus: getRandomEnumValue(RequestStatus),
    previousRequestStatus: getRandomEnumValue(RequestStatus),
    isStatusUpdatedAtSocialAffairs: Math.random() < 0.33,
    isRefugee: Math.random() < 0.2,
    isExtremelyPoor: Math.random() < 0.25,
    sponsorshipStatus: getRandomEnumValue(SponsorshipStatus),
    familyMembersWithGuardianCount: Math.floor(Math.random() * 5) + 1,
    sharedMealMembersCount: Math.floor(Math.random() * 5) + 1,
    voucherValue: getRandomEnumValue(VoucherValue),
    houseType: getRandomEnumValue(HouseType),
    currentResidenceAddress:
      addresses[Math.floor(Math.random() * addresses.length)],
    currentResidenceArea: areas[Math.floor(Math.random() * areas.length)],
    createdAt,
    updatedAt: createdAt,
  };
}

const addresses: string[] = [
  'شارع الزهور، حي الندى، دمشق',
  'شارع فلسطين، حي النصر، حلب',
  'شارع الوحدة، حي الفردوس، اللاذقية',
  'شارع الحرية، حي الأمل، حمص',
  'شارع الملك فيصل، حي الزيتون، درعا',
  'شارع الثورة، حي الحمراء، القنيطرة',
  'شارع النيل، حي الكرامة، دير الزور',
  'شارع عمر بن الخطاب، حي الورد، الرقة',
  'شارع صلاح الدين، حي الياقوت، حماة',
  'شارع الشهداء، حي الصفصاف، طرطوس',
  'شارع البحر، حي المرجان، دمشق',
  'شارع الجبل، حي الفيحاء، حلب',
  'شارع الزيتونة، حي النخيل، اللاذقية',
  'شارع الازهار، حي الورد، حمص',
  'شارع النخيل، حي السلام، درعا',
  'شارع البستان، حي الفلاح، القنيطرة',
  'شارع الياسمين، حي النصر، دير الزور',
  'شارع القرنفل، حي النخيل، الرقة',
  'شارع الأقحوان، حي الفردوس، حماة',
  'شارع الوردة، حي الحمراء، طرطوس',
  'شارع البنفسج، حي الفيحاء، دمشق',
  'شارع التوليب، حي المرجان، حلب',
  'شارع السدرة، حي الزيتون، اللاذقية',
  'شارع النجمة، حي الصفصاف، حمص',
  'شارع القمر، حي الياقوت، درعا',
  'شارع الشمس، حي الفلاح، القنيطرة',
  'شارع الهلال، حي الأمل، دير الزور',
  'شارع الرشيد، حي النصر، الرقة',
  'شارع الحسن، حي النخيل، حماة',
  'شارع الفاتح، حي الفردوس، طرطوس',
  'حي المروج، شارع الزيتون، دمشق',
  'حي السلام، شارع الورد، حلب',
  'حي الندى، شارع النخيل، اللاذقية',
  'حي الزهراء، شارع البستان، حمص',
  'حي الفيروز، شارع النصر، درعا',
  'حي الكرامة، شارع الياقوت، القنيطرة',
  'حي الفلاح، شارع الفردوس، دير الزور',
  'حي الفيحاء، شارع القرنفل، الرقة',
  'حي المرجان، شارع الأقحوان، حماة',
  'حي الحمراء، شارع الوردة، طرطوس',
  'حي النخيل، شارع البنفسج، دمشق',
  'حي الصفصاف، شارع التوليب، حلب',
  'حي الأمل، شارع السدرة، اللاذقية',
  'حي النصر، شارع النجمة، حمص',
  'حي الفردوس، شارع القمر، درعا',
  'حي الزيتون، شارع الشمس، القنيطرة',
  'حي الورد، شارع الهلال، دير الزور',
  'حي البستان، شارع الرشيد، الرقة',
  'حي الياسمين، شارع الحسن، حماة',
  'حي القرنفل، شارع الفاتح، طرطوس',
  'حي الأقحوان، شارع البحر، دمشق',
  'حي الوردة، شارع الجبل، حلب',
  'حي البنفسج، شارع النيل، اللاذقية',
  'حي التوليب، شارع عمر بن الخطاب، حمص',
  'حي السدرة، شارع صلاح الدين، درعا',
  'حي النجمة، شارع الشهداء، القنيطرة',
  'حي القمر، شارع الزيتونة، دير الزور',
  'حي الشمس، شارع الازهار، الرقة',
  'حي الهلال، شارع النخيل، حماة',
  'حي الرشيد، شارع البستان، طرطوس',
  'حي الحسن، شارع الياسمين، دمشق',
  'حي الفاتح، شارع القرنفل، حلب',
  'حي البحر، شارع الأقحوان، اللاذقية',
  'حي الجبل، شارع الوردة، حمص',
  'حي النيل، شارع البنفسج، درعا',
  'حي عمر بن الخطاب، شارع التوليب، القنيطرة',
  'حي صلاح الدين، شارع السدرة، دير الزور',
  'حي الشهداء، شارع النجمة، الرقة',
  'حي الزيتونة، شارع القمر، حماة',
  'حي الازهار، شارع الشمس، طرطوس',
  'حي النخيل، شارع الهلال، دمشق',
  'حي البستان، شارع الرشيد، حلب',
  'حي الياسمين، شارع الحسن، اللاذقية',
  'حي القرنفل، شارع الفاتح، حمص',
  'حي الأقحوان، شارع البحر، درعا',
  'حي الوردة، شارع الجبل، القنيطرة',
  'حي البنفسج، شارع النيل، دير الزور',
  'حي التوليب، شارع عمر بن الخطاب، الرقة',
  'حي السدرة، شارع صلاح الدين، حماة',
  'حي النجمة، شارع الشهداء، طرطوس',
  'حي القمر، شارع الزيتونة، دمشق',
  'حي الشمس، شارع الازهار، حلب',
  'حي الهلال، شارع النخيل، اللاذقية',
  'حي الرشيد، شارع البستان، حمص',
  'حي الحسن، شارع الياسمين، درعا',
  'حي الفاتح، شارع القرنفل، القنيطرة',
  'حي البحر، شارع الأقحوان، دير الزور',
  'حي الجبل، شارع الوردة، الرقة',
  'حي النيل، شارع البنفسج، حماة',
  'حي عمر بن الخطاب، شارع التوليب، طرطوس',
  'حي صلاح الدين، شارع السدرة، دمشق',
  'حي الشهداء، شارع النجمة، حلب',
  'حي الزيتونة، شارع القمر، اللاذقية',
  'حي الازهار، شارع الشمس، حمص',
  'حي النخيل، شارع الهلال، درعا',
  'حي البستان، شارع الرشيد، القنيطرة',
  'حي الياسمين، شارع الحسن، دير الزور',
  'حي القرنفل، شارع الفاتح، الرقة',
  'حي الأقحوان، شارع البحر، حماة',
  'حي الوردة، شارع الجبل، طرطوس',
  'حي البنفسج، شارع النيل، دمشق',
  'حي التوليب، شارع عمر بن الخطاب، حلب',
  'حي السدرة، شارع صلاح الدين، اللاذقية',
  'حي النجمة، شارع الشهداء، حمص',
  'حي القمر، شارع الزيتونة، درعا',
  'حي الشمس، شارع الازهار، القنيطرة',
  'حي الهلال، شارع النخيل، دير الزور',
  'حي الرشيد، شارع البستان، الرقة',
  'حي الحسن، شارع الياسمين، حماة',
  'حي الفاتح، شارع القرنفل، طرطوس',
];

const areas: string[] = [
  'دمشق القديمة',
  'الشيخ محمّد',
  'باب توما',
  'المزة',
  'مخيم اليرموك',
  'كفرسوسة',
  'القابون',
  'حي الأمين',
  'حي القصور',
  'حي المهاجرين',
  'حي البستان',
  'حي البرامكة',
  'حي الرحبة',
  'حي الصالحية',
  'حي الميدان',
  'حي النزلة',
  'حي الشعلان',
  'حي القابون الجنوبي',
  'حي جوبر',
  'حي الرمل',
  'حي المهاجر',
  'حي الزهراء',
  'حي الفداء',
  'حي التل',
  'حي القصور الشمالية',
  'حي القصور الشرقية',
  'حي الزاهرة',
  'حي النصر',
  'حي الوحدة',
  'حي الفردوس',
  'حي الهدى',
  'حي الأمل',
  'حي الياقوت',
  'حي الصفصاف',
  'حي الفيحاء',
  'حي المرجان',
  'حي الكرامة',
  'حي الفلاح',
  'حي الهلال',
  'حي السدرة',
  'حي النخيل',
  'حي البساتين',
  'حي الحمراء',
  'حي الزيتون',
  'حي البحر',
  'حي الجبل',
  'حي النيل',
  'حي الياسمين',
  'حي القرنفل',
  'حي الأقحوان',
  'حي الوردة',
  'حي البنفسج',
  'حي التوليب',
  'حي السعادة',
  'حي الهدوء',
  'حي الرشيد',
  'حي الحسن',
  'حي الفاتح',
  'حي المرج',
  'حي الجلاء',
  'حي الفيروز',
  'حي النرجس',
  'حي التلال',
  'حي القمة',
  'حي الفجر',
  'حي الندى',
  'حي الصفا',
  'حي الورد',
  'حي الزيتونة',
  'حي الياسمين',
  'حي السوسن',
  'حي الأقحوان',
  'حي القرنفل',
  'حي البهاء',
  'حي الياقوت',
  'حي اللؤلؤ',
  'حي المرجان',
  'حي اللوز',
  'حي النخلة',
  'حي الصفصاف',
  'حي العقيق',
  'حي الزمرد',
  'حي الفيروز',
  'حي الياقوتة',
  'حي الجواهر',
  'حي الكرامة',
  'حي الهدى',
  'حي السلام',
  'حي النجمة',
  'حي القمر',
  'حي الشمس',
  'حي الهلال',
  'حي السدرة',
  'حي البنفسج',
  'حي التوليب',
  'حي الوردة',
  'حي القرنفل',
  'حي الأقحوان',
];

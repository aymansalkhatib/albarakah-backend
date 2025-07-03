# مهام تطوير نظام تسجيل المكالمات (Call Logs System)

## نظرة عامة
نظام تسجيل المكالمات مخصص لتتبع وإدارة جميع المكالمات الواردة للجمعية الخيرية، مع إمكانية تسجيل تفاصيل المتصل والمستقبل وحالة المكالمة.

## هيكل البيانات

### جدول call_logs
- **id**: معرف المكالمة (Primary Key)
- **caller_number**: رقم الشخص المتصل (اختياري حسب نوع المتصل)
- **recipient_number**: رقم الشخص المسلم (مطلوب دائماً)
- **call_status**: حالة الاتصال (مطلوب إجباريا - enum)
- **receiver_id**: معرف الشخص الذي استلم الاتصال
- **caller_type**: نوع المتصل (enum: supporter, family_member, other)
- **employee_id**: معرف الموظف (اختياري)
- **note**: ملاحظة (اختيارية)
- **created_at**: تاريخ الإنشاء
- **updated_at**: تاريخ آخر تحديث

## القواعد التجارية (Business Rules)

### 1. التحقق من نوع المتصل
- **إذا كان caller_type = "supporter" أو "family_member"**:
  - caller_number يصبح مطلوباً إجبارياً
  - يجب التأكد من وجود الشخص في قاعدة البيانات
  
- **إذا كان caller_type = "other"**:
  - caller_number غير مطلوب (يمكن أن يكون null)
  - لا حاجة للتحقق من وجود الشخص

### 2. التحقق من الموظف
- إذا تم إدخال employee_id:
  - يجب التأكد من وجود الموظف
  - يجب التأكد أن الموظف فعال (غير محذوف)

### 3. التحقق العام
- recipient_number مطلوب دائماً
- call_status مطلوب إجباريا
- جميع الأرقام يجب التحقق من صحتها

## DTOs المطلوبة

### 1. Create Call Log DTO
```typescript
CreateCallLogDto {
  caller_number?: string; // اختياري حسب caller_type
  recipient_number: string; // مطلوب دائماً
  call_status: CallStatusEnum; // مطلوب
  receiver_id: number; // مطلوب
  caller_type: CallerTypeEnum; // مطلوب
  employee_id?: number; // اختياري
  note?: string; // اختياري
}
```

#### عمليات التحقق في Create DTO:
- **تحقق مشروط**: إذا كان caller_type = supporter أو family_member، فإن caller_number مطلوب
- **تحقق الموظف**: إذا تم إدخال employee_id، التأكد من وجوده وكونه فعال
- **تحقق الشخص**: إذا كان caller_type = supporter أو family_member، التأكد من وجود الشخص
- **تحقق الأرقام**: التأكد من صحة تنسيق الأرقام

### 2. Update Call Log DTO
```typescript
UpdateCallLogDto {
  call_status?: CallStatusEnum; // اختياري للتعديل
  note?: string; // اختياري للتعديل
}
```

**ملاحظة**: التعديل يقتصر على حالة الاتصال والملاحظة فقط.

### 3. Call Log Response DTO
```typescript
CallLogResponseDto {
  id: number;
  caller_number?: string;
  recipient_number: string;
  call_status: CallStatusEnum;
  receiver_id: number;
  caller_type: CallerTypeEnum;
  employee_id?: number;
  note?: string;
  created_at: Date;
  updated_at: Date;
  
  // العلاقات
  receiver?: PersonResponseDto;
  employee?: EmployeeResponseDto;
  caller?: PersonResponseDto; // في حالة supporter أو family_member
}
```

### 4. Filter Call Log DTO
```typescript
FilterCallLogDto extends PaginationQueryDto {
  caller_number?: string;
  recipient_number?: string;
  call_status?: CallStatusEnum;
  receiver_id?: number;
  caller_type?: CallerTypeEnum;
  employee_id?: number;
  created_from?: Date; // البحث بالتاريخ من
  created_to?: Date; // البحث بالتاريخ إلى
}
```

## Enums المطلوبة

### 1. Call Status Enum
```typescript
enum CallStatusEnum {
  ANSWERED = 'answered',
  MISSED = 'missed',
  BUSY = 'busy',
  NO_ANSWER = 'no_answer',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}
```

### 2. Caller Type Enum
```typescript
enum CallerTypeEnum {
  SUPPORTER = 'supporter',
  FAMILY_MEMBER = 'family_member',
  OTHER = 'other'
}
```

## العمليات المطلوبة (API Endpoints)

### 1. إنشاء مكالمة جديدة
- **POST** `/call-logs`
- **Body**: CreateCallLogDto
- **التحقق**:
  - تطبيق جميع قواعد التحقق المذكورة أعلاه
  - التأكد من وجود الموظف إذا تم إدخاله
  - التأكد من وجود الشخص إذا كان نوع المتصل supporter أو family_member

### 2. تعديل مكالمة
- **PATCH** `/call-logs/:id`
- **Body**: UpdateCallLogDto
- **الحقول القابلة للتعديل**: call_status, note فقط

### 3. حذف مكالمة
- **DELETE** `/call-logs/:id`
- **نوع الحذف**: حذف فعلي من قاعدة البيانات (Hard Delete)
- **ليس soft delete**

### 4. جلب مكالمة واحدة
- **GET** `/call-logs/:id`
- **الاستجابة**: CallLogResponseDto مع العلاقات

### 5. جلب جميع المكالمات مع الفلاتر
- **GET** `/call-logs`
- **Query Parameters**: FilterCallLogDto
- **الاستجابة**: مصفوفة من CallLogResponseDto مع pagination

## العلاقات مع الجداول الأخرى

### 1. مع جدول الأشخاص (Persons)
- **receiver_id** → persons.id
- **caller_number** → persons.id (في حالة supporter أو family_member)

### 2. مع جدول الموظفين (Employees)
- **employee_id** → employees.id

### 3. مع جدول الداعمين (Supporters)
- في حالة caller_type = supporter

## خصائص الأمان والتحقق

### 1. التحقق من البيانات
- استخدام class-validator للتحقق من البيانات
- التحقق المشروط باستخدام decorators مخصصة
- التحقق من تنسيق الأرقام

### 2. التحقق من الوجود
- التأكد من وجود الموظف قبل الربط
- التأكد من وجود الشخص قبل الربط
- معالجة الأخطاء في حالة عدم الوجود

### 3. الصلاحيات
- التحقق من صلاحيات المستخدم للوصول للمكالمات
- استخدام guards مناسبة

## المعالجة والتحسينات

### 1. الفهرسة
- إنشاء فهارس على:
  - caller_number
  - recipient_number
  - call_status
  - created_at
  - employee_id

### 2. التحسينات
<!-- - استخدام eager loading للعلاقات المطلوبة -->
- تحسين استعلامات البحث والفلترة
<!-- - إضافة cache للبيانات المستخدمة بكثرة -->

### 3. معالجة الأخطاء
- رسائل خطأ واضحة ومفهومة
- معالجة حالات الخطأ المختلفة
<!-- - Logging مناسب للعمليات -->

## مثال على التدفق

### سيناريو 1: مكالمة من داعم
1. المستخدم يدخل caller_type = "supporter"
2. النظام يطلب caller_number (مطلوب)
3. النظام يتحقق من وجود الداعم
4. إنشاء المكالمة مع ربط الداعم

### سيناريو 2: مكالمة من شخص غير معروف
1. المستخدم يدخل caller_type = "other"
2. caller_number اختياري
3. إنشاء المكالمة بدون ربط محدد

### سيناريو 3: تعديل حالة مكالمة
1. المستخدم يختار المكالمة
2. تعديل call_status أو note
3. حفظ التغييرات

## ملاحظات مهمة

1. **عدم استخدام العائلات**: كما طلبت، لن يتم إضافة أي ربط مع جدول العائلات
2. **الحذف الفعلي**: الحذف سيكون hard delete وليس soft delete
3. **التحقق المشروط**: التحقق من caller_number يعتمد على caller_type
4. **الأمان**: جميع العمليات تحتاج صلاحيات مناسبة
5. **الأداء**: استخدام فهرسة مناسبة وتحسين الاستعلامات 
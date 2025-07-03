# Call Logs Module Implementation Tasks

**Assigned to:** Omar Bakkdash  
**Module:** Call Logs  
**Priority:** High  
**Estimated Time:** 3-5 days  

## Overview

The Call Logs module manages phone call records between employees and various entities (guardians, family members, supporters) in the Al Barakah Charity Association system. This module tracks call attempts, their outcomes, and maintains logs for follow-up purposes.

## Current Status

✅ **Completed:**
- Entity definition (`call-log.entity.ts`) - Contains employee relation and receiver information
- Enum definitions (`call-status.enum.ts`, `caller-type.enum.ts`)
- Basic folder structure

❌ **To Be Implemented:**
- DTOs with strong validation
- Service layer with business logic
- Controller with proper endpoints
- Module configuration

## Entity Structure Analysis

```
CallLog Entity Fields:
- id: Primary key
- callerNumber: Employee phone (optional, 10 digits)
- receiverNumber: Receiver phone (required, 10 digits)
- receiverType: GUARDIAN | FAMILY | FAMILY_MEMBER | SUPPORTER | OTHER
- receiverId: ID of receiver entity (optional)
- employeeId: ID of calling employee (optional)
- callStatus: Call outcome status
- notes: Call notes (optional, max 1000 chars)
- createdAt/updatedAt: Timestamps
- employee: Relation to Employee entity
```

## Implementation Tasks Overview

### 1. DTOs (Data Transfer Objects)

#### Request DTOs
- **CreateCallLogDto**: Full validation for new call logs
  - Phone number validation (exactly 10 digits)
  - Receiver type and ID consistency validation
  - Business logic validation (no self-calling)
  
- **UpdateCallLogDto**: Partial updates
  - Cannot change receiver info after creation
  - Only status and notes can be updated

#### Query DTOs
- **FilterCallLogDto**: Comprehensive filtering options (see detailed filters below)

#### Response DTOs
- **CallLogResponseDto**: Structured response with related data

### 2. Service Layer Features

#### Core CRUD Operations
- **create()**: With full validation and business rules
- **findAll()**: With advanced filtering and pagination
- **findOne()**: Single record retrieval
- **update()**: Partial updates with validation
- **remove()**: Soft delete implementation

#### Specialized Finder Methods
- **findByReceiver()**: Get calls by receiver type and ID
- **findByEmployee()**: Get calls by specific employee
- **getCallStatistics()**: Statistical data and reports

### 3. Controller Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/call-logs` | Create new call log |
| GET | `/call-logs` | List with filters and pagination |
| GET | `/call-logs/:id` | Get specific call log |
| PATCH | `/call-logs/:id` | Update call log |
| DELETE | `/call-logs/:id` | Soft delete call log |
| GET | `/call-logs/statistics` | Get call statistics |
| GET | `/call-logs/by-receiver/:type/:id` | Get by receiver |
| GET | `/call-logs/by-employee/:id` | Get by employee |

## FindAll Method - Detailed Filters

### Core Filters
- **employeeId**: Filter by specific employee who made the call
- **receiverType**: Filter by receiver type (GUARDIAN, FAMILY, FAMILY_MEMBER, SUPPORTER, OTHER)
- **receiverId**: Filter by specific receiver entity ID
- **callStatus**: Filter by call outcome (COMPLETED, NO_ANSWER, WRONG_NUMBER, etc.)

### Phone Number Filters
- **callerNumber**: Partial match on caller's phone number
- **receiverNumber**: Partial match on receiver's phone number

### Date Range Filters
- **callDateFrom**: Start date for call date range
- **callDateTo**: End date for call date range
- **Combined Date Filter**: Between two dates when both provided

### Text Filters
- **notes**: Partial text search in call notes

### Pagination
- **page**: Page number (default: 1)
- **limit**: Records per page (default: 10)

### Sorting
- **Default Order**: Most recent calls first (createdAt DESC)

## Validation Rules

### Phone Number Validation
- **Format**: Exactly 10 digits
- **Pattern**: Numbers only (0-9)
- **Required**: receiverNumber is mandatory, callerNumber is optional

### Business Logic Validation
- **Receiver Consistency**: If receiverType is not 'OTHER', receiverId must be provided
- **Entity Existence**: Referenced entities must exist in database
- **No Self-Calling**: Prevent calling same number
- **Employee Validation**: Ensure employee exists if provided

### Data Validation
- **Enum Values**: CallStatus and CallerType must be valid enum values
- **Text Length**: Notes maximum 1000 characters
- **Date Format**: Proper date format for filtering

## Integration Requirements

### Required Modules
- **EmployeesModule**: For employee validation and relations
- **GuardiansModule**: For guardian receiver validation
- **BeneficiaryFamiliesModule**: For family/family member validation
- **SupportersModule**: For supporter receiver validation
- **AuthModule**: Authentication
- **RolesModule**: Permission-based access control

### Required Permissions
- **CREATE_CALL_LOG**: Create new call logs
- **READ_CALL_LOG**: View call logs and statistics
- **UPDATE_CALL_LOG**: Modify existing call logs
- **DELETE_CALL_LOG**: Delete call logs

## Statistics Features

### Basic Statistics
- **Total Calls**: Count of all calls
- **Completed Calls**: Successfully completed calls
- **Failed Calls**: Unsuccessful calls
- **Success Rate**: Percentage of successful calls

### Detailed Breakdowns
- **Calls by Status**: Count per call status
- **Calls by Receiver Type**: Count per receiver type
- **Employee Performance**: Statistics per employee

### Filter Options
- **Employee-Specific**: Statistics for specific employee
- **Date Range**: Statistics within date range
- **Receiver Type**: Statistics by receiver type

## Error Handling

### Validation Errors
- **Phone Format**: Invalid phone number format
- **Missing Required**: Required fields not provided
- **Invalid References**: Referenced entities don't exist

### Business Logic Errors
- **Receiver Inconsistency**: Type/ID mismatch
- **Self-Calling**: Same caller and receiver number
- **Permission Denied**: Insufficient permissions

### System Errors
- **Not Found**: Call log doesn't exist
- **Database Errors**: Connection or constraint issues

## Multi-language Support (i18n)

### Error Messages
- Arabic and English error messages
- Parameterized messages with dynamic values
- Consistent error response format

### Response Labels
- Field labels in both languages
- Status descriptions
- User-friendly messages

## Performance Considerations

### Database Optimization
- **Indexes**: Proper indexing on frequently queried fields
- **Query Optimization**: Efficient query building
- **Pagination**: Limit large result sets

### Caching Strategy
- **Statistics Caching**: Cache frequently requested statistics
- **Employee Data**: Cache employee information
- **Lookup Data**: Cache enum values and dropdown data

## Security Measures

### Input Validation
- **Sanitization**: Clean and validate all inputs
- **SQL Injection Prevention**: Parameterized queries
- **XSS Prevention**: Escape output data

### Access Control
- **Authentication**: JWT-based authentication
- **Authorization**: Permission-based access control
- **Data Filtering**: Users see only authorized data

## Testing Strategy

### Unit Tests
- **Service Methods**: All CRUD operations
- **Validation Logic**: Business rules and constraints
- **Error Handling**: Exception scenarios

### Integration Tests
- **API Endpoints**: Full request/response cycle
- **Database Operations**: Entity relationships
- **Permission System**: Access control validation

### Target Coverage
- **Minimum**: 80% code coverage
- **Focus**: Business logic and validation

## Acceptance Criteria

- [ ] All DTOs with comprehensive validation
- [ ] Service layer with complete business logic
- [ ] Controller with all specified endpoints
- [ ] Advanced filtering system in findAll
- [ ] Statistical reporting functionality
- [ ] Permission-based security
- [ ] Multi-language error handling
- [ ] Unit and integration tests
- [ ] Performance optimization
- [ ] Swagger API documentation

---

**Contact:** For questions or clarifications, please reach out to the project lead.  
**Deadline:** To be determined based on sprint planning. 
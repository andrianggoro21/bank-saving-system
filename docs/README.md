# Bank Saving System - Complete Documentation

> **Full-Stack Engineering Test Documentation**
> Belimbing.ai - Bank Saving System with Deposito Interest Calculation

---

## 📋 Project Overview

**System:** Bank Saving System
**Core Feature:** Deposito management dengan automatic interest calculation
**Tech Stack:** Express.js + TypeScript + Prisma + PostgreSQL/MySQL
**Status:** ✅ Complete Documentation (Ready for Implementation)

---

## 🎯 System Requirements Summary

### Main Features:
1. ✅ Customer Management (CRUD)
2. ✅ Deposito Type Management (CRUD)
3. ✅ Account Management (CRUD)
4. ✅ Deposit Money with date tracking
5. ✅ Withdraw Money with automatic interest calculation
6. ✅ Transaction History

### Critical Business Logic:
**Interest Calculation Formula (Corrected):**
```
ending_balance = starting_balance × (1 + monthly_return × months)
monthly_return = yearly_return / 12 / 100
months = duration in months (decimal)
```

---

## 📚 Documentation Files

### 1. [Wireframe & User Flow](01-wireframe-user-flow.md)
**Purpose:** Visual blueprint untuk UI/UX

**Content:**
- 9 screens dengan wireframe ASCII
- 4 user journey flows
- Navigation structure
- UI/UX decisions with rationale

**Why First:**
- Foundation untuk semua deliverable lainnya
- Visualize requirements sebelum technical design
- Identify missing features early

---

### 2. [Database Schema](02-database-schema.md)
**Purpose:** Data structure & persistence layer

**Content:**
- 4 tables: customers, deposito_types, accounts, transactions
- ERD (Entity Relationship Diagram)
- SQL DDL statements
- Migration scripts
- Indexes strategy
- Query examples

**Key Decisions:**
- BIGINT for IDs (not UUID)
- DECIMAL(15,2) for money (prevent floating point errors)
- Separate transaction_date vs created_at
- ON DELETE RESTRICT for data integrity

---

### 3. [API Endpoints](03-api-endpoints.md)
**Purpose:** Backend API specification

**Content:**
- 19 RESTful endpoints
- Request/response examples
- Validation rules
- TypeScript implementation examples
- Calculation formula in code

**Tech Stack:**
- Express.js + TypeScript
- Prisma ORM
- Zod validation

---

### 4. [API-Screen Mapping](04-api-screen-mapping.md)
**Purpose:** Connect frontend screens to backend APIs

**Content:**
- Mapping 9 screens → 19 endpoints
- Loading states strategy
- Error handling patterns
- Optimization strategies (parallel calls, debouncing, caching)
- State management recommendations

**Critical Mapping:**
- Withdraw screen → 3 API calls (load → calculate → withdraw)
- Real-time calculation preview

---

### 5. [API Documentation (Swagger)](05-api-documentation-swagger.yaml)
**Purpose:** Interactive API documentation

**Content:**
- OpenAPI 3.0 specification
- Complete request/response schemas
- Error responses
- Example values
- Ready for Swagger UI

**Usage:**
- Import to https://editor.swagger.io/
- Auto-generate TypeScript client
- Import to Postman

**Also includes:** [Human-readable guide](05-api-documentation.md)

---

### 6. [Postman Collection](06-postman-collection.json)
**Purpose:** API testing & automation

**Content:**
- 19 endpoints dengan test scripts
- 2 environments (dev, production)
- Complete test flow automation (6 steps)
- Auto-save variables (customer_id, account_id, dll)

**Features:**
- Automated validation tests
- Collection Runner ready
- Newman CLI integration
- CI/CD ready

**Files:**
- `06-postman-collection.json` - Main collection
- `06-postman-environment.json` - Development env
- `06-postman-environment-production.json` - Production env
- `06-postman-guide.md` - Usage guide

---

### 7. [UML Class Diagram](07-uml-class-diagram.md)
**Purpose:** Object-oriented design structure

**Content:**
- 4 Entity classes (Customer, Account, DepositoType, Transaction)
- 5 Service classes (business logic layer)
- 4 Controller classes (HTTP handlers)
- DTOs & Value Objects
- Relationships & dependencies

**Formats:**
- PlantUML (render to PNG)
- Mermaid (markdown-friendly)
- ASCII diagram

**Implementation Mapping:**
- Entity → Prisma models
- Service → Business logic
- Controller → Express routes

---

### 8. [UML Use Case Diagram](08-uml-use-case-diagram.md)
**Purpose:** Functional requirements visualization

**Content:**
- 21 use cases total
- 2 actors (Admin/Bank Staff, System)
- Detailed specifications per use case
- Include relationships
- Priority matrix (P0-P3)

**Critical Use Cases:**
- UC16: Calculate Withdrawal Preview ⭐⭐
- UC17: Withdraw Money ⭐⭐
- UC19: Calculate Interest (system)

**Formats:**
- PlantUML
- Mermaid
- ASCII diagram

---

### 9. [Error Handling & Edge Cases](09-error-handling-edge-cases.md)
**Purpose:** Production-ready error handling

**Content:**
- Error handling strategy (5 layers)
- HTTP status codes mapping
- 30+ error codes with examples
- 32+ edge cases documented
- Custom error classes (TypeScript)
- Global error handler middleware
- Frontend error handling
- Test cases for errors

**Edge Cases Covered:**
- Delete customer with accounts
- Withdraw before deposit date
- Concurrent transactions (race conditions)
- Zero/negative amounts
- Future dates
- Very large numbers
- Fractional months
- Multiple deposits

---

## 🗂️ File Structure

```
belimbing-ai/
├── docs/
│   ├── README.md (this file)
│   ├── 01-wireframe-user-flow.md
│   ├── 02-database-schema.md
│   ├── 03-api-endpoints.md
│   ├── 04-api-screen-mapping.md
│   ├── 05-api-documentation-swagger.yaml
│   ├── 05-api-documentation.md
│   ├── 06-postman-collection.json
│   ├── 06-postman-environment.json
│   ├── 06-postman-environment-production.json
│   ├── 06-postman-guide.md
│   ├── 07-uml-class-diagram.md
│   ├── 08-uml-use-case-diagram.md
│   └── 09-error-handling-edge-cases.md
└── Full Stack Engineer Test - Belimbing.ai.pdf (requirement)
```

---

## 🚀 Quick Start Guide

### For Reviewers:

1. **Start Here:** [README.md](README.md) (this file)
2. **Understand Requirements:** Read PDF requirement
3. **Visual Overview:** [01-wireframe-user-flow.md](01-wireframe-user-flow.md)
4. **Technical Deep Dive:** [02-database-schema.md](02-database-schema.md) → [03-api-endpoints.md](03-api-endpoints.md)
5. **Test APIs:** Import [06-postman-collection.json](06-postman-collection.json) to Postman
6. **Review Architecture:** [07-uml-class-diagram.md](07-uml-class-diagram.md)

### For Developers (Implementation):

**Backend Developer:**
1. Database: [02-database-schema.md](02-database-schema.md) → Create Prisma schema
2. API: [03-api-endpoints.md](03-api-endpoints.md) → Implement endpoints
3. Business Logic: [07-uml-class-diagram.md](07-uml-class-diagram.md) → Create service classes
4. Error Handling: [09-error-handling-edge-cases.md](09-error-handling-edge-cases.md)
5. Test: [06-postman-collection.json](06-postman-collection.json) → Run tests

**Frontend Developer:**
1. Screens: [01-wireframe-user-flow.md](01-wireframe-user-flow.md) → Create components
2. API Integration: [04-api-screen-mapping.md](04-api-screen-mapping.md) → Connect to APIs
3. Types: [05-api-documentation-swagger.yaml](05-api-documentation-swagger.yaml) → Generate TypeScript types
4. Error Handling: [09-error-handling-edge-cases.md](09-error-handling-edge-cases.md) → Handle errors

---

## 📊 Documentation Statistics

| Metric | Count |
|--------|-------|
| **Total Documentation Files** | 13 files |
| **Total Pages (estimated)** | ~150 pages |
| **Screens Designed** | 9 screens |
| **Database Tables** | 4 tables |
| **API Endpoints** | 19 endpoints |
| **Use Cases** | 21 use cases |
| **Error Codes** | 30+ codes |
| **Edge Cases** | 32+ cases |
| **Postman Tests** | 60+ test scripts |

---

## 🎓 Key Technical Decisions

### 1. Why TypeScript?
- Type safety end-to-end
- Better IDE support
- Catch errors at compile time
- Self-documenting code

### 2. Why Prisma ORM?
- Auto-generated TypeScript types
- Type-safe database queries
- Migration management
- Great DX (developer experience)

### 3. Why BIGINT over UUID?
- Human-readable IDs
- Better performance (smaller indexes)
- Simpler for debugging
- Sequential ordering
- Authorization handles security

### 4. Why Separate transaction_date vs created_at?
- Support backdated transactions
- Audit trail (when recorded vs when happened)
- Business date vs system timestamp

### 5. Why Calculate Preview Before Withdrawal?
- **Explicit requirement:** "system must calculate and show to customer"
- Transparency for customer
- Prevent disputes
- User confirmation before execute

---

## 🔍 Important Notes

### Formula Correction:

**❌ Original Formula (from PDF - WRONG):**
```
ending_balance = starting_balance * #months * monthly_return
```

**✅ Corrected Formula (CORRECT):**
```
ending_balance = starting_balance × (1 + monthly_return × months)
```

**Why Wrong?**
- Original formula would result in balance SMALLER than starting balance
- Example: 50M × 10 × 0.005833 = 2.9M ❌ (loss!)
- Correct: 50M × (1 + 0.005833 × 10) = 52.9M ✅

### Critical Requirements:

1. ✅ **Input deposit date** - Requirement explicit
2. ✅ **Input withdrawal date** - Requirement explicit
3. ✅ **Show calculation to customer** - Requirement explicit
4. ✅ **Calculate ending balance** - Core business logic
5. ✅ **MVC pattern** - Both backend & frontend

---

## 🧪 Testing Strategy

### Unit Tests:
- Service layer business logic
- Calculation formulas
- Validation functions

### Integration Tests:
- API endpoints
- Database transactions
- Error handling

### E2E Tests:
- Complete user flows
- Postman Collection Runner
- Frontend → Backend → Database

---

## 📦 Deliverables Checklist

### Phase 1: Planning & Design
- ✅ Wireframe/User Flow
- ✅ Database Schema
- ✅ API Specification
- ✅ UML Diagrams

### Phase 2: Documentation
- ✅ API Documentation (Swagger)
- ✅ Postman Collection
- ✅ Error Handling Guide
- ✅ Edge Cases

### Phase 3: Implementation (Next)
- ⏳ Backend (Express + TypeScript + Prisma)
- ⏳ Frontend (React/Next.js)
- ⏳ Testing
- ⏳ Deployment

---

## 🌟 Highlights

### What Makes This Documentation Complete?

1. **Visual First** - Wireframes before technical specs
2. **Type Safety** - TypeScript everywhere
3. **Error Handling** - 32+ edge cases documented
4. **Testing Ready** - Postman collection with automated tests
5. **Production Ready** - Error handling, validation, security
6. **Well Structured** - Clear separation of concerns
7. **Comprehensive** - Nothing left ambiguous

### Bonus Points Considerations:

**From Requirement:**
> "bonus: use react native, flutter, Xamarin, android(java), ios(swift)"

**Decision:** Focus on Web first (React/Next.js)
- Complete web implementation first
- Mobile app can use same backend APIs
- React Native possible as next phase

---

## 📞 Next Steps

### For Implementation:

1. **Setup Backend:**
   ```bash
   npm init -y
   npm install express prisma typescript ts-node @types/node @types/express
   npx prisma init
   # Create schema from 02-database-schema.md
   npx prisma migrate dev
   ```

2. **Setup Frontend:**
   ```bash
   npx create-next-app@latest bank-saving-frontend
   # Generate API client from Swagger
   # Implement screens from wireframes
   ```

3. **Import Postman Collection:**
   - Test each endpoint as implemented
   - Use Collection Runner for E2E tests

4. **Deploy:**
   - Backend: Railway, Render, or Vercel
   - Database: Supabase, PlanetScale, or Neon
   - Frontend: Vercel, Netlify
   - Domain: Get free domain from Hostinger.co.id

---

## 🏆 Success Criteria

### Documentation Phase (✅ COMPLETE):
- ✅ All wireframes created
- ✅ Database schema designed
- ✅ API endpoints specified
- ✅ API documentation (Swagger)
- ✅ Postman collection ready
- ✅ UML diagrams complete
- ✅ Error handling documented

### Implementation Phase (Next):
- ⏳ Backend APIs working
- ⏳ Frontend screens implemented
- ⏳ Tests passing (Postman)
- ⏳ Calculation formula correct
- ⏳ Error handling working
- ⏳ Deployed to hosting
- ⏳ Free domain configured

---

## 📝 Document Version

**Version:** 1.0
**Last Updated:** 2025-11-22
**Status:** ✅ Complete Documentation
**Ready For:** Implementation Phase

---

## 🙏 Acknowledgments

**Test Provider:** Belimbing.ai
**Documentation Created By:** AI-Assisted Documentation System
**Tech Stack:** Express.js + TypeScript + Prisma + PostgreSQL
**Documentation Tools:** Markdown, PlantUML, Mermaid, OpenAPI, Postman

---

**For Questions or Clarifications:**
Refer to specific documentation files for detailed information.
All edge cases and error scenarios are covered in [09-error-handling-edge-cases.md](09-error-handling-edge-cases.md).

---

**End of Documentation Summary**
**Ready to Code! 🚀**

# Code Generation Copilot

A full-stack web application that generates code from natural language prompts using AI. Users can enter prompts, select programming languages, generate code using Google Gemini API, and view their generation history with pagination.

## 🚀 Features

- **Natural Language Code Generation**: Enter prompts in plain English to generate code
- **Multi-Language Support**: Support for 10+ programming languages (JavaScript, Python, Java, TypeScript, C++, C#, C, Go, Rust, R)
- **Syntax Highlighting**: Beautiful code display with syntax highlighting
- **Copy to Clipboard**: One-click code copying functionality
- **Generation History**: View all previous generations with paginated navigation
- **Responsive Design**: Clean, modern UI that works on all devices
- **Dark/Light Theme**: Toggle between dark and light modes
- **Real-time AI Integration**: Powered by Google Gemini API

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Component library
- **React Syntax Highlighter** - Code syntax highlighting
- **Prism.js** - Syntax highlighting engine

### Backend
- **Node.js** - Runtime environment
- **Express 5** - Web framework
- **TypeScript** - Type safety
- **Prisma** - ORM for database management
- **PostgreSQL** - Relational database
- **Google Gemini API** - AI code generation

### Development Tools
- **Nodemon** - Auto-reload for development
- **ESLint** - Code linting
- **Prisma Migrate** - Database migrations

## 📋 Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn
- Google Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))

## 🔧 Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd AutomationEdge
```

### 2. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file in the `server` directory:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/code_copilot?schema=public"
GEMINI_API_KEY="your-gemini-api-key-here"
PORT=3000
```

Generate Prisma Client:

```bash
npm run prisma:generate
```

Run database migrations:

```bash
npm run prisma:migrate
```

Start the development server:

```bash
npm run dev
```

The backend will run on `http://localhost:3000`

### 3. Frontend Setup

```bash
cd client
npm install
```

Create a `.env` file in the `client` directory:

```env
VITE_API_BASE_URL=http://localhost:3000
```

Start the development server:

```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

### 4. Production Build

**Backend:**
```bash
cd server
npm run build
npm start
```

**Frontend:**
```bash
cd client
npm run build
```

The built files will be in `client/dist/`

## 📊 Database Schema

### ER Diagram

```mermaid
erDiagram
    Language ||--o{ Generation : "has many"
    
    Language {
        string id PK
        string name UK "unique"
        string displayName
        string version
        datetime createdAt
        datetime updatedAt
    }
    
    Generation {
        string id PK
        string prompt
        string code
        string language "denormalized"
        string languageId FK
        datetime timestamp
    }
```

### Schema Explanation

#### Normalization

The schema uses **3NF (Third Normal Form)** normalization:

1. **Language Table**: Stores unique language information to prevent duplication
   - Each language is stored once with metadata (displayName, version)
   - Prevents data redundancy when multiple generations use the same language

2. **Generation Table**: Stores individual code generation records
   - Contains denormalized `language` field for quick access without joins
   - Maintains referential integrity through `languageId` foreign key

#### Foreign Keys and Constraints

- **Primary Keys**: 
  - `Language.id` (UUID)
  - `Generation.id` (UUID)

- **Foreign Key**: 
  - `Generation.languageId` → `Language.id`
  - **CASCADE DELETE**: When a language is deleted, all associated generations are deleted

- **Unique Constraints**:
  - `Language.name` - Ensures no duplicate language names

- **Indexes**:
  - `generations_languageId_idx` - Index on `languageId` for faster JOINs and filtering
  - `generations_timestamp_idx` - Index on `timestamp` for efficient sorting by date

#### Design Decisions

1. **Denormalization Strategy**: The `Generation.language` field is denormalized to allow quick access to language names without requiring a JOIN. This improves read performance for common queries.

2. **CASCADE Delete**: When a language is deleted, all associated generations are automatically deleted to maintain referential integrity.

3. **UUID Primary Keys**: Using UUIDs instead of auto-incrementing integers provides:
   - Better security (non-sequential IDs)
   - Distributed system compatibility
   - No collision risk across databases

4. **Timestamp Indexing**: The `timestamp` field is indexed to optimize queries that sort or filter by date (e.g., "show recent generations").

## 🔌 API Documentation

### Base URL
```
http://localhost:3000
```

### Endpoints

#### 1. Health Check
```http
GET /health
```

**Response:**
```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

#### 2. Generate Code
```http
POST /generate
Content-Type: application/json
```

**Request Body:**
```json
{
  "prompt": "Write a Python function to reverse a string",
  "language": "Python"
}
```

**Response:**
```json
{
  "success": true,
  "code": "def reverse_string(s):\n    return s[::-1]",
  "language": "Python",
  "prompt": "Write a Python function to reverse a string",
  "generationId": "uuid-here",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Error message here"
}
```

#### 3. Get History
```http
GET /api/history?page=1&limit=10&language=Python
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)
- `language` (optional): Filter by language name

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-here",
      "prompt": "Write a Python function to reverse a string",
      "code": "def reverse_string(s):\n    return s[::-1]",
      "language": "Python",
      "timestamp": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "totalCount": 50,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

## ⚡ Complexity Analysis

### Time Complexity

#### Paginated Retrieval (`GET /api/history`)

**Time Complexity: O(n + m)**
- `n` = page size (typically 10)
- `m` = number of records to skip (for offset-based pagination)

**Breakdown:**
1. **Count Query**: `O(N)` where N = total records in database
   - Scans all matching records to get total count
   - Can be optimized with approximate counts for large datasets

2. **Data Query**: `O(n + m)`
   - `O(m)`: Skip operation (offset)
   - `O(n)`: Fetch n records
   - With indexes: `O(log N + n)` for sorted queries

**Optimization Notes:**
- Using `timestamp` index: Sorting is `O(n log n)` but with index it's `O(n)`
- Offset-based pagination becomes slower as `m` increases
- For better performance with large datasets, consider cursor-based pagination

#### Code Generation (`POST /generate`)

**Time Complexity: O(1) + AI API call**
- Database operations: `O(1)` (indexed lookups)
- AI API call: External dependency (typically 1-5 seconds)

### Query Performance

#### Schema Impact on Performance

1. **Indexes Improve Query Speed:**
   - `generations_languageId_idx`: Reduces JOIN time from O(N) to O(log N)
   - `generations_timestamp_idx`: Enables efficient sorting without full table scan

2. **Denormalization Trade-off:**
   - **Benefit**: Faster reads (no JOIN needed for language name)
   - **Cost**: Slight storage overhead and potential inconsistency risk
   - **Mitigation**: Language name is updated via application logic

3. **Foreign Key Index:**
   - Automatically indexed by PostgreSQL
   - Speeds up JOINs and referential integrity checks

### When Are Indexes Useful?

Indexes are beneficial when:

1. **Frequent Filtering**: Queries that filter by `languageId` or `timestamp`
2. **Sorting Operations**: ORDER BY `timestamp` queries
3. **JOIN Operations**: Foreign key lookups between tables
4. **Range Queries**: Date range filtering on `timestamp`

**Indexes Created:**
- ✅ `generations_languageId_idx` - For filtering and JOINs
- ✅ `generations_timestamp_idx` - For sorting and date range queries
- ✅ `languages_name_key` (unique index) - For language lookups

**When NOT to Index:**
- Low-cardinality columns (few unique values)
- Columns rarely used in WHERE clauses
- Write-heavy tables (indexes slow down INSERT/UPDATE)

### Scalability Considerations

1. **Current Design**: Optimized for read-heavy workloads
2. **Future Optimizations**:
   - Cursor-based pagination for large datasets
   - Caching frequently accessed languages
   - Database connection pooling
   - Read replicas for history queries

## 📁 Project Structure

```
AutomationEdge/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── api.clients.ts # API client functions
│   │   └── ...
│   ├── package.json
│   └── vite.config.ts
│
├── server/                 # Backend Express application
│   ├── routes/            # API route handlers
│   │   ├── generate.ts    # Code generation endpoint
│   │   └── history.ts     # History endpoint
│   ├── services/          # Business logic
│   │   └── genai.ts       # AI service integration
│   ├── prisma/            # Database schema and migrations
│   │   ├── schema.prisma  # Prisma schema
│   │   └── migrations/    # Database migration files
│   ├── index.ts           # Express server entry point
│   └── package.json
│
└── README.md              # This file
```

## 📄 Additional Notes

- The application uses Google Gemini API for code generation
- Database migrations are managed through Prisma
- The frontend uses Vite for fast development and optimized builds
- All API endpoints include proper error handling and validation

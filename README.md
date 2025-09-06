Abbey Fullstack Task - Backend

A Node.js/Express backend API implementing authentication, user accounts, and social relationships 

Authentication: JWT-based login/logout with session handling
Accounts: User profiles with personal information storage
Relationships: Follow/unfollow system between users
Posts: User content creation and retrieval

Quick Start 

1. Clone & Install
git clone https://github.com/UgwuObed/abbey-backend
cd abbey-backend

npm install

2. Environment Setup

Create .env file:

PORT=3001
NODE_ENV=development
DATABASE_URL="postgresql://neondb_owner:npg_kpx6qFPu9yAC@ep-flat-voice-a8cevilg-pooler.eastus2.azure.neon.tech/neondb?sslmode=require&channel_binding=require"
JWT_SECRET="3b984d90c1307d42eb0bc7c1e01b636c71d5c4d3945cfb825a17584b018d9e9f456d6a7c69d49234e9f7fe0f08342d1676e167592c6a21fc26f83f2648fa1181"
JWT_EXPIRES_IN="7d"
ALLOWED_ORIGINS="http://localhost:3000,http://localhost:5173"


3. Database Setup

npx prisma generate
npx prisma migrate dev


4. Start Server
npm run dev
Verify it's working:

API Health: http://localhost:3001/health
Database: http://localhost:3001/health/db

Tech Stack

Node.js + Express - RESTful API
PostgreSQL + Prisma - Database with type-safe ORM
JWT - Authentication with refresh tokens
TypeScript - Type safety
Helmet + CORS - Security

Postman Testing 
Ready-to-use Postman Collection:
Import Collection: https://www.postman.com/obedown/abbey-api/collection/6k7c6gw/api?action=share&source=copy-link&creator=17157575
Setup Instructions:

Import the collection using the link above
Set collection variable baseUrl to: http://localhost:3001
All endpoints are ready to test!

Available Endpoints:

Authentication (register, login, profile)
User management
Follow/unfollow functionality
Posts CRUD operations
Health checks


Development Commands
npm run dev     # Start with hot reload
npm run build   # Build for production  
npm start       # Start production server

# Database
npx prisma studio    # Database GUI
npx prisma generate  # Regenerate client

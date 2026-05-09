# AI Digital Twin Creator

AI-powered digital twin creation platform for small business owners.

## Overview

The AI Digital Twin Creator enables small business owners to create AI replicas of themselves that can handle customer inquiries via WhatsApp, phone calls, and other channels. This MVP (Minimum Viable Product) focuses on core functionality:

1. **User Authentication**: Secure registration and login with JWT tokens
2. **Business Management**: Add and manage business profiles
3. **Digital Twin Creation**: Upload voice samples and business information
4. **AI Training**: Modal.com-powered training pipeline for personality cloning
5. **Dashboard**: View digital twin performance and analytics
6. **Basic Analytics**: Track conversation metrics and customer satisfaction

## Tech Stack

### Backend
- **Framework**: FastAPI (Python 3.11+)
- **Database**: PostgreSQL 15+
- **Cache**: Redis 7+
- **AI Platform**: Modal.com (for training and inference)
- **Authentication**: JWT tokens with bcrypt password hashing
- **API Documentation**: Auto-generated OpenAPI/Swagger docs

### Frontend
- **Framework**: React.js 18+
- **UI Library**: Material-UI (MUI) v5
- **State Management**: React Query + Context API
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Charts**: Recharts

### Infrastructure
- **Containerization**: Docker & Docker Compose
- **Reverse Proxy**: Nginx
- **SSL**: Let's Encrypt (production)
- **Deployment**: Modal.com for AI functions, Docker for application

## Project Structure

```
ai-digital-twin-creator/
├── README.md
├── docker-compose.yml
├── .gitignore
│
├── backend/
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── modal_app.py
│   ├── .env.example
│   └── app/
│       ├── __init__.py
│       ├── main.py
│       ├── models.py
│       ├── schemas.py
│       ├── database.py
│       ├── api/
│       │   ├── auth.py
│       │   ├── businesses.py
│       │   ├── digital_twins.py
│       │   ├── analytics.py
│       │   └── dashboard.py
│       ├── services/
│       │   ├── auth_service.py
│       │   ├── digital_twin_service.py
│       │   └── voice_analysis_service.py
│       └── ai/
│           ├── conversation_service.py
│           └── training_service.py
│
├── frontend/
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   ├── .env.example
│   ├── .gitignore
│   ├── public/
│   │   ├── index.html
│   │   ├── manifest.json
│   │   └── robots.txt
│   └── src/
│       ├── index.js
│       ├── App.js
│       ├── contexts/
│       │   └── AuthContext.js
│       ├── services/
│       │   └── api.js
│       ├── components/
│       │   ├── Navbar.js
│       │   ├── StatCard.js
│       │   ├── ConversationChart.js
│       │   ├── RecentActivity.js
│       │   └── ProtectedRoute.js
│       └── pages/
│           ├── Login.js
│           ├── Register.js
│           ├── Dashboard.js
│           ├── Businesses.js
│           ├── CreateTwin.js
│           ├── DigitalTwinDetail.js
│           ├── Analytics.js
│           └── Settings.js
│
├── nginx/
│   └── nginx.conf
│
└── scripts/
    ├── init-db.sql
    └── deploy.sh
```

## Getting Started

### Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local frontend development)
- Python 3.11+ (for local backend development)
- Modal.com account and CLI
- OpenAI API key

### Quick Start with Docker

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-digital-twin-creator
   ```

2. **Set up environment variables**
   ```bash
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   # Edit both .env files with your configuration
   ```

3. **Start the application**
   ```bash
   docker-compose up -d
   ```

4. **Initialize the database**
   ```bash
   docker-compose exec postgres psql -U user -d digital_twin_db -f /scripts/init-db.sql
   ```

5. **Access the application**
   - Frontend: http://localhost
   - Backend API: http://localhost/api/v1
   - API Docs: http://localhost/api/v1/docs

### Local Development

**Backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

**Frontend:**
```bash
cd frontend
npm install
npm start  # Runs on http://localhost:3000
```

## Deployment

### Modal.com AI Functions

Deploy AI training and inference functions:

```bash
cd backend
modal deploy modal_app.py
```

### Production Deployment

Use the deployment script:

```bash
./scripts/deploy.sh production
```

Or manually with Docker Compose:

```bash
docker-compose -f docker-compose.yml up -d
```

## API Documentation

Once the backend is running, access the interactive API documentation:

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Development Roadmap

### Phase 1: MVP (Current)
- ✅ User authentication (JWT)
- ✅ Business management
- ✅ Digital twin creation
- ✅ Voice sample upload
- ✅ AI training pipeline (Modal.com)
- ✅ Dashboard with analytics
- ✅ Basic conversation handling

### Phase 2: Enhanced Features
- 🔄 Advanced voice cloning
- 🔄 Multi-language support
- 🔄 WhatsApp integration
- 🔄 Phone call integration (Twilio)
- 🔄 Email response handling
- 🔄 Advanced analytics
- 🔄 Payment integration (Stripe)

### Phase 3: Enterprise
- 📋 Team management
- 📋 Role-based access control
- 📋 Custom integrations API
- 📋 White-label options
- 📋 Advanced security features

## Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql://user:password@postgres:5432/digital_twin_db
REDIS_URL=redis://redis:6379/0
SECRET_KEY=your-secret-key-here
OPENAI_API_KEY=your-openai-api-key
MODAL_TOKEN_ID=your-modal-token-id
MODAL_TOKEN_SECRET=your-modal-token-secret
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:8000/api/v1
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support, email support@digitaltwin.app or join our Discord community.

## Acknowledgments

- OpenAI for GPT-4 API
- Modal.com for serverless GPU infrastructure
- FastAPI team for the excellent framework
- Material-UI for the component library

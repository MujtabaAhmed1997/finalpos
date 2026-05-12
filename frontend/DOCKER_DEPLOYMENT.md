# Pak Brotherz POS - Docker Deployment

## Build & Run

### Local Build
```bash
docker build -t pakbrotherz-pos .
docker run -p 3001:3001 --env-file .env pakbrotherz-pos
```

### Environment Variables Required
```
Port=3001
databasename=your_db_name
user=your_db_user
password=your_db_password
JWT_SECRET=your_jwt_secret
```

## Deployment

This Dockerfile:
1. **Frontend Build**: Compiles React app to static files in `/frontend/build`
2. **Backend Build**: Installs Node dependencies and copies backend code
3. **Static Serving**: Copies built frontend to `/app/public` so backend serves it
4. **Health Check**: Includes HTTP health check on port 3001

## What Gets Deployed

- **Port 3001**: Node.js backend + static frontend files
- Backend API at `/api/*`
- Frontend at `/` (served as static files)

## Testing

Once running, visit:
- `http://localhost:3001/` - Frontend UI
- `http://localhost:3001/status` - Backend status check
- `http://localhost:3001/api/users/login` - API endpoint

## Notes

- Build context is the project root
- Frontend must be built first (multi-stage build)
- Both frontend and backend run on the same port (3001)
- Backend serves static frontend files; API requests go to `/api/*`

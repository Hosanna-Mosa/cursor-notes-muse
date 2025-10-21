# MERN Notes App Setup Guide

## Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp env.example .env
   ```
   Edit `.env` with your MongoDB URI and other settings.

4. **Start MongoDB:**
   - **Local MongoDB:** Make sure MongoDB is running on your system
   - **MongoDB Atlas:** Use your Atlas connection string in `.env`

5. **Run the backend:**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp env.example .env
   ```
   Edit `.env` with your API URL (default: `http://localhost:5000/api`)

4. **Run the frontend:**
   ```bash
   npm run dev
   ```

## Full Stack Setup

1. **Start both servers:**
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev
   
   # Terminal 2 - Frontend  
   cd frontend
   npm run dev
   ```

2. **Access the application:**
   - Frontend: http://localhost:8080
   - Backend API: http://localhost:5000/api
   - Health Check: http://localhost:5000/api/health

## Environment Variables

### Backend (.env)
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/notes-app
FRONTEND_URL=http://localhost:8080
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_TITLE=Notes App
VITE_APP_DESCRIPTION=Create and manage your markdown notes
```

## API Endpoints

- `GET /api/notes` - Get all notes (with search & pagination)
- `GET /api/notes/:id` - Get single note
- `POST /api/notes` - Create new note
- `PUT /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete note
- `GET /api/health` - Health check

## Features

✅ **Full CRUD Operations** for notes
✅ **Real-time Search** with debouncing
✅ **Markdown Support** with live preview
✅ **Loading States** and error handling
✅ **Responsive Design** for all devices
✅ **API Integration** with centralized service
✅ **Type Safety** with TypeScript
✅ **Modern UI** with shadcn/ui components

## Troubleshooting

### Backend Issues
- Ensure MongoDB is running
- Check environment variables
- Verify CORS settings
- Check console for errors

### Frontend Issues
- Ensure backend is running
- Check API URL in environment
- Verify network connectivity
- Check browser console for errors

### Common Issues
1. **CORS errors:** Make sure `FRONTEND_URL` in backend `.env` matches your frontend URL
2. **Connection refused:** Ensure backend is running on the correct port
3. **MongoDB connection:** Verify your MongoDB URI is correct
4. **Environment variables:** Make sure all required variables are set

## Development Tips

- Use browser dev tools to monitor API calls
- Check backend logs for server-side errors
- Use the health check endpoint to verify API status
- Test API endpoints with tools like Postman or curl

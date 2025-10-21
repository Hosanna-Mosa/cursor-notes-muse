# Notes Backend API

A RESTful API for the Notes application built with Node.js, Express.js, and MongoDB.

## Features

- **CRUD Operations**: Create, read, update, and delete notes
- **Search Functionality**: Full-text search across note titles and content
- **Pagination**: Efficient data pagination for large datasets
- **Validation**: Input validation and sanitization
- **Error Handling**: Comprehensive error handling with meaningful messages
- **Security**: Rate limiting, CORS, and security headers
- **Performance**: Compression and optimized database queries

## Tech Stack

- **Node.js**: JavaScript runtime
- **Express.js**: Web framework
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling
- **Express Validator**: Input validation
- **Helmet**: Security middleware
- **CORS**: Cross-origin resource sharing
- **Morgan**: HTTP request logger

## API Endpoints

### Notes
- `GET /api/notes` - Get all notes (with search and pagination)
- `GET /api/notes/:id` - Get single note by ID
- `POST /api/notes` - Create new note
- `PUT /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete note
- `DELETE /api/notes` - Delete all notes
- `GET /api/notes/stats` - Get notes statistics

### Health Check
- `GET /api/health` - API health status

## Installation

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp env.example .env
   ```
   Edit `.env` with your configuration.

3. **Start MongoDB:**
   - Local: Make sure MongoDB is running on your system
   - Atlas: Use MongoDB Atlas connection string

4. **Run the server:**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## Environment Variables

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/notes-app

# CORS Configuration
FRONTEND_URL=http://localhost:8080

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## API Usage Examples

### Create a Note
```bash
curl -X POST http://localhost:5000/api/notes \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My First Note",
    "content": "This is the content of my note."
  }'
```

### Get All Notes
```bash
curl http://localhost:5000/api/notes
```

### Search Notes
```bash
curl "http://localhost:5000/api/notes?q=search%20term&page=1&limit=10"
```

### Update a Note
```bash
curl -X PUT http://localhost:5000/api/notes/64a1b2c3d4e5f6789abcdef0 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Title",
    "content": "Updated content."
  }'
```

### Delete a Note
```bash
curl -X DELETE http://localhost:5000/api/notes/64a1b2c3d4e5f6789abcdef0
```

## Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "count": 10,
  "total": 100,
  "page": 1,
  "pages": 10
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "details": [ ... ]
}
```

## Database Schema

### Note Model
```javascript
{
  _id: ObjectId,
  title: String (required, max 200 chars),
  content: String (required, max 50,000 chars),
  createdAt: Date,
  updatedAt: Date
}
```

## Security Features

- **Rate Limiting**: Prevents API abuse
- **CORS**: Configurable cross-origin requests
- **Helmet**: Security headers
- **Input Validation**: Prevents malicious input
- **Error Handling**: No sensitive information leakage

## Development

### Project Structure
```
backend/
├── controllers/     # Route controllers
├── middleware/      # Custom middleware
├── models/          # Database models
├── routes/          # API routes
├── server.js        # Main server file
├── package.json     # Dependencies
└── README.md        # Documentation
```

### Adding New Features

1. Create model in `models/`
2. Add controller in `controllers/`
3. Define routes in `routes/`
4. Add validation in `middleware/validation.js`
5. Update this README

## Testing

```bash
npm test
```

## Deployment

1. Set production environment variables
2. Ensure MongoDB is accessible
3. Run `npm start`
4. Configure reverse proxy (nginx) if needed

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

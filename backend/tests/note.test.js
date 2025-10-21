import request from 'supertest';
import app from '../server.js';

describe('Notes API', () => {
  let testNoteId;

  describe('POST /api/notes', () => {
    it('should create a new note', async () => {
      const noteData = {
        title: 'Test Note',
        content: 'This is a test note content.'
      };

      const response = await request(app)
        .post('/api/notes')
        .send(noteData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe(noteData.title);
      expect(response.body.data.content).toBe(noteData.content);
      
      testNoteId = response.body.data._id;
    });

    it('should return validation error for missing title', async () => {
      const response = await request(app)
        .post('/api/notes')
        .send({ content: 'Content without title' })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Validation failed');
    });

    it('should return validation error for missing content', async () => {
      const response = await request(app)
        .post('/api/notes')
        .send({ title: 'Title without content' })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Validation failed');
    });
  });

  describe('GET /api/notes', () => {
    it('should get all notes', async () => {
      const response = await request(app)
        .get('/api/notes')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should search notes by query', async () => {
      const response = await request(app)
        .get('/api/notes?q=test')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('GET /api/notes/:id', () => {
    it('should get a single note', async () => {
      const response = await request(app)
        .get(`/api/notes/${testNoteId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data._id).toBe(testNoteId);
    });

    it('should return 404 for non-existent note', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const response = await request(app)
        .get(`/api/notes/${fakeId}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Note not found');
    });
  });

  describe('PUT /api/notes/:id', () => {
    it('should update a note', async () => {
      const updateData = {
        title: 'Updated Test Note',
        content: 'This is updated content.'
      };

      const response = await request(app)
        .put(`/api/notes/${testNoteId}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe(updateData.title);
      expect(response.body.data.content).toBe(updateData.content);
    });
  });

  describe('DELETE /api/notes/:id', () => {
    it('should delete a note', async () => {
      const response = await request(app)
        .delete(`/api/notes/${testNoteId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Note deleted successfully');
    });

    it('should return 404 for non-existent note', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const response = await request(app)
        .delete(`/api/notes/${fakeId}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Note not found');
    });
  });

  describe('GET /api/health', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);

      expect(response.body.status).toBe('OK');
      expect(response.body.message).toBe('Notes API is running');
    });
  });
});

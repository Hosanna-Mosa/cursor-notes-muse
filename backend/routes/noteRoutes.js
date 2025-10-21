import express from 'express';
import {
  getNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote,
  deleteAllNotes,
  getNoteStats
} from '../controllers/noteController.js';
import {
  validateNote,
  validateNoteCreate,
  validateNoteUpdate,
  validateObjectId,
  validateSearchQuery
} from '../middleware/validation.js';

const router = express.Router();

// @route   GET /api/notes/stats
// @desc    Get notes statistics
router.get('/stats', getNoteStats);

// @route   GET /api/notes
// @desc    Get all notes with optional search and pagination
router.get('/', validateSearchQuery, getNotes);

// @route   GET /api/notes/:id
// @desc    Get single note by ID
router.get('/:id', validateObjectId, getNote);

// @route   POST /api/notes
// @desc    Create a new note
router.post('/', validateNoteCreate, createNote);

// @route   PUT /api/notes/:id
// @desc    Update a note
router.put('/:id', validateObjectId, validateNoteUpdate, updateNote);

// @route   DELETE /api/notes/:id
// @desc    Delete a single note
router.delete('/:id', validateObjectId, deleteNote);

// @route   DELETE /api/notes
// @desc    Delete all notes
router.delete('/', deleteAllNotes);

export default router;

import Note from '../models/Note.js';

// @desc    Get all notes
// @route   GET /api/notes
// @access  Public
export const getNotes = async (req, res, next) => {
  try {
    const { q, page = 1, limit = 10, sort = 'updatedAt' } = req.query;
    
    // Build search query
    let searchQuery = {};
    if (q) {
      searchQuery = {
        $or: [
          { title: { $regex: q, $options: 'i' } },
          { content: { $regex: q, $options: 'i' } }
        ]
      };
    }

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Sort options
    const sortOptions = {};
    if (sort === 'title') sortOptions.title = 1;
    else if (sort === 'createdAt') sortOptions.createdAt = -1;
    else sortOptions.updatedAt = -1; // default

    const notes = await Note.find(searchQuery)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum)
      .lean();

    const total = await Note.countDocuments(searchQuery);

    res.status(200).json({
      success: true,
      count: notes.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      data: notes
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single note
// @route   GET /api/notes/:id
// @access  Public
export const getNote = async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        success: false,
        error: 'Note not found'
      });
    }

    res.status(200).json({
      success: true,
      data: note
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new note
// @route   POST /api/notes
// @access  Public
export const createNote = async (req, res, next) => {
  try {
    const note = await Note.create(req.body);

    res.status(201).json({
      success: true,
      data: note
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update note
// @route   PUT /api/notes/:id
// @access  Public
export const updateNote = async (req, res, next) => {
  try {
    const note = await Note.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!note) {
      return res.status(404).json({
        success: false,
        error: 'Note not found'
      });
    }

    res.status(200).json({
      success: true,
      data: note
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete note
// @route   DELETE /api/notes/:id
// @access  Public
export const deleteNote = async (req, res, next) => {
  try {
    const note = await Note.findByIdAndDelete(req.params.id);

    if (!note) {
      return res.status(404).json({
        success: false,
        error: 'Note not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Note deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete all notes
// @route   DELETE /api/notes
// @access  Public
export const deleteAllNotes = async (req, res, next) => {
  try {
    const result = await Note.deleteMany({});
    
    res.status(200).json({
      success: true,
      message: `${result.deletedCount} notes deleted successfully`
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get notes statistics
// @route   GET /api/notes/stats
// @access  Public
export const getNoteStats = async (req, res, next) => {
  try {
    const totalNotes = await Note.countDocuments();
    const recentNotes = await Note.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    });

    res.status(200).json({
      success: true,
      data: {
        totalNotes,
        recentNotes,
        lastUpdated: new Date().toISOString()
      }
    });
  } catch (error) {
    next(error);
  }
};

import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Note title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  content: {
    type: String,
    required: [true, 'Note content is required'],
    maxlength: [50000, 'Content cannot exceed 50,000 characters']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Update the updatedAt field before saving
noteSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Update the updatedAt field before updating
noteSchema.pre(['updateOne', 'findOneAndUpdate'], function(next) {
  this.set({ updatedAt: new Date() });
  next();
});

// Index for better search performance
noteSchema.index({ title: 'text', content: 'text' });
noteSchema.index({ createdAt: -1 });
noteSchema.index({ updatedAt: -1 });

// Virtual for formatted dates
noteSchema.virtual('formattedCreatedAt').get(function() {
  return this.createdAt.toISOString();
});

noteSchema.virtual('formattedUpdatedAt').get(function() {
  return this.updatedAt.toISOString();
});

const Note = mongoose.model('Note', noteSchema);

export default Note;

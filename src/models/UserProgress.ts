import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IUserProgress extends Document {
  user_id: string;
  word_id: Types.ObjectId;
  stage: number;
  next_review_time: Date;
  status: 'learning' | 'mastered';
  wrong_count: number;
  last_reviewed_at?: Date;
}

const UserProgressSchema = new Schema<IUserProgress>({
  user_id: {
    type: String,
    required: true,
    default: 'default_user'
  },
  word_id: {
    type: Schema.Types.ObjectId,
    ref: 'Word',
    required: true
  },
  stage: {
    type: Number,
    default: 0,
    min: 0,
    max: 8
  },
  next_review_time: {
    type: Date,
    default: Date.now,
    index: true
  },
  status: {
    type: String,
    enum: ['learning', 'mastered'],
    default: 'learning'
  },
  wrong_count: {
    type: Number,
    default: 0
  },
  last_reviewed_at: {
    type: Date
  }
});

UserProgressSchema.index({ user_id: 1, word_id: 1 }, { unique: true });

export const UserProgress = mongoose.models.UserProgress ||
  mongoose.model<IUserProgress>('UserProgress', UserProgressSchema);

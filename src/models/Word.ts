import mongoose, { Schema, Document } from 'mongoose';

export interface ISentence {
  en: string;
  cn: string;
}

export interface IWord extends Document {
  word: string;
  phonetic: string;
  meanings: string[];
  collocations: string[];
  sentences: ISentence[];
  is_custom: boolean;
  audio_url?: string;
  created_at: Date;
}

const WordSchema = new Schema<IWord>({
  word: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  phonetic: { type: String, default: '' },
  meanings: [{ type: String }],
  collocations: [{ type: String }],
  sentences: [{
    en: { type: String },
    cn: { type: String }
  }],
  is_custom: {
    type: Boolean,
    default: false
  },
  audio_url: { type: String },
  created_at: { type: Date, default: Date.now }
});

export const Word = mongoose.models.Word || mongoose.model<IWord>('Word', WordSchema);

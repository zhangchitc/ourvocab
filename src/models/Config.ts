import mongoose, { Schema, Document } from 'mongoose';

export interface IConfig extends Document {
  key: string;
  value: unknown;
  updated_at: Date;
}

const ConfigSchema = new Schema<IConfig>({
  key: {
    type: String,
    required: true,
    unique: true
  },
  value: {
    type: Schema.Types.Mixed
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

export const Config = mongoose.models.Config || mongoose.model<IConfig>('Config', ConfigSchema);

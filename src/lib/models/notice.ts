import { Schema, model, models, Document } from 'mongoose';

export interface INotice extends Document {
  title: string;
  description: string;
  content: string;
  tags: string[];
  thumbnail_url?: string;
  banner_url?: string;
  createdAt: Date;
  updatedAt: Date;
}

const noticeSchema = new Schema<INotice>({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  },
  content: {
    type: String,
    required: true
  },
  tags: {
    type: [String],
    default: [],
    validate: {
      validator: function(tags: string[]) {
        return tags.length <= 10;
      },
      message: 'Cannot have more than 10 tags'
    }
  },
  thumbnail_url: {
    type: String,
    trim: true
  },
  banner_url: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

noticeSchema.index({ title: 'text', description: 'text', content: 'text' });
noticeSchema.index({ tags: 1 });
noticeSchema.index({ createdAt: -1 });

export const Notice = models.Notice || model<INotice>('Notice', noticeSchema);
import mongoose, { Schema, Document } from 'mongoose'

export interface IKnowledgeBase extends Document {
  name: string
  userId: mongoose.Types.ObjectId
  files: mongoose.Types.ObjectId[]
  links: mongoose.Types.ObjectId[]
}

const KnowledgeBaseSchema = new Schema<IKnowledgeBase>(
  {
    name: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    files: [{ type: Schema.Types.ObjectId, ref: 'File' , default: []}],
    links: [{ type: Schema.Types.ObjectId, ref: 'Link' , default: []}],
  },
  { timestamps: true }
)

export default mongoose.models.KnowledgeBase ||
  mongoose.model<IKnowledgeBase>('KnowledgeBase', KnowledgeBaseSchema)

import mongoose, { Schema, Document } from 'mongoose'

export interface ILink extends Document {
    url: string
    knowledgeBaseId: mongoose.Types.ObjectId
  }
  
  const LinkSchema = new Schema<ILink>(
    {
      url: { type: String, required: true },
      knowledgeBaseId: { type: Schema.Types.ObjectId, ref: 'KnowledgeBase' },
    },
    { timestamps: true }
  )
  
export default mongoose.models.Link ||  mongoose.model<ILink>('Link', LinkSchema)
  
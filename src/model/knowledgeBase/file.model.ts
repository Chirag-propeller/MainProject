import mongoose, { Schema, Document } from 'mongoose'

export interface IFile extends Document {
    name: string
    path?: string
    url?: string
    size: number
    type: string
    source: 'upload' | 'text' 
    knowledgeBaseId?: mongoose.Types.ObjectId
    agentId?: mongoose.Types.ObjectId
    userId: mongoose.Types.ObjectId
  }
  
  const FileSchema = new Schema<IFile>(
    {
      name: { type: String, required: true },
      path: { type: String },
      url: { type: String },
      size: { type: Number },
      type: { type: String },
      source: { type: String, enum: ['upload', 'text'], default: 'upload' },
      knowledgeBaseId: { type: Schema.Types.ObjectId, ref: 'KnowledgeBase' },
      agentId: { type: Schema.Types.ObjectId, ref: 'Agent' },
      userId: { type: Schema.Types.ObjectId, ref: 'User' },
    },
    { timestamps: true }

  )
  
  export default mongoose.models.File ||
    mongoose.model<IFile>('File', FileSchema)


